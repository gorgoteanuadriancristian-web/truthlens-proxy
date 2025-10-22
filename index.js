require('dotenv').config();
const express = require('express');
const cors = require('cors');
const axios = require('axios');

const app = express();
app.use(cors());
app.use(express.json());

const GEMINI_KEY = process.env.GEMINI_API_KEY;
if (!GEMINI_KEY) {
  console.warn('⚠️ Lipsă GEMINI_API_KEY în environment!');
}

app.post('/verify-text', async (req, res) => {
  const { text } = req.body;
  if (!text) return res.status(400).json({ error: 'Lipsește textul' });

  try {
    const response = await axios.post(
   `https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent?key=${GEMINI_KEY}`,,
      {
        contents: [
          {
            parts: [
              {
                text: `Ești un verificator de fapte. Spune clar dacă textul următor este adevărat, fals sau incert, și oferă o explicație scurtă: "${text}"`
              }
            ]
          }
        ]
      }
    );

    const answer =
      response.data?.candidates?.[0]?.content?.parts?.[0]?.text ||
      'Niciun răspuns de la AI.';

    res.json({ verdict: answer });
  } catch (err) {
    console.error('Eroare la Gemini:', err.response?.data || err.message);
    res.status(500).json({ error: 'Eroare la Gemini', details: err.message });
  }
});

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`✅ Server Gemini pornit pe portul ${port}`));
