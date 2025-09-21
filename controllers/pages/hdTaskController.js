const Recipe = require("../../models/Recipe");
const Inventory = require("../../models/Inventory");
const { parseIngredient } = require("../../utils/availability");

const difficultyMapping = { "Easy": 1, "Medium": 2, "Hard": 3 };
const labelMapping = { 1: "Easy", 2: "Medium", 3: "Hard" };

function scoreToDifficultyLabel(score) {
  const rounded = Math.round(score);
  return labelMapping[rounded];
}

// HD TASK 1
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

        // Add ingredient to a set if new (unique ingredients)
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

// HD TASK 3
async function getRecipeAnalyticsDashboard(req, res, next) {
  try {
    // Recipe Performance Analytics for most popular recipes
    const popularRecipes = await Recipe.aggregate([
      {
        $addFields: {
          reviewCount: { $size: "$reviews" },
          totalRatings: { $sum: "$ratings" }
        }
      },
      {
        $sort: { reviewCount: -1, avgRating: -1 }
      },
      {
        $limit: 5
      },
      {
        $project: {
          _id: 0,
          recipeId: 1,
          title: 1,
          chef: 1,
          reviewCount: 1,
          avgRating: 1,
          difficulty: 1,
          cuisineType: 1
        }
      }
    ]);

    // Ingredient Usage Analysis
    const ingredientUsage = await Recipe.aggregate([
      { $unwind: "$ingredients" },
      {
        $group: {
          _id: { $toLower: { $trim: { input: { $arrayElemAt: [{ $split: ["$ingredients", " "] }, -1] } } } },
          count: { $sum: 1 },
          recipes: { $addToSet: "$title" }
        }
      },
      { $match: { _id: { $ne: "" } } },
      { $sort: { count: -1 } },
      { $limit: 10 },
      {
        $project: {
          _id: 0,
          ingredient: "$_id",
          count: 1,
          recipes: { $slice: ["$recipes", 3] }
        }
      }
    ]);

    // User Recipe Insights - recipes by chef
    const recipesByChef = await Recipe.aggregate([
      {
        $group: {
          _id: "$chef",
          recipeCount: { $sum: 1 },
          avgRating: { $avg: "$avgRating" },
          cuisineTypes: { $addToSet: "$cuisineType" },
          difficultyDistribution: {
            $push: "$difficulty"
          }
        }
      },
      {
        $project: {
          _id: 0,
          chef: "$_id",
          recipeCount: 1,
          avgRating: 1,
          cuisineTypes: 1,
          easyCount: {
            $size: {
              $filter: {
                input: "$difficultyDistribution",
                as: "diff",
                cond: { $eq: ["$$diff", "Easy"] }
              }
            }
          },
          mediumCount: {
            $size: {
              $filter: {
                input: "$difficultyDistribution",
                as: "diff",
                cond: { $eq: ["$$diff", "Medium"] }
              }
            }
          },
          hardCount: {
            $size: {
              $filter: {
                input: "$difficultyDistribution",
                as: "diff",
                cond: { $eq: ["$$diff", "Hard"] }
              }
            }
          }
        }
      },
      { $sort: { recipeCount: -1 } },
      { $limit: 5 }
    ]);

    // Cuisine Distribution
    const cuisineDistribution = await Recipe.aggregate([
      {
        $group: {
          _id: "$cuisineType",
          count: { $sum: 1 },
          avgPrepTime: { $avg: "$prepTime" },
          avgRating: { $avg: "$avgRating" },
          recipes: { $push: "$title" }
        }
      },
      {
        $project: {
          _id: 0,
          cuisineType: "$_id",
          count: 1,
          avgPrepTime: { $round: ["$avgPrepTime", 1] },
          avgRating: { $round: ["$avgRating", 1] },
          recipes: { $slice: ["$recipes", 3] }
        }
      },
      { $sort: { count: -1 } }
    ]);

    // Difficulty Distribution
    const difficultyDistribution = await Recipe.aggregate([
      {
        $group: {
          _id: "$difficulty",
          count: { $sum: 1 },
          avgPrepTime: { $avg: "$prepTime" },
          avgRating: { $avg: "$avgRating" }
        }
      },
      {
        $project: {
          _id: 0,
          difficulty: "$_id",
          count: 1,
          avgPrepTime: { $round: ["$avgPrepTime", 1] },
          avgRating: { $round: ["$avgRating", 1] },
          percentage: { $multiply: [{ $divide: ["$count", { $literal: await Recipe.countDocuments() }] }, 100] }
        }
      },
      { $sort: { count: -1 } }
    ]);

    // Meal Type Distribution
    const mealTypeDistribution = await Recipe.aggregate([
      {
        $group: {
          _id: "$mealType",
          count: { $sum: 1 },
          avgPrepTime: { $avg: "$prepTime" }
        }
      },
      {
        $project: {
          _id: 0,
          mealType: "$_id",
          count: 1,
          avgPrepTime: { $round: ["$avgPrepTime", 1] },
          percentage: { $multiply: [{ $divide: ["$count", { $literal: await Recipe.countDocuments() }] }, 100] }
        }
      },
      { $sort: { count: -1 } }
    ]);

    // Get inventory data (used by both cost analysis and 90%+ suggestions)
    const inventoryItems = await Inventory.find({}).lean();

    // Normalise label helper using parseIngredient
    const normalize = (val) => {
      const parsed = parseIngredient(String(val || ""));
      return String(parsed && parsed.item ? parsed.item : val).toLowerCase().trim();
    };

    // Build an inventory index keyed by normalised ingredient label
    const inventoryIndex = {};
    inventoryItems.forEach(item => {
      const key = normalize(item.ingredientName);
      if (!key) return;
      if (!inventoryIndex[key]){
        inventoryIndex[key] = [];
      }
      const qty = Number(item.quantity) || 0;
      const totalCost = Number(item.cost) || 0; // use 'cost' from Inventory model
      const unitCost = qty > 0 ? totalCost / qty : totalCost; // fallback if qty missing
      inventoryIndex[key].push({
        unitCost, // cost per 1 unit
        unit: item.unit,
        quantity: qty,
        name: item.ingredientName,
        totalCost
      });
    });
    const inventoryKeys = Object.keys(inventoryIndex);
    
    // Helper to find best matching inventory key for a given ingredient label
    const findInventoryKey = (label) => {
      const l = normalize(label);
      if (!l) return null;
      if (inventoryIndex[l]) return l;
      const found = inventoryKeys.find(k => l.includes(k) || k.includes(l));
      return found || null;
    };

    // Cost Analysis - Use recipe data with inventory prices
    const recipeCostAnalysis = await Recipe.aggregate([
      {
        $project: {
          title: 1,
          ingredientCount: { $size: "$ingredients" },
          ingredients: 1
        }
      },
      { $sort: { ingredientCount: -1 } },
      { $limit: 10 }
    ]);

    // Estimate costs based on ingredient matches (uses unitCost * qty parsed from ingredient)
    for (const recipe of recipeCostAnalysis) {
      let estimatedCost = 0;
      let matchedIngredients = 0;

      (recipe.ingredients || []).forEach(ingredient => {
        const key = findInventoryKey(ingredient);
        if (key) {
          const entries = inventoryIndex[key];
          // Average unit cost across matching inventory entries
          const avgUnitCost = entries.length ? entries.reduce((sum, e) => sum + (Number(e.unitCost) || 0), 0) / entries.length : 0;

          // Use parsed quantity if present, otherwise assume 1
          const parsed = parseIngredient(ingredient);
          const qty = Number(parsed.qty) || 1;

          estimatedCost += avgUnitCost * qty;
          matchedIngredients++;
        }
      });

      recipe.estimatedCost = Number(estimatedCost.toFixed(2));
      recipe.matchedIngredients = matchedIngredients;
    }

    // Sort by estimated cost
    recipeCostAnalysis.sort((a, b) => b.estimatedCost - a.estimatedCost);

    // 90%+ Suggested Recipes (cookability)
    const allRecipes = await Recipe.find({}).lean();

    const highCookabilitySuggestions = [];
    allRecipes.forEach(r => {
      const ing = Array.isArray(r.ingredients) ? r.ingredients : [];
      const total = ing.length;
      if (total === 0) return;

      let matched = 0;
      ing.forEach(line => {
        if (findInventoryKey(line)) matched++;
      });

      const percent = Math.round((matched / total) * 100);
      if (percent >= 90) {
        highCookabilitySuggestions.push({
          recipeId: r.recipeId,
          title: r.title,
          chef: r.chef,
          cuisineType: r.cuisineType,
          difficulty: r.difficulty,
          prepTime: r.prepTime,
          matched,
          total,
          percent,
          avgRating: r.avgRating || 0
        });
      }
    });

    highCookabilitySuggestions.sort((a, b) => {
      if (b.percent !== a.percent) return b.percent - a.percent;
      if (b.matched !== a.matched) return b.matched - a.matched;
      return (b.avgRating || 0) - (a.avgRating || 0);
    });

    res.render("hd/recipe-analytics-dashboard.html", {
      popularRecipes,
      ingredientUsage,
      recipesByChef,
      cuisineDistribution,
      difficultyDistribution,
      mealTypeDistribution,
      recipeCostAnalysis,
      highCookabilitySuggestions
    });
  } catch (err) {
    return next(err);
  }
}

// HD TASK 4
async function getSmartInventoryManagementPage(req, res, next) {
  try {
    const now = new Date();

    //Inventory Waste Prediction (expiring in next 3 days)
    const expiringItems = await Inventory.aggregate([
      {
        $addFields: {
          daysUntilExpiration: {
            $divide: [{ $subtract: ["$expirationDate", now] }, 1000 * 60 * 60 * 24]
          }
        }
      },
      {
        $match: {
          daysUntilExpiration: { $gte: 0, $lte: 3 }
        }
      },
      {
        $project: {
          _id: 0,
          inventoryId: 1,
          ingredientName: 1,
          quantity: 1,
          unit: 1,
          expirationDate: 1,
          daysUntilExpiration: { $round: ["$daysUntilExpiration", 1] },
          valueAtRisk: "$cost"
        }
      },
      { $sort: { daysUntilExpiration: 1 } }
    ]);

    // Case-insensitive set of expiring ingredient *item* names (normalized)
    const expiringSet = new Set(
      expiringItems
        .map(i => parseIngredient(String(i.ingredientName || "")).item.toLowerCase().trim())
        .filter(Boolean)
    );

    let recipeMatches = [];
    if (expiringSet.size) {
      // Pull just what we need from Mongo, then compute matches in JS (no $regexMatch)
      const candidates = await Recipe.find(
        {},
        { recipeId: 1, title: 1, ingredients: 1, avgRating: 1, prepTime: 1, difficulty: 1 }
      ).lean();

      recipeMatches = candidates
        .map(r => {
          // normalize each recipe ingredient using the same helper
          const ingNames = (Array.isArray(r.ingredients) ? r.ingredients : [])
            .map(raw => parseIngredient(String(raw || "")).item.toLowerCase().trim())
            .filter(Boolean);

          // count exact matches against the expiring set
          let matched = 0;
          for (const name of ingNames) {
            if (expiringSet.has(name)) {
              matched++;
            }
          }

          return {
            recipeId: r.recipeId,
            title: r.title,
            matchedIngredients: matched,
            avgRating: r.avgRating || 0,
            prepTime: r.prepTime,
            difficulty: r.difficulty
          };
        })
        .filter(r => r.matchedIngredients > 0)
        .sort((a, b) => {
          if (b.matchedIngredients !== a.matchedIngredients) return b.matchedIngredients - a.matchedIngredients; // more matches first
          if ((b.avgRating || 0) !== (a.avgRating || 0)) return (b.avgRating || 0) - (a.avgRating || 0); // higher review rating next
          return (a.prepTime || 0) - (b.prepTime || 0);  // shorter prep time last
        })
        .slice(0, 6);
    }

    // Cost Analysis Dashboard by category
    const inventoryValue = await Inventory.aggregate([
      {
        $group: {
          _id: "$category",
          totalValue: { $sum: "$cost" },
          itemCount: { $sum: 1 },
          averagePrice: { $avg: "$cost" },
          items: {
            $push: {
              name: "$ingredientName",
              value: "$cost",
              quantity: "$quantity",
              unit: "$unit"
            }
          }
        }
      },
      {
        $project: {
          _id: 0,
          category: "$_id",
          totalValue: { $round: ["$totalValue", 2] },
          itemCount: 1,
          averagePrice: { $round: ["$averagePrice", 2] },
          items: 1
        }
      },
      { $sort: { totalValue: -1 } }
    ]);

    // Overall inventory stats
    const inventoryStatsAgg = await Inventory.aggregate([
      {
        $addFields: {
          msLeft: { $subtract: ["$expirationDate", now] }
        }
      },
      {
        $group: {
          _id: null,
          totalItems: { $sum: 1 },
          totalValue: { $sum: "$cost" },
          avgPrice: { $avg: "$cost" },
          // Count items expiring within the next 3 days by summing 1 (true) or 0 (false) per document.
          expiringItems: {
            $sum: {
              $cond: [
                {
                  $and: [
                    { $gte: ["$msLeft", 0] }, // not expired yet
                    { $lte: ["$msLeft", 1000 * 60 * 60 * 24 * 3] } // within 3 days
                  ]
                }, 1, // if true, 1 (count it)
                0  // if false, 0 (don't count)
              ]
            }
          }
        }
      },
      {
        $project: {
          _id: 0,
          totalItems: 1,
          totalValue: { $round: ["$totalValue", 2] },
          avgPrice: { $round: ["$avgPrice", 2] },
          expiringItems: 1
        }
      }
    ]);
    const inventoryStats = inventoryStatsAgg[0]

    res.render("hd/smart-inventory-management.html", {
      expiringItems,
      recipeMatches,
      inventoryValue,
      inventoryStats
    });
  } catch (err) {
    return next(err);
  }
}

module.exports = {
  getSmartRecipeRecommendationsPage,
  getRecipeAnalyticsDashboard,
  getSmartInventoryManagementPage
};
