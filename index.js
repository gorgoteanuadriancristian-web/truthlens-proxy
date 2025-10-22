import express from "express";
import cors from "cors";
import axios from "axios";

const app = express();
app.use(cors());
app.use(express.json());

const DEEPSEEK_KEY = process.env.DEEPSEEK_API_KEY;

app.post("/verify-text", async (req, res) => {
  try {
    const { text } = req.body;

    const response = await axios.post(
      "https://api.deepseek.com/v1/chat/completions",
      {
        model: "deepseek-chat",
        messages: [
          {
            role: "system",
            content:
              "Ești un asistent care verifică veridicitatea afirmațiilor. Răspunde concis, în limba română.",
          },
          {
            role: "user",
            content: `Verifică dacă afirmația următoare este adevărată sau falsă: ${text}`,
          },
        ],
      },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${DEEPSEEK_KEY}`,
        },
      }
    );

    res.json({ verdict: response.data.choices[0].message.content });
  } catch (err) {
    console.error("Eroare DeepSeek:", err.response?.data || err.message);
    res.status(500).json({
      error: "Eroare la DeepSeek",
      details: err.response?.data || err.message,
    });
  }
});

app.listen(10000, () => console.log("Serverul rulează pe portul 10000"));
