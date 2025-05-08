import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { prompt } = req.body;
  if (!prompt) {
    return res.status(400).json({ error: "No prompt provided" });
  }

  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: "No OpenAI API key set" });
  }

  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content: `あなたは医療面談に同席するプロフェッショナルな支援者です。
      ユーザー（患者）が入力した症状や病名に基づいて、
      「患者が医師に診察時に聞くべき質問」を日本語で**10個、箇条書き**で生成してください。
      
      以下の点に特に留意してください：
      - 医師から患者に対する質問ではなく、**患者から医師に対する質問**だけを含めること
      - 質問は、不安の解消・治療方針の理解・生活への影響の把握に役立つものにすること
      - 質問文の主語は不要です（例：「どのような副作用がありますか？」など）
      
      不明確な内容は補わず、「典型的な質問例」として作成してください。
            `.trim(),
          },
          {
            role: "user",
            content: prompt,
          },
        ],
        max_tokens: 500,
        temperature: 0.7,
      }),
    });

    const data = await response.json();
    if (data.error) {
      return res.status(500).json({ error: data.error.message });
    }

    const answer = data.choices?.[0]?.message?.content ?? "";
    res.status(200).json({ result: answer });
  } catch (error: any) {
    res.status(500).json({ error: error.message || "Unknown error" });
  }
} 