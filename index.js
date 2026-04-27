require("dotenv").config();

const functions = require("firebase-functions");
const fetch = require("node-fetch");

exports.askAI = functions.https.onRequest(async (req, res) => {
  if (!req.body) {
    req.body = JSON.parse(req.rawBody.toString());
  }

  // ✅ CORS fix
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");

  if (req.method === "OPTIONS") {
    return res.status(204).send("");
  }

  try {
    const API_KEY = process.env.GEMINI_API_KEY;

    if (!API_KEY) {
      return res.status(500).json({ error: "API KEY missing" });
    }

    const userText = req.body?.text;

    if (!userText) {
      return res.status(400).json({ error: "Text missing" });
    }

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent?key=${API_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: `Analyze the following user problem:"${userText}"
              Rules:- If the text is NOT a real problem, return:{"priority":"Low","category":"Invalid"}
                    - If it is a real problem, classify into: Medical / Electrician / Plumber
                    - Priority: High → emergency (injury, accident, fire, etc.)
                                Low → normal issue
                      Return ONLY JSON:
                      {"priority":"High/Low","category":"Medical/Electrician/Plumber/Invalid"}`
            }]
          }]
        })
      }
    );

    const data = await response.json();
    return res.json(data);

  } catch (err) {
    console.error("Function error:", err);
    return res.status(500).json({ error: err.message });
  }
});