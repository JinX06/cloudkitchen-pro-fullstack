const Recipe = require("../../models/Recipe");
const Inventory = require("../../models/Inventory");
const { parseIngredient } = require("../../utils/availability");

const difficultyMapping = { "Easy": 1, "Medium": 2, "Hard": 3 };
const labelMapping = { 1: "Easy", 2: "Medium", 3: "Hard" };

function scoreToDifficultyLabel(score) {
  const rounded = Math.round(score);
  return labelMapping[rounded];
}

async function getSmartRecipeRecommendationsPage(req, res, next) {
  try {
    const now = new Date();

    const inventoryDocs = await Inventory.find({}).lean();
    const recipeDocs = await Recipe.find({}).lean();

    // Combined aggregation using $facet for latest recipes and cuisine buckets
    const aggregationResult = await Recipe.aggregate([
      {
        $facet: {
          latest: [
            { $sort: { createdAt: -1 } },
            { $limit: 4 },
            {
              $project: {
                _id: 0,
                recipeId: 1,
                title: 1,
                chef: 1,
                cuisineType: 1,
                difficulty: 1,
                prepTime: 1,
                createdAt: 1
              }
            }
          ],
          cuisines: [
            {
              $group: {
                _id: "$cuisineType",
                totalRecipes: { $sum: 1 },
                totalPrepTime: { $sum: "$prepTime" },
                totalDifficulty: {
                  $sum: {
                    $switch: {
                      branches: [
                        { case: { $eq: ["$difficulty", "Easy"] }, then: difficultyMapping.Easy },
                        { case: { $eq: ["$difficulty", "Medium"] }, then: difficultyMapping.Medium },
                        { case: { $eq: ["$difficulty", "Hard"] }, then: difficultyMapping.Hard }
                      ],
                      default: 0
                    }
                  }
                },
                recipes: { $addToSet: "$title" } // make  unique recipe titles
              }
            },
            {
              $project: {
                _id: 0,
                cuisineType: "$_id",
                totalRecipes: 1,
                avgPrepTime: { $divide: ["$totalPrepTime", "$totalRecipes"] },
                avgDifficultyScore: { $divide: ["$totalDifficulty", "$totalRecipes"] },
                recipes: 1
              }
            },
            { $sort: { totalRecipes: -1, cuisineType: 1 } }
          ]
        }
      }
    ]);

    const latestRecipesRaw = aggregationResult[0].latest;
    const cuisineBuckets = aggregationResult[0].cuisines;

    // Use the parseIngredient helper to extract a consistent label
    const extractIngredientLabel = (value) => {
      const parsed = parseIngredient(value);
      return parsed.item.trim();
    };

    // Create a "list" of inventory items by the ingredient name
    const inventoryByIngredient = {};
    inventoryDocs.forEach((doc) => {
      const label = extractIngredientLabel(doc.ingredientName);
      if (!label) {
        return;
      }
      const key = label.toLowerCase();

      const expirationDate = new Date(doc.expirationDate);
      const daysLeft = Math.floor((expirationDate.getTime() - now.getTime()) / (24 * 60 * 60 * 1000));
      const numericQuantity = Number(doc.quantity);

      const entry = {
        inventoryId: doc.inventoryId,
        name: doc.ingredientName,
        quantity: doc.quantity,
        numericQuantity,
        unit: doc.unit,
        daysLeft
      };

      if (!inventoryByIngredient[key]) {
        inventoryByIngredient[key] = [];
      }
      inventoryByIngredient[key].push(entry);
    });

    // Track which ingredients are used in which recipes
    const ingredientUsage = {};
    // Will store recipe cookability stats stuff
    const recipeAnalysisResults = [];
    
    // Analyze each recipe for ingredient availability
    recipeDocs.forEach((recipe) => {
      const ingredients = Array.isArray(recipe.ingredients) ? recipe.ingredients : [];

    // Parse and normalize ingredient names for consistent matching
    const ingredientDetails = ingredients
      .map((raw) => {
        const label = extractIngredientLabel(raw);
        return { raw, label };})

      // Track which ingredients we have and which we're missing
      const availableIngredients = [];
      const missingIngredients = new Set();
      const seenForRecipe = new Set();

      // Process each ingredient in the recipe
      ingredientDetails.forEach((item) => {
        const key = item.label.toLowerCase();

        // First time seeing this ingredient? Initialize tracking for it
        if (!ingredientUsage[key]) {
          ingredientUsage[key] = {
            label: item.label,
            recipes: new Set(),
            recipeCount: 0
          };
        }

        // Add this recipe to the ingredient's usage info
        ingredientUsage[key].recipes.add(recipe.title);

        // Count unique ingredients per recipe
        if (!seenForRecipe.has(key)) {
          ingredientUsage[key].recipeCount += 1;
          seenForRecipe.add(key);
        }

        // Check if we have this ingredient in inventory
        const candidates = inventoryByIngredient[key] || [];
        if (candidates.length) {
          const match = candidates[0];
          availableIngredients.push({
            inventoryId: match.inventoryId,
            name: match.name,
            quantity: match.quantity,
            unit: match.unit,
            daysLeft: match.daysLeft
          });
        } else {
          // We don't have this ingredient
          missingIngredients.add(item.label);
        }
      });

      // Calculate cookability score (percentage of ingredients available)
      const matchedCount = availableIngredients.length;
      const totalIngredients = ingredientDetails.length;
      let cookabilityScore;
      if (totalIngredients > 0) {
        cookabilityScore = Math.round((matchedCount / totalIngredients) * 100);
      } else {
        cookabilityScore = 0;
      }
      
      // Determine recipe status based on score
      let cookabilityStatus;
      if (cookabilityScore === 100) {
        cookabilityStatus = "Ready to cook";
      } else if (cookabilityScore >= 50) {
        cookabilityStatus = "Almost ready";
      } else {
        cookabilityStatus = "Needs restock";
      }

      // Store analysis results for this recipe
      recipeAnalysisResults.push({
        recipeId: recipe.recipeId,
        title: recipe.title,
        chef: recipe.chef,
        cuisineType: recipe.cuisineType,
        difficulty: recipe.difficulty,
        prepTime: recipe.prepTime,
        createdAt: recipe.createdAt,
        cookabilityScore,
        cookabilityStatus,
        matchedCount,
        totalIngredients,
        missingIngredients: Array.from(missingIngredients).sort(),
        availableIngredients
      });
    });

    // Get top 6 most cookable recipes
    const cookabilityRecommendations = recipeAnalysisResults
      .sort((a, b) => {
        // Sort by cookability score first
        if (b.cookabilityScore !== a.cookabilityScore) {
          return b.cookabilityScore - a.cookabilityScore;
        }
        // Then by number of matched ingredients
        if (b.matchedCount !== a.matchedCount) {
          return b.matchedCount - a.matchedCount;
        }
        // Finally by creation date (newest first)z
        const dateA = new Date(a.createdAt);
        const dateB = new Date(b.createdAt);
        return dateB - dateA;
      })
      .slice(0, 6);

    // Analyze which ingredients need attention
    const ingredientAlerts = Object.entries(ingredientUsage).map(([key, usage]) => {
        const inventoryMatches = inventoryByIngredient[key] || [];
        const topMatch = inventoryMatches[0];

        // Determine status of this ingredient
        let status = "missing";
        if (topMatch) {
          if (topMatch.daysLeft < 0) {
            status = "expired";
          } else if (topMatch.daysLeft <= 3) {
            status = "expiringSoon";
          } else if (topMatch.numericQuantity <= 1) {
            status = "low";
          } else {
            status = "healthy";
          }
        }

        return {
          ingredient: key,
          displayIngredient: usage.label,
          recipeCount: usage.recipeCount,
          recipes: Array.from(usage.recipes).sort(),
          status,
          inventory: topMatch
            ? {
                inventoryId: topMatch.inventoryId,
                quantity: topMatch.quantity,
                unit: topMatch.unit,
                daysLeft: topMatch.daysLeft
              }
            : null
        };
      })

      // Sort by frequency of use and status
      .sort((a, b) => {
        if (b.recipeCount !== a.recipeCount) {
          return b.recipeCount - a.recipeCount;
        }
        return a.status.localeCompare(b.status);
      })
      .slice(0, 12);

    // Get ingredients by status
    const expiringSoon = ingredientAlerts.filter((item) => item.status === "expiringSoon");
    const expired = ingredientAlerts.filter((item) => item.status === "expired");
    const runningLow = ingredientAlerts.filter((item) => item.status === "low");
    const missing = ingredientAlerts.filter((item) => item.status === "missing");

    // Create prioritized list of ingredients needing attention
    const inventoryOptimizationSuggestion = [];
    
    // Add ingredients in priority order
    for (const item of expiringSoon) {
      inventoryOptimizationSuggestion.push(item);
    }
    for (const item of expired) {
      inventoryOptimizationSuggestion.push(item);
    }
    for (const item of runningLow) {
      inventoryOptimizationSuggestion.push(item);
    }
    for (const item of missing) {
      inventoryOptimizationSuggestion.push(item);
    }
    
    // Limit to top 8 items
    const topPriorities = inventoryOptimizationSuggestion.slice(0, 8);
    
    // Format latest recipes for display
    const latestRecipes = [];
    latestRecipesRaw.forEach((recipe) => {
      latestRecipes.push({
        recipeId: recipe.recipeId,
        title: recipe.title,
        chef: recipe.chef,
        cuisineType: recipe.cuisineType,
        difficulty: recipe.difficulty,
        prepTime: recipe.prepTime,
        createdAt: recipe.createdAt 
      });
    });

    // Format cuisine summary for display
    const cuisineSummary = [];
    cuisineBuckets.forEach((bucket) => {
      const avgPrepTime = Math.round(bucket.avgPrepTime);
      const avgDifficultyScore = Math.round(bucket.avgDifficultyScore * 10) / 10;
      cuisineSummary.push({
        cuisineType: bucket.cuisineType,
        totalRecipes: bucket.totalRecipes,
        avgPrepTime,
        avgDifficultyScore,
        difficultyLabel: scoreToDifficultyLabel(avgDifficultyScore),
          recipes: bucket.recipes.sort()
      });
    });

    res.render("hd/smart-recipe-recommendations.html", {
      cookabilityRecommendations,
      latestRecipes,
      cuisineSummary,
      expiringSoon,
      expired,
      inventoryOptimizationSuggestion: topPriorities,
    });
  } catch (err) {
    return next(err);
  }
}

module.exports = {
  getSmartRecipeRecommendationsPage,
};
