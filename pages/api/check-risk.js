export default async function handler(req, res) {
  const { text } = req.body;

  const prompt = `다음 문장을 분석해줘.

1. 공감성 수치 (0~100): 감정 과잉, 오글거림, 자의식 과잉
2. 속내 투명도 (0~100): 우월감, 비교, 감정 숨김 실패 등

각 항목에서 점수를 매기고, 이유를 2~3줄로 설명해줘.
결과는 JSON 형식으로 이렇게 만들어줘:

{
  "cringeScore": 숫자,
  "cringeReasons": ["이유1", "이유2"],
  "exposureScore": 숫자,
  "exposureReasons": ["이유1", "이유2"]
}

문장: ${text}`;

  try {
    const completion = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-4",
        messages: [{ role: "user", content: prompt }],
      }),
    });

    const json = await completion.json();
    console.log("GPT 응답 원문:", JSON.stringify(json, null, 2));

    const content = json.choices?.[0]?.message?.content || "";
    const match = content.match(/\{[\s\S]*\}/);
    if (!match) {
      return res.status(200).json({
        error: "GPT 응답이 JSON 형식이 아님",
        content,
      });
    }

    const data = JSON.parse(match[0]);
    res.status(200).json(data);
  } catch (error) {
    console.error("API 오류:", error);
    res.status(500).json({ error: "서버 내부 오류", details: error.message });
  }
}