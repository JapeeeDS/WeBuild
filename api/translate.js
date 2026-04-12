import OpenAI from "openai";

export default async function handler(req, res) {
  // Only allow POST
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { text } = req.body || {};
  if (!text || !text.trim()) {
    return res.status(400).json({ error: "No text provided" });
  }

  const client = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });

  try {
    const response = await client.chat.completions.create({
      model: "gpt-4.1-mini",
      messages: [
        {
          role: "system",
          content:
            "Translate the following text to English (if it is already in English, keep it as is). Fix grammar, spelling, and punctuation. Return ONLY the corrected text.",
        },
        {
          role: "user",
          content: text,
        },
      ],
    });

    const result = response.choices?.[0]?.message?.content?.trim() || "";

    if (!result) {
      return res.status(500).json({ error: "No result from AI" });
    }

    res.status(200).json({ result });
  } catch (e) {
    console.error("Translation error:", e.message);
    res.status(500).json({ error: "Server error" });
  }
}
