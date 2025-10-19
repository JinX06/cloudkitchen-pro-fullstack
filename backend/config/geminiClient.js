const { GoogleGenerativeAI } = require('@google/generative-ai');

require('dotenv').config();

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);
function getGeminiModel() {
  if (!genAI) {
    throw new Error('Google API key is not configured.');
  }

  return genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });
}

module.exports = {
  getGeminiModel,
  isConfigured: () => Boolean(getApiKey()),
};
