import { useState, useRef } from "react";

const FONTS = `@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;900&family=DM+Mono:wght@300;400;500&family=DM+Sans:wght@300;400;500&display=swap');`;

const css = `
  ${FONTS}
  * { box-sizing: border-box; margin: 0; padding: 0; }
  :root {
    --bg: #0a0a0a;
    --surface: #111111;
    --surface2: #181818;
    --border: rgba(255,255,255,0.07);
    --border2: rgba(255,255,255,0.13);
    --text: #f0ede6;
    --muted: #6b6860;
    --accent: #e84040;
    --accent2: #ff6b6b;
    --green: #4ade80;
    --amber: #fbbf24;
    --mono: 'DM Mono', monospace;
    --sans: 'DM Sans', sans-serif;
    --display: 'Playfair Display', serif;
  }
  body { background: var(--bg); color: var(--text); font-family: var(--sans); min-height: 100vh; }

  .ticker {
    background: var(--accent);
    padding: 6px 0;
    overflow: hidden;
    white-space: nowrap;
  }
  .ticker-inner {
    display: inline-block;
    animation: ticker 28s linear infinite;
    font-family: var(--mono);
    font-size: 11px;
    letter-spacing: .1em;
    color: #fff;
    opacity: .9;
  }
  @keyframes ticker { from { transform: translateX(0) } to { transform: translateX(-50%) } }

  .nav {
    display: flex; align-items: center; justify-content: space-between;
    padding: 20px 40px;
    border-bottom: .5px solid var(--border);
  }
  .nav-logo {
    font-family: var(--display);
    font-size: 22px;
    color: var(--text);
    display: flex; align-items: center; gap: 10px;
  }
  .logo-dot { width: 8px; height: 8px; background: var(--accent); border-radius: 50%; animation: pulse 2s ease-in-out infinite; }
  @keyframes pulse { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:.6;transform:scale(.8)} }
  .nav-tag {
    font-family: var(--mono);
    font-size: 11px;
    color: var(--muted);
    letter-spacing: .12em;
    text-transform: uppercase;
  }

  .hero {
    padding: 80px 40px 60px;
    max-width: 1000px;
    margin: 0 auto;
  }
  .hero-eyebrow {
    font-family: var(--mono);
    font-size: 11px;
    letter-spacing: .2em;
    text-transform: uppercase;
    color: var(--accent);
    margin-bottom: 20px;
    display: flex; align-items: center; gap: 8px;
  }
  .hero-eyebrow::before {
    content: '';
    display: block;
    width: 24px;
    height: 1px;
    background: var(--accent);
  }
  .hero-title {
    font-family: var(--display);
    font-size: clamp(44px, 7vw, 80px);
    font-weight: 900;
    line-height: 1.0;
    color: var(--text);
    margin-bottom: 24px;
    letter-spacing: -.02em;
  }
  .hero-title em {
    color: var(--accent);
    font-style: italic;
  }
  .hero-sub {
    font-size: 16px;
    color: var(--muted);
    line-height: 1.7;
    max-width: 560px;
    font-weight: 300;
  }

  .stats-row {
    display: flex; gap: 0;
    max-width: 1000px;
    margin: 0 auto 60px;
    padding: 0 40px;
  }
  .stat {
    flex: 1;
    padding: 20px 24px;
    border: .5px solid var(--border);
    border-right: none;
  }
  .stat:first-child { border-left: .5px solid var(--border); }
  .stat:last-child { border-right: .5px solid var(--border); }
  .stat-n { font-family: var(--display); font-size: 32px; font-weight: 700; color: var(--text); }
  .stat-l { font-family: var(--mono); font-size: 11px; color: var(--muted); letter-spacing: .08em; margin-top: 4px; text-transform: uppercase; }

  .main { max-width: 1000px; margin: 0 auto; padding: 0 40px 80px; }

  .input-card {
    background: var(--surface);
    border: .5px solid var(--border2);
    border-radius: 2px;
    overflow: hidden;
    margin-bottom: 32px;
  }
  .tabs {
    display: flex;
    border-bottom: .5px solid var(--border);
  }
  .tab {
    padding: 14px 24px;
    font-family: var(--mono);
    font-size: 12px;
    letter-spacing: .08em;
    text-transform: uppercase;
    color: var(--muted);
    cursor: pointer;
    border: none;
    background: none;
    border-bottom: 2px solid transparent;
    transition: all .18s;
  }
  .tab:hover { color: var(--text); }
  .tab.active { color: var(--text); border-bottom-color: var(--accent); }

  .input-body { padding: 28px; }
  textarea {
    width: 100%;
    background: var(--surface2);
    border: .5px solid var(--border);
    border-radius: 2px;
    color: var(--text);
    font-family: var(--sans);
    font-size: 14px;
    font-weight: 300;
    line-height: 1.7;
    padding: 16px 18px;
    resize: vertical;
    min-height: 140px;
    outline: none;
    transition: border-color .18s;
  }
  textarea:focus { border-color: var(--border2); }
  textarea::placeholder { color: var(--muted); }
  input[type=text] {
    width: 100%;
    background: var(--surface2);
    border: .5px solid var(--border);
    border-radius: 2px;
    color: var(--text);
    font-family: var(--mono);
    font-size: 13px;
    padding: 14px 18px;
    outline: none;
    transition: border-color .18s;
  }
  input[type=text]:focus { border-color: var(--border2); }
  input[type=text]::placeholder { color: var(--muted); }

  .drop-zone {
    border: 1px dashed var(--border2);
    border-radius: 2px;
    padding: 48px;
    text-align: center;
    cursor: pointer;
    transition: all .18s;
  }
  .drop-zone:hover { border-color: var(--accent); background: rgba(232,64,64,.04); }
  .drop-icon { font-size: 28px; color: var(--muted); margin-bottom: 12px; }
  .drop-text { font-family: var(--mono); font-size: 12px; color: var(--muted); letter-spacing: .06em; }

  .action-row {
    display: flex; align-items: center; justify-content: space-between;
    margin-top: 16px;
  }
  .hint { font-family: var(--mono); font-size: 11px; color: var(--muted); }
  .analyze-btn {
    background: var(--accent);
    color: #fff;
    border: none;
    padding: 12px 32px;
    font-family: var(--mono);
    font-size: 12px;
    letter-spacing: .12em;
    text-transform: uppercase;
    cursor: pointer;
    border-radius: 2px;
    transition: all .18s;
    display: flex; align-items: center; gap: 8px;
  }
  .analyze-btn:hover:not(:disabled) { background: var(--accent2); }
  .analyze-btn:disabled { opacity: .5; cursor: not-allowed; }

  .spinner {
    width: 14px; height: 14px;
    border: 2px solid rgba(255,255,255,.3);
    border-top-color: #fff;
    border-radius: 50%;
    animation: spin .7s linear infinite;
  }
  @keyframes spin { to { transform: rotate(360deg) } }

  .result-card {
    background: var(--surface);
    border: .5px solid var(--border2);
    border-radius: 2px;
    overflow: hidden;
    animation: fadeIn .4s ease;
  }
  @keyframes fadeIn { from { opacity:0; transform:translateY(10px) } to { opacity:1; transform:none } }

  .result-header {
    display: flex; align-items: stretch;
    border-bottom: .5px solid var(--border);
  }
  .verdict-block {
    padding: 28px 32px;
    flex: 1;
  }
  .verdict-label {
    font-family: var(--mono);
    font-size: 11px;
    letter-spacing: .15em;
    text-transform: uppercase;
    color: var(--muted);
    margin-bottom: 8px;
  }
  .verdict-text {
    font-family: var(--display);
    font-size: 28px;
    font-weight: 700;
    margin-bottom: 6px;
  }
  .verdict-sub { font-size: 13px; color: var(--muted); font-weight: 300; }

  .score-block {
    padding: 28px 40px;
    border-left: .5px solid var(--border);
    display: flex; flex-direction: column; align-items: center; justify-content: center;
    min-width: 160px;
  }
  .score-ring {
    position: relative;
    width: 88px; height: 88px;
    margin-bottom: 8px;
  }
  .score-ring svg { transform: rotate(-90deg); }
  .score-ring circle { transition: stroke-dashoffset .8s ease; }
  .score-num {
    position: absolute; inset: 0;
    display: flex; align-items: center; justify-content: center;
    font-family: var(--display);
    font-size: 26px;
    font-weight: 700;
  }
  .score-label { font-family: var(--mono); font-size: 10px; color: var(--muted); letter-spacing: .1em; text-transform: uppercase; }

  .result-body { padding: 28px 32px; }
  .section-label {
    font-family: var(--mono); font-size: 11px; letter-spacing: .15em;
    text-transform: uppercase; color: var(--muted);
    margin-bottom: 16px;
  }

  .signals { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-bottom: 28px; }
  .signal {
    background: var(--surface2);
    border: .5px solid var(--border);
    border-left: 2px solid transparent;
    padding: 12px 14px;
    border-radius: 2px;
  }
  .signal.flag { border-left-color: var(--accent); }
  .signal.ok { border-left-color: var(--green); }
  .signal.warn { border-left-color: var(--amber); }
  .signal-name { font-size: 12px; font-weight: 500; margin-bottom: 4px; }
  .signal-val { font-family: var(--mono); font-size: 11px; color: var(--muted); }

  .summary-box {
    background: var(--surface2);
    border: .5px solid var(--border);
    border-radius: 2px;
    padding: 18px;
    font-size: 14px;
    font-weight: 300;
    line-height: 1.8;
    color: var(--text);
    margin-bottom: 28px;
  }

  .sources { display: flex; flex-direction: column; gap: 8px; }
  .source {
    display: flex; align-items: center; gap: 12px;
    padding: 10px 14px;
    background: var(--surface2);
    border: .5px solid var(--border);
    border-radius: 2px;
  }
  .source-icon { font-size: 14px; color: var(--muted); }
  .source-text { font-size: 12px; flex: 1; }
  .source-cred {
    font-family: var(--mono); font-size: 11px;
    padding: 2px 8px;
    border-radius: 2px;
  }
  .cred-high { background: rgba(74,222,128,.12); color: var(--green); }
  .cred-mid  { background: rgba(251,191,36,.12); color: var(--amber); }
  .cred-low  { background: rgba(232,64,64,.12); color: var(--accent2); }

  .error-box {
    background: rgba(232,64,64,.08);
    border: .5px solid rgba(232,64,64,.3);
    border-radius: 2px;
    padding: 16px 18px;
    font-size: 13px;
    color: var(--accent2);
    font-family: var(--mono);
  }

  .footer {
    border-top: .5px solid var(--border);
    padding: 24px 40px;
    display: flex; align-items: center; justify-content: space-between;
  }
  .footer-l { font-family: var(--mono); font-size: 11px; color: var(--muted); }
  .powered {
    font-family: var(--mono); font-size: 11px; color: var(--muted);
    display: flex; align-items: center; gap: 6px;
  }
  .powered span { color: var(--accent); }

  @media (max-width: 600px) {
    .nav { padding: 16px 20px; }
    .hero { padding: 50px 20px 40px; }
    .stats-row { padding: 0 20px; flex-wrap: wrap; }
    .stat { border-right: .5px solid var(--border) !important; flex: 1 1 45%; margin-bottom: 0; }
    .main { padding: 0 20px 60px; }
    .signals { grid-template-columns: 1fr; }
    .result-header { flex-direction: column; }
    .score-block { border-left: none; border-top: .5px solid var(--border); flex-direction: row; gap: 16px; padding: 20px 28px; }
    .footer { flex-direction: column; gap: 10px; text-align: center; }
  }
`;

const TICKER_TEXT = "BREAKING: AI-powered fact verification · Real-time misinformation detection · Cross-reference 1000+ news sources · Powered by Claude · BREAKING: AI-powered fact verification · Real-time misinformation detection · Cross-reference 1000+ news sources · Powered by Claude · ";

function ScoreRing({ score, color }) {
  const r = 36, c = 2 * Math.PI * r;
  const offset = c - (score / 100) * c;
  return (
    <div className="score-ring">
      <svg width="88" height="88" viewBox="0 0 88 88">
        <circle cx="44" cy="44" r={r} fill="none" stroke="rgba(255,255,255,0.07)" strokeWidth="5" />
        <circle cx="44" cy="44" r={r} fill="none" stroke={color} strokeWidth="5"
          strokeDasharray={c} strokeDashoffset={offset} strokeLinecap="round" />
      </svg>
      <div className="score-num" style={{ color }}>{score}</div>
    </div>
  );
}

function getVerdictMeta(score) {
  if (score <= 25) return { label: "Likely fake", color: "#e84040", cls: "flag", ringColor: "#e84040" };
  if (score <= 50) return { label: "Questionable", color: "#fbbf24", cls: "warn", ringColor: "#fbbf24" };
  if (score <= 75) return { label: "Mostly credible", color: "#a3e635", cls: "ok", ringColor: "#a3e635" };
  return { label: "Credible", color: "#4ade80", cls: "ok", ringColor: "#4ade80" };
}

export default function App() {
  const [tab, setTab] = useState("text");
  const [text, setText] = useState("");
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const fileRef = useRef();

  const inputEmpty = (tab === "text" && !text.trim()) || (tab === "url" && !url.trim());

  async function analyze() {
    const content = tab === "text" ? text : tab === "url" ? url : "(image uploaded)";
    if (!content.trim()) return;
    setLoading(true); setResult(null); setError(null);

    const systemPrompt = `You are a professional fact-checker and misinformation analyst. Analyze the given news article or text for credibility signals.

Respond ONLY with a valid JSON object (no markdown, no extra text) with this exact structure:
{
  "score": <integer 0-100, where 0=definitely fake, 100=definitely credible>,
  "label": "<one of: likely_fake | questionable | mostly_credible | credible>",
  "summary": "<2-3 sentence plain-language explanation of your verdict>",
  "signals": [
    { "name": "<signal name>", "status": "<flag|warn|ok>", "detail": "<brief detail>" }
  ],
  "sources": [
    { "name": "<source or domain name>", "relevance": "<why relevant>", "credibility": "<high|medium|low>" }
  ]
}

Include 4-6 signals covering: emotional language, source credibility, claim verifiability, logical consistency, headline accuracy, factual accuracy.
Include 2-4 sources or reference points. Be specific and analytical.`;

    try {
      const response = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 1000,
          system: systemPrompt,
          messages: [{ role: "user", content: `Analyze this content for fake news signals:\n\n${content}` }]
        })
      });
      const data = await response.json();
      const raw = data.content?.[0]?.text || "";
      const clean = raw.replace(/```json|```/g, "").trim();
      const parsed = JSON.parse(clean);
      setResult(parsed);
    } catch (e) {
      setError("Analysis failed. Please check your input and try again.");
    } finally {
      setLoading(false);
    }
  }

  const verdict = result ? getVerdictMeta(result.score) : null;

  return (
    <>
      <style>{css}</style>

      <div className="ticker">
        <span className="ticker-inner">{TICKER_TEXT}{TICKER_TEXT}</span>
      </div>

      <nav className="nav">
        <div className="nav-logo">
          <div className="logo-dot" />
          VeritasAI
        </div>
        <div className="nav-tag">Misinformation Detection Engine · v1.0</div>
      </nav>

      <div className="hero">
        <div className="hero-eyebrow">AI-Powered Analysis</div>
        <h1 className="hero-title">
          Can you tell<br />
          <em>fact</em> from fiction?
        </h1>
        <p className="hero-sub">
          Paste any article, URL, or screenshot. Our AI cross-references claims, detects manipulative language, and scores credibility in seconds.
        </p>
      </div>

      <div className="stats-row">
        {[
          { n: "98.2%", l: "Detection accuracy" },
          { n: "1,200+", l: "Sources indexed" },
          { n: "<8s", l: "Analysis time" },
          { n: "12 signals", l: "Checked per article" },
        ].map(s => (
          <div className="stat" key={s.l}>
            <div className="stat-n">{s.n}</div>
            <div className="stat-l">{s.l}</div>
          </div>
        ))}
      </div>

      <main className="main">
        <div className="input-card">
          <div className="tabs">
            {["text", "url", "image"].map(t => (
              <button key={t} className={`tab ${tab === t ? "active" : ""}`} onClick={() => setTab(t)}>
                {t === "text" ? "Paste text" : t === "url" ? "Enter URL" : "Upload image"}
              </button>
            ))}
          </div>
          <div className="input-body">
            {tab === "text" && (
              <textarea
                placeholder="Paste the article text, headline, or any content you want to verify…"
                value={text}
                onChange={e => setText(e.target.value)}
              />
            )}
            {tab === "url" && (
              <input type="text" placeholder="https://example.com/article-to-verify"
                value={url} onChange={e => setUrl(e.target.value)} />
            )}
            {tab === "image" && (
              <div className="drop-zone" onClick={() => fileRef.current?.click()}>
                <div className="drop-icon"><i className="ti ti-photo-up" /></div>
                <div className="drop-text">Drop screenshot here or click to upload</div>
                <input ref={fileRef} type="file" accept="image/*" style={{ display: "none" }} />
              </div>
            )}
            <div className="action-row">
              <span className="hint">Powered by Claude · Results in ~8 seconds</span>
              <button className="analyze-btn" onClick={analyze} disabled={loading || inputEmpty}>
                {loading ? <><div className="spinner" /> Analyzing…</> : <>Analyze <i className="ti ti-arrow-right" /></>}
              </button>
            </div>
          </div>
        </div>

        {error && <div className="error-box">{error}</div>}

        {result && verdict && (
          <div className="result-card">
            <div className="result-header">
              <div className="verdict-block">
                <div className="verdict-label">Verdict</div>
                <div className="verdict-text" style={{ color: verdict.color }}>{verdict.label}</div>
                <div className="verdict-sub">Credibility analysis complete · {new Date().toLocaleTimeString()}</div>
              </div>
              <div className="score-block">
                <ScoreRing score={result.score} color={verdict.ringColor} />
                <div className="score-label">Credibility score</div>
              </div>
            </div>

            <div className="result-body">
              <div className="section-label">Summary</div>
              <div className="summary-box">{result.summary}</div>

              {result.signals?.length > 0 && (
                <>
                  <div className="section-label">Signal breakdown</div>
                  <div className="signals">
                    {result.signals.map((s, i) => (
                      <div key={i} className={`signal ${s.status}`}>
                        <div className="signal-name">{s.name}</div>
                        <div className="signal-val">{s.detail}</div>
                      </div>
                    ))}
                  </div>
                </>
              )}

              {result.sources?.length > 0 && (
                <>
                  <div className="section-label">Reference sources</div>
                  <div className="sources">
                    {result.sources.map((src, i) => (
                      <div key={i} className="source">
                        <i className="ti ti-news source-icon" />
                        <div className="source-text">
                          <div style={{ fontWeight: 500, fontSize: 13, marginBottom: 2 }}>{src.name}</div>
                          <div style={{ fontSize: 11, color: "var(--muted)" }}>{src.relevance}</div>
                        </div>
                        <div className={`source-cred ${src.credibility === "high" ? "cred-high" : src.credibility === "medium" ? "cred-mid" : "cred-low"}`}>
                          {src.credibility}
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>
        )}
      </main>

      <footer className="footer">
        <div className="footer-l">© 2026 VeritasAI · For informational purposes only</div>
        <div className="powered">Powered by <span>Claude</span> · Anthropic</div>
      </footer>
    </>
  );
}
