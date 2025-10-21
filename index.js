require('dotenv').config();
const express = require('express');
const cors = require('cors');
const axios = require('axios');

const app = express();
app.use(cors());
app.use(express.json());

const OPENAI_KEY = process.env.OPENAI_API_KEY;
if (!OPENAI_KEY) {
  console.warn('ATENȚIE: Lipsă OPENAI_API_KEY în environment');
}

app.post('/verify-text', async (req, res) => {
  const { text } = req.body;
  if (!text) return res.status(400).json({ error: 'Lipsește textul' });

  try {
    const resp = await axios.post(
      'https://api.openai.com/v1/chat/completions',
      {
        model: "gpt-4o-mini",
        messages: [
          { role: "system", content: "Ești un verificator de fapte online. Spune dacă textul pare adevărat, fals sau incert și explică scurt de ce." },
          { role: "user", content: `Verifică următorul text: "${text}"` }
        ]
      },
      {
        headers: {
          'Authorization': `Bearer ${OPENAI_KEY}`,
          'Content-Type': 'application/json'
        }
      }
    );

    const answer = resp.data.choices?.[0]?.message?.content ?? 'Niciun răspuns.';
    res.json({ verdict: answer });
  } catch (err) {
    console.error('Eroare API:', err?.response?.data || err.message);
    res.status(500).json({ error: 'Eroare la OpenAI', details: err.message });
  }
});

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`✅ Server pornit pe portul ${port}`));
