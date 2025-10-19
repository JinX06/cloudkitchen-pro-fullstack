const express = require('express');

const router = express.Router();

const { requireAuth } = require('../../middleware/auth');
const { translateRecipeText } = require('../../controllers/api/translateController');

router.use(requireAuth);

router.post('/translate-34076352', translateRecipeText);

module.exports = router;
