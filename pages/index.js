import { useState } from "react"

export default function Home() {
  const [input, setInput] = useState("")
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState(null)

  const handleCheck = async () => {
    setLoading(true)
    const res = await fetch("/api/check-risk", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text: input }),
    })
    const data = await res.json()
    setResult(data)
    setLoading(false)
  }

  return (
    <div style={{ maxWidth: 600, margin: "2rem auto", fontFamily: "sans-serif" }}>
      <h1>🧪 SNS에 쓸까말까 알려줌 </h1>
      <textarea rows={5} value={input} onChange={(e) => setInput(e.target.value)} style={{ width: "100%", marginTop: 10 }} />
      <button onClick={handleCheck} disabled={!input || loading} style={{ marginTop: 10 }}>
        {loading ? "분석 중..." : "분석하기"}
      </button>

      {result && (
        <div style={{ marginTop: 20, border: "1px solid #ccc", padding: 10 }}>
          <h3>📌 공감성 수치: {result.cringeScore}%</h3>
          <ul>{result.cringeReasons.map((r, i) => <li key={i}>{r}</li>)}</ul>
          <h3>📌 속내 투명도: {result.exposureScore}%</h3>
          <ul>{result.exposureReasons.map((r, i) => <li key={i}>{r}</li>)}</ul>
          {(result.cringeScore >= 70 || result.exposureScore >= 70) && <p style={{ color: "red" }}>⚠️ 사회적 리스크 있음!</p>}
        </div>
      )}
    </div>
  )
}
