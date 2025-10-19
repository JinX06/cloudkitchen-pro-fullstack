const { getGeminiModel } = require('../../config/geminiClient');

function buildPrompt({ ingredients, title }) {
  return (
      `You are an AI nutrition assistant model that analyzes the healthiness of recipes and suggests improvements.
      Task:
      - Read the provided ingredients.
      - Assess the healthiness of the recipe.
      - List key health concerns and provide improvement suggestions.

      Recipe details:
      ${title}

      Ingredients:
      ${ingredients}

      Output requirements:
      - Respond with a SINGLE JSON object only (no additional texts before/after).
      - No markdown structures or backticks (like * or **).
      - Plain text strings only. DO NOT include emojis or special formatting.
      - Valid JSON (no comments, no trailing commas).

      JSON structure:
      {
        "healthScore": number,
        "concerns": string[],
        "suggestions": string[]
      }

      Rules:
      - healthScore must be an integer between 0 and 100.
      - Keep each array entry concise (<= 100 chars).
      - Keep concerrns and suggestions brief and concise.
      - Limit to max 8 items in each array.
      `
  );
}

function normaliseResult(result) {
  const parsed = result || {};

  const healthScore = Number(parsed.healthScore);
  const concerns = parsed.concerns; // list of strings
  const suggestions = parsed.suggestions; // list of strings

  return {
    healthScore,
    concerns,
    suggestions,
  };
}

async function callGoogle(prompt) {
  const model = getGeminiModel();
  const result = await model.generateContent(prompt);
  const response = await result.response;
  const text = response.text();

  const json = JSON.parse(text);
  if (!json) {
    throw new Error('Unable to parse AI response from Google provider.');
  }

  return normaliseResult(json);
}

async function analyzeRecipeHealth(req, res) {
  try {
    const { userId } = req.query;
    if (!userId || !req.currentUser || req.currentUser.userId !== userId) {
      return res.status(403).json({ error: 'Authentication required' });
    }

    const { ingredients, title } = req.body || {};
    const ingredientText = ingredients.trim();

    const prompt = buildPrompt({
      ingredients: ingredientText,
      title: title,
    });

    let result = await callGoogle(prompt);

    return res.status(200).json(result);
  } catch (err) {
    console.error('AI health analysis failed:', err.message);
    return res.status(500).json({ error: 'AI service unavailable', detail: err.message });
  }
}

module.exports = {
  analyzeRecipeHealth,
};
