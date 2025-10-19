require('dotenv').config();
const { Translate } = require('@google-cloud/translate').v2;

const translateClient = new Translate({ keyFilename: process.env.GOOGLE_APPLICATION_CREDENTIALS});
async function translateRecipeText(req, res) {
  try {
    const { userId } = req.query;
    if (!userId || !req.currentUser || req.currentUser.userId !== userId) {
      return res.status(403).json({ error: 'Authentication required' });
    }

    const {
      title = '',
      instructions = '',
      ingredients = [],
      targetLang,
    } = req.body || {};

    const [translatedTitle] = await translateClient.translate(title, targetLang);
    const [translatedInstructions] = await translateClient.translate(instructions, targetLang);
    const [translatedIngredients] = await translateClient.translate(ingredients, targetLang);

    return res.status(200).json({
      title: translatedTitle,
      instructions: translatedInstructions,
      ingredients: translatedIngredients,
    });
  } catch (error) {
    console.log('Translate failed:', error.message);
    return res.status(500).json({ error: 'Translate unavailable' });
  }
}

module.exports = {
  translateRecipeText,
};
