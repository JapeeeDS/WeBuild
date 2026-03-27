import OpenAI from "openai";

export default async function handler(req, res) {
  const client = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });

  try {
    const response = await client.responses.create({
      model: "gpt-4.1-mini",
      input:
        "Translate the following text to English (if it is already in English, keep it as is). Fix grammar, spelling, and punctuation. Return ONLY the corrected text:\n\n" +
        req.body.text,
    });

    let result = "";

    if (response.output) {
      for (const item of response.output) {
        if (item.type === "message") {
          for (const c of item.content) {
            if (c.type === "output_text") result += c.text;
          }
        }
      }
    }

    res.status(200).json({ result });
  } catch (e) {
    res.status(500).json({ error: "Server error" });
  }
}