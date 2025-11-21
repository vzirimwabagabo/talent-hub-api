const express = require('express');
const router = express.Router();

/**
 * @swagger
 * /api/v1/languages:
 *   get:
 *     summary: Retrieve a list of supported languages.
 *     description: Returns a list of language objects, each with a code and a name.
 *     responses:
 *       200:
 *         description: An array of language objects.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       code:
 *                         type: string
 *                         description: The ISO 639-1 language code.
 *                         example: "en"
 *                       name:
 *                         type: string
 *                         description: The full name of the language.
 *                         example: "English"
 */
router.get('/', (req, res) => {
  const languages = [
    { code: "en", name: "English" },
    { code: "fr", name: "French" },
    { code: "sw", name: "Swahili" },
    { code: "rw", name: "Kinyarwanda" },
  ];
  res.status(200).json({ data: languages });
});

module.exports = router;
