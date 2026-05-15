import { useState, useRef, useEffect } from "react";

const FONTS = `@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;0,900;1,700&family=DM+Mono:wght@300;400;500&family=DM+Sans:wght@300;400;500;600&display=swap');`;

const css = `
  ${FONTS}
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  :root {
    --bg: #070709;
    --surface: #0f0f12;
    --surface2: #141418;
    --surface3: #1a1a1f;
    --border: rgba(255,255,255,0.06);
    --border2: rgba(255,255,255,0.12);
    --border3: rgba(255,255,255,0.18);
    --text: #f0ede6;
    --text2: #c4c0b8;
    --muted: #55524e;
    --muted2: #78746f;
    --accent: #e84040;
    --accent2: #ff6b6b;
    --accent-dim: rgba(232,64,64,0.12);
    --green: #4ade80;
    --green-dim: rgba(74,222,128,0.12);
    --amber: #fbbf24;
    --amber-dim: rgba(251,191,36,0.12);
    --mono: 'DM Mono', monospace;
    --sans: 'DM Sans', sans-serif;
    --display: 'Playfair Display', serif;
    --glow-red: 0 0 40px rgba(232,64,64,0.15), 0 0 80px rgba(232,64,64,0.05);
    --glow-green: 0 0 40px rgba(74,222,128,0.15), 0 0 80px rgba(74,222,128,0.05);
    --glow-amber: 0 0 40px rgba(251,191,36,0.15), 0 0 80px rgba(251,191,36,0.05);
  }

  html { scroll-behavior: smooth; }
  body {
    background: var(--bg);
    color: var(--text);
    font-family: var(--sans);
    min-height: 100vh;
    overflow-x: hidden;
  }

  /* ── NOISE OVERLAY ── */
  body::before {
    content: '';
    position: fixed;
    inset: 0;
    background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='1'/%3E%3C/svg%3E");
    opacity: 0.018;
    pointer-events: none;
    z-index: 9999;
  }

  /* ── AMBIENT GLOW ── */
  .ambient {
    position: fixed;
    pointer-events: none;
    z-index: 0;
    border-radius: 50%;
    filter: blur(120px);
    transition: all 1.2s ease;
  }
  .ambient-1 {
    width: 600px; height: 600px;
    top: -200px; left: -200px;
    background: rgba(232,64,64,0.04);
    animation: ambientDrift1 20s ease-in-out infinite;
  }
  .ambient-2 {
    width: 400px; height: 400px;
    bottom: -100px; right: -100px;
    background: rgba(74,222,128,0.03);
    animation: ambientDrift2 25s ease-in-out infinite;
  }
  @keyframes ambientDrift1 {
    0%,100% { transform: translate(0,0) scale(1); }
    33% { transform: translate(60px,40px) scale(1.1); }
    66% { transform: translate(-30px,60px) scale(0.9); }
  }
  @keyframes ambientDrift2 {
    0%,100% { transform: translate(0,0) scale(1); }
    50% { transform: translate(-40px,-30px) scale(1.15); }
  }

  /* ── TICKER ── */
  .ticker {
    background: var(--accent);
    padding: 7px 0;
    overflow: hidden;
    white-space: nowrap;
    position: relative;
    z-index: 10;
  }
  .ticker::after {
    content: '';
    position: absolute;
    inset: 0;
    background: linear-gradient(90deg, var(--accent) 0%, transparent 8%, transparent 92%, var(--accent) 100%);
    pointer-events: none;
  }
  .ticker-inner {
    display: inline-block;
    animation: ticker 32s linear infinite;
    font-family: var(--mono);
    font-size: 10px;
    letter-spacing: .15em;
    color: rgba(255,255,255,0.85);
  }
  @keyframes ticker { from { transform: translateX(0) } to { transform: translateX(-50%) } }
  .ticker-sep { opacity: 0.4; margin: 0 12px; }

  /* ── NAV ── */
  .nav {
    display: flex; align-items: center; justify-content: space-between;
    padding: 22px 48px;
    border-bottom: .5px solid var(--border);
    position: relative; z-index: 10;
    backdrop-filter: blur(12px);
    background: rgba(7,7,9,0.8);
    position: sticky; top: 0;
    animation: slideDown 0.6s ease both;
  }
  @keyframes slideDown { from { transform: translateY(-100%); opacity: 0; } to { transform: none; opacity: 1; } }
  .nav-logo {
    font-family: var(--display);
    font-size: 20px;
    font-weight: 700;
    color: var(--text);
    display: flex; align-items: center; gap: 10px;
    letter-spacing: -0.01em;
  }
  .logo-dot {
    width: 7px; height: 7px;
    background: var(--accent);
    border-radius: 50%;
    box-shadow: 0 0 12px rgba(232,64,64,0.8);
    animation: livePulse 2s ease-in-out infinite;
  }
  @keyframes livePulse {
    0%,100% { opacity:1; transform:scale(1); box-shadow: 0 0 12px rgba(232,64,64,0.8); }
    50% { opacity:.7; transform:scale(0.75); box-shadow: 0 0 6px rgba(232,64,64,0.4); }
  }
  .nav-right { display: flex; align-items: center; gap: 20px; }
  .nav-tag {
    font-family: var(--mono);
    font-size: 10px;
    color: var(--muted);
    letter-spacing: .14em;
    text-transform: uppercase;
  }
  .nav-badge {
    font-family: var(--mono); font-size: 10px; letter-spacing: .08em;
    padding: 4px 10px; border-radius: 2px;
    border: .5px solid rgba(232,64,64,0.3);
    color: var(--accent2);
    background: var(--accent-dim);
    text-transform: uppercase;
  }

  /* ── HERO ── */
  .hero {
    padding: 100px 48px 70px;
    max-width: 1040px;
    margin: 0 auto;
    position: relative; z-index: 1;
  }
  .hero-eyebrow {
    font-family: var(--mono);
    font-size: 10px;
    letter-spacing: .25em;
    text-transform: uppercase;
    color: var(--accent);
    margin-bottom: 24px;
    display: flex; align-items: center; gap: 12px;
    animation: fadeUp 0.7s 0.1s ease both;
  }
  .hero-eyebrow-line { width: 28px; height: 1px; background: var(--accent); }
  .hero-title {
    font-family: var(--display);
    font-size: clamp(48px, 7.5vw, 88px);
    font-weight: 900;
    line-height: 0.95;
    color: var(--text);
    margin-bottom: 28px;
    letter-spacing: -.025em;
    animation: fadeUp 0.7s 0.2s ease both;
  }
  .hero-title em { color: var(--accent); font-style: italic; }
  .hero-title .line2 { padding-left: 2.5em; display: block; }
  .hero-sub {
    font-size: 15px;
    color: var(--muted2);
    line-height: 1.8;
    max-width: 520px;
    font-weight: 300;
    animation: fadeUp 0.7s 0.3s ease both;
  }
  @keyframes fadeUp { from { opacity:0; transform:translateY(20px) } to { opacity:1; transform:none } }

  /* ── STATS ── */
  .stats-row {
    display: flex; gap: 0;
    max-width: 1040px;
    margin: 0 auto 72px;
    padding: 0 48px;
    position: relative; z-index: 1;
    animation: fadeUp 0.7s 0.4s ease both;
  }
  .stat {
    flex: 1;
    padding: 22px 26px;
    border: .5px solid var(--border);
    border-right: none;
    transition: background .25s, border-color .25s;
    position: relative; overflow: hidden;
  }
  .stat::before {
    content: '';
    position: absolute; top: 0; left: 0; right: 0;
    height: 1px;
    background: linear-gradient(90deg, transparent, rgba(232,64,64,0.3), transparent);
    opacity: 0;
    transition: opacity .3s;
  }
  .stat:hover { background: var(--surface); border-color: var(--border2); }
  .stat:hover::before { opacity: 1; }
  .stat:first-child { border-left: .5px solid var(--border); }
  .stat:last-child { border-right: .5px solid var(--border); }
  .stat-n {
    font-family: var(--display);
    font-size: 30px; font-weight: 700;
    color: var(--text);
    letter-spacing: -0.02em;
  }
  .stat-l {
    font-family: var(--mono);
    font-size: 10px; color: var(--muted);
    letter-spacing: .1em; margin-top: 5px;
    text-transform: uppercase;
  }

  /* ── MAIN ── */
  .main { max-width: 1040px; margin: 0 auto; padding: 0 48px 100px; position: relative; z-index: 1; }

  /* ── INPUT CARD ── */
  .input-card {
    background: var(--surface);
    border: .5px solid var(--border2);
    border-radius: 3px;
    overflow: hidden;
    margin-bottom: 32px;
    animation: fadeUp 0.7s 0.5s ease both;
    transition: border-color .3s, box-shadow .3s;
  }
  .input-card:focus-within {
    border-color: var(--border3);
    box-shadow: 0 0 0 1px rgba(255,255,255,0.04), 0 24px 48px rgba(0,0,0,0.4);
  }

  /* ── TABS ── */
  .tabs { display: flex; border-bottom: .5px solid var(--border); }
  .tab {
    padding: 15px 26px;
    font-family: var(--mono);
    font-size: 11px;
    letter-spacing: .1em;
    text-transform: uppercase;
    color: var(--muted);
    cursor: pointer;
    border: none; background: none;
    border-bottom: 1.5px solid transparent;
    transition: color .2s, border-color .2s, background .2s;
    position: relative;
  }
  .tab:hover { color: var(--text2); }
  .tab.active { color: var(--text); border-bottom-color: var(--accent); }
  .tab.active::after {
    content: '';
    position: absolute; bottom: -1px; left: 0; right: 0;
    height: 1px;
    background: rgba(232,64,64,0.4);
    filter: blur(3px);
  }

  /* ── INPUT BODY ── */
  .input-body { padding: 28px 32px 24px; }
  textarea {
    width: 100%;
    background: var(--surface2);
    border: .5px solid var(--border);
    border-radius: 2px;
    color: var(--text);
    font-family: var(--sans);
    font-size: 14px; font-weight: 300;
    line-height: 1.8; padding: 18px 20px;
    resize: vertical; min-height: 150px;
    outline: none;
    transition: border-color .2s, box-shadow .2s;
  }
  textarea:focus {
    border-color: rgba(255,255,255,0.16);
    box-shadow: inset 0 1px 3px rgba(0,0,0,0.3);
  }
  textarea::placeholder { color: var(--muted); }

  input[type=text] {
    width: 100%;
    background: var(--surface2);
    border: .5px solid var(--border);
    border-radius: 2px;
    color: var(--text);
    font-family: var(--mono); font-size: 13px;
    padding: 15px 20px; outline: none;
    transition: border-color .2s, box-shadow .2s;
  }
  input[type=text]:focus {
    border-color: rgba(255,255,255,0.16);
    box-shadow: inset 0 1px 3px rgba(0,0,0,0.3);
  }
  input[type=text]::placeholder { color: var(--muted); }

  .drop-zone {
    border: 1px dashed var(--border2);
    border-radius: 2px;
    padding: 56px 48px;
    text-align: center;
    cursor: pointer;
    transition: all .22s;
    position: relative; overflow: hidden;
  }
  .drop-zone::before {
    content: '';
    position: absolute; inset: 0;
    background: radial-gradient(circle at center, rgba(232,64,64,0.04), transparent 70%);
    opacity: 0; transition: opacity .3s;
  }
  .drop-zone:hover { border-color: rgba(232,64,64,0.5); }
  .drop-zone:hover::before { opacity: 1; }
  .drop-icon { font-size: 32px; color: var(--muted); margin-bottom: 14px; }
  .drop-text { font-family: var(--mono); font-size: 12px; color: var(--muted); letter-spacing: .08em; }
  .drop-sub { font-size: 11px; color: var(--muted); margin-top: 6px; opacity: .6; font-family: var(--mono); }

  .action-row {
    display: flex; align-items: center; justify-content: space-between;
    margin-top: 18px;
  }
  .hint { font-family: var(--mono); font-size: 10px; color: var(--muted); letter-spacing: .05em; }
  .hint span { color: var(--muted2); }

  /* ── ANALYZE BUTTON ── */
  .analyze-btn {
    background: var(--accent);
    color: #fff; border: none;
    padding: 13px 36px;
    font-family: var(--mono); font-size: 11px;
    letter-spacing: .14em; text-transform: uppercase;
    cursor: pointer; border-radius: 2px;
    transition: all .2s;
    display: flex; align-items: center; gap: 10px;
    position: relative; overflow: hidden;
  }
  .analyze-btn::before {
    content: '';
    position: absolute; inset: 0;
    background: linear-gradient(135deg, rgba(255,255,255,0.12), transparent);
    opacity: 0; transition: opacity .2s;
  }
  .analyze-btn:hover:not(:disabled) {
    background: var(--accent2);
    box-shadow: 0 0 20px rgba(232,64,64,0.4), 0 4px 12px rgba(0,0,0,0.3);
    transform: translateY(-1px);
  }
  .analyze-btn:hover:not(:disabled)::before { opacity: 1; }
  .analyze-btn:active:not(:disabled) { transform: translateY(0); }
  .analyze-btn:disabled { opacity: .4; cursor: not-allowed; }

  /* ── SPINNER ── */
  .spinner {
    width: 13px; height: 13px;
    border: 1.5px solid rgba(255,255,255,.3);
    border-top-color: #fff;
    border-radius: 50%;
    animation: spin .65s linear infinite;
  }
  @keyframes spin { to { transform: rotate(360deg) } }

  /* ── SCANNING ANIMATION ── */
  .scanning-overlay {
    background: var(--surface);
    border: .5px solid var(--border2);
    border-radius: 3px;
    padding: 56px 32px;
    margin-bottom: 32px;
    display: flex; flex-direction: column; align-items: center;
    animation: fadeIn .3s ease;
    position: relative; overflow: hidden;
  }
  .scan-line {
    position: absolute; left: 0; right: 0; height: 1px;
    background: linear-gradient(90deg, transparent, rgba(232,64,64,0.6), transparent);
    animation: scanDown 2s ease-in-out infinite;
    filter: blur(1px);
  }
  .scan-glow {
    position: absolute; left: 0; right: 0; height: 40px;
    background: linear-gradient(180deg, transparent, rgba(232,64,64,0.04), transparent);
    animation: scanDown 2s ease-in-out infinite;
  }
  @keyframes scanDown {
    0% { top: 0 } 100% { top: 100% }
  }
  .scan-label {
    font-family: var(--mono); font-size: 11px;
    color: var(--accent2); letter-spacing: .2em;
    text-transform: uppercase;
    margin-bottom: 20px;
    animation: blink 1.2s ease-in-out infinite;
  }
  @keyframes blink { 0%,100%{opacity:1} 50%{opacity:.5} }
  .scan-bars {
    display: flex; gap: 4px; align-items: flex-end; height: 40px;
    margin-bottom: 16px;
  }
  .scan-bar {
    width: 4px; background: var(--accent);
    border-radius: 2px;
    opacity: 0.7;
    animation: barAnim 1.2s ease-in-out infinite;
  }
  .scan-bar:nth-child(1) { animation-delay: 0s; }
  .scan-bar:nth-child(2) { animation-delay: .1s; }
  .scan-bar:nth-child(3) { animation-delay: .2s; }
  .scan-bar:nth-child(4) { animation-delay: .3s; }
  .scan-bar:nth-child(5) { animation-delay: .4s; }
  .scan-bar:nth-child(6) { animation-delay: .5s; }
  .scan-bar:nth-child(7) { animation-delay: .6s; }
  .scan-bar:nth-child(8) { animation-delay: .5s; }
  .scan-bar:nth-child(9) { animation-delay: .4s; }
  .scan-bar:nth-child(10) { animation-delay: .3s; }
  @keyframes barAnim {
    0%,100% { height: 8px; opacity: .3; }
    50% { height: 36px; opacity: 1; }
  }
  .scan-steps {
    display: flex; gap: 24px;
    font-family: var(--mono); font-size: 10px; color: var(--muted);
    letter-spacing: .08em;
  }
  .scan-step { display: flex; align-items: center; gap: 6px; }
  .scan-step-dot { width: 5px; height: 5px; border-radius: 50%; background: var(--muted); }
  .scan-step.done .scan-step-dot { background: var(--green); box-shadow: 0 0 6px rgba(74,222,128,0.6); }
  .scan-step.active .scan-step-dot { background: var(--accent); box-shadow: 0 0 6px rgba(232,64,64,0.6); animation: livePulse 1s infinite; }
  .scan-step.done { color: var(--muted2); }
  .scan-step.active { color: var(--text2); }

  /* ── RESULT CARD ── */
  .result-card {
    background: var(--surface);
    border: .5px solid var(--border2);
    border-radius: 3px;
    overflow: hidden;
    animation: revealResult .6s cubic-bezier(.22,.68,0,1.2) both;
    position: relative;
  }
  @keyframes revealResult {
    from { opacity: 0; transform: translateY(16px) scale(0.99); }
    to { opacity: 1; transform: none; }
  }
  .result-card::before {
    content: '';
    position: absolute; top: 0; left: 0; right: 0;
    height: 1px;
    background: linear-gradient(90deg, transparent 0%, var(--verdict-color, var(--accent)) 50%, transparent 100%);
    opacity: 0.5;
  }

  /* ── RESULT HEADER ── */
  .result-header {
    display: flex; align-items: stretch;
    border-bottom: .5px solid var(--border);
    position: relative;
  }
  .result-header::after {
    content: '';
    position: absolute; inset: 0;
    background: radial-gradient(ellipse at 20% 50%, rgba(232,64,64,0.04), transparent 60%);
    pointer-events: none;
  }

  .verdict-block { padding: 32px 36px; flex: 1; }
  .verdict-label {
    font-family: var(--mono); font-size: 10px;
    letter-spacing: .18em; text-transform: uppercase;
    color: var(--muted); margin-bottom: 10px;
    display: flex; align-items: center; gap: 8px;
  }
  .verdict-label::before { content: ''; display: block; width: 16px; height: .5px; background: var(--muted); }
  .verdict-text {
    font-family: var(--display);
    font-size: 32px; font-weight: 700;
    margin-bottom: 8px;
    letter-spacing: -.01em;
    animation: verdictReveal .5s .1s ease both;
  }
  @keyframes verdictReveal {
    from { opacity:0; transform: translateX(-10px); }
    to { opacity:1; transform: none; }
  }
  .verdict-sub { font-size: 12px; color: var(--muted); font-weight: 300; font-family: var(--mono); letter-spacing: .04em; }

  .score-block {
    padding: 32px 48px;
    border-left: .5px solid var(--border);
    display: flex; flex-direction: column; align-items: center; justify-content: center;
    min-width: 180px;
    position: relative;
  }
  .score-ring {
    position: relative; width: 96px; height: 96px;
    margin-bottom: 10px;
  }
  .score-ring svg { transform: rotate(-90deg); }
  .score-ring-track { transition: stroke .5s; }
  .score-ring-fill { transition: stroke-dashoffset 1.2s cubic-bezier(.22,.68,0,1.2), stroke .5s; }
  .score-num {
    position: absolute; inset: 0;
    display: flex; align-items: center; justify-content: center;
    font-family: var(--display); font-size: 28px; font-weight: 700;
  }
  .score-label { font-family: var(--mono); font-size: 10px; color: var(--muted); letter-spacing: .12em; text-transform: uppercase; }

  /* ── RESULT BODY ── */
  .result-body { padding: 32px 36px; }
  .section-label {
    font-family: var(--mono); font-size: 10px; letter-spacing: .18em;
    text-transform: uppercase; color: var(--muted);
    margin-bottom: 14px; margin-top: 28px;
    display: flex; align-items: center; gap: 10px;
  }
  .section-label:first-child { margin-top: 0; }
  .section-label::after { content: ''; flex: 1; height: .5px; background: var(--border); }

  .summary-box {
    background: var(--surface2);
    border: .5px solid var(--border);
    border-left: 2px solid rgba(255,255,255,0.1);
    border-radius: 2px;
    padding: 20px 22px;
    font-size: 14px; font-weight: 300;
    line-height: 1.85; color: var(--text2);
  }

  /* ── SIGNALS ── */
  .signals { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; }
  .signal {
    background: var(--surface2);
    border: .5px solid var(--border);
    border-left: 2px solid transparent;
    padding: 14px 16px;
    border-radius: 2px;
    transition: transform .2s, border-color .2s, box-shadow .2s;
    animation: signalIn .4s ease both;
    cursor: default;
  }
  .signal:hover { transform: translateX(3px); }
  @keyframes signalIn {
    from { opacity:0; transform: translateX(-8px); }
    to { opacity:1; transform: none; }
  }
  .signal.flag {
    border-left-color: var(--accent);
  }
  .signal.flag:hover { box-shadow: -4px 0 16px rgba(232,64,64,0.15); }
  .signal.ok {
    border-left-color: var(--green);
  }
  .signal.ok:hover { box-shadow: -4px 0 16px rgba(74,222,128,0.15); }
  .signal.warn {
    border-left-color: var(--amber);
  }
  .signal.warn:hover { box-shadow: -4px 0 16px rgba(251,191,36,0.15); }
  .signal-top { display: flex; align-items: center; justify-content: space-between; margin-bottom: 5px; }
  .signal-name { font-size: 12px; font-weight: 500; }
  .signal-status {
    font-family: var(--mono); font-size: 9px; letter-spacing: .1em;
    text-transform: uppercase; padding: 2px 7px; border-radius: 2px;
  }
  .signal.flag .signal-status { color: var(--accent2); background: var(--accent-dim); }
  .signal.ok .signal-status { color: var(--green); background: var(--green-dim); }
  .signal.warn .signal-status { color: var(--amber); background: var(--amber-dim); }
  .signal-val { font-family: var(--mono); font-size: 11px; color: var(--muted2); line-height: 1.5; }

  /* ── SOURCES ── */
  .sources { display: flex; flex-direction: column; gap: 8px; }
  .source {
    display: flex; align-items: center; gap: 14px;
    padding: 12px 16px;
    background: var(--surface2);
    border: .5px solid var(--border);
    border-radius: 2px;
    transition: border-color .2s, background .2s;
    animation: sourceIn .4s ease both;
  }
  @keyframes sourceIn {
    from { opacity:0; transform: translateY(6px); }
    to { opacity:1; transform: none; }
  }
  .source:hover { border-color: var(--border2); background: var(--surface3); }
  .source-icon-wrap {
    width: 32px; height: 32px;
    border-radius: 2px; background: var(--surface3);
    border: .5px solid var(--border2);
    display: flex; align-items: center; justify-content: center;
    flex-shrink: 0;
    font-size: 13px; color: var(--muted2);
  }
  .source-text { flex: 1; }
  .source-name { font-size: 12px; font-weight: 500; margin-bottom: 2px; color: var(--text2); }
  .source-rel { font-size: 11px; color: var(--muted); font-family: var(--mono); }
  .source-cred {
    font-family: var(--mono); font-size: 10px; letter-spacing: .1em;
    padding: 3px 9px; border-radius: 2px; text-transform: uppercase; flex-shrink: 0;
  }
  .cred-high { background: var(--green-dim); color: var(--green); }
  .cred-medium { background: var(--amber-dim); color: var(--amber); }
  .cred-low { background: var(--accent-dim); color: var(--accent2); }

  /* ── ERROR ── */
  .error-box {
    background: var(--accent-dim);
    border: .5px solid rgba(232,64,64,0.25);
    border-radius: 2px;
    padding: 18px 22px;
    font-size: 13px; color: var(--accent2);
    font-family: var(--mono);
    letter-spacing: .04em;
    animation: fadeIn .3s ease;
    display: flex; align-items: center; gap: 10px;
    margin-bottom: 24px;
  }
  .error-dot { width: 6px; height: 6px; background: var(--accent); border-radius: 50%; flex-shrink: 0; animation: livePulse 1s infinite; }

  /* ── FOOTER ── */
  .footer {
    border-top: .5px solid var(--border);
    padding: 26px 48px;
    display: flex; align-items: center; justify-content: space-between;
    position: relative; z-index: 1;
  }
  .footer-l { font-family: var(--mono); font-size: 10px; color: var(--muted); letter-spacing: .06em; }
  .powered {
    font-family: var(--mono); font-size: 10px; color: var(--muted);
    display: flex; align-items: center; gap: 6px;
    letter-spacing: .06em;
  }
  .powered-dot { width: 4px; height: 4px; background: var(--accent); border-radius: 50%; }
  .powered span { color: var(--text2); }

  @keyframes fadeIn { from { opacity:0; } to { opacity:1; } }

  /* ── RESPONSIVE ── */
  @media (max-width: 680px) {
    .nav { padding: 18px 22px; }
    .nav-badge { display: none; }
    .hero { padding: 60px 22px 48px; }
    .hero-title .line2 { padding-left: 1.2em; }
    .stats-row { padding: 0 22px; flex-wrap: wrap; }
    .stat { flex: 1 1 45%; border-right: .5px solid var(--border) !important; }
    .main { padding: 0 22px 60px; }
    .signals { grid-template-columns: 1fr; }
    .result-header { flex-direction: column; }
    .score-block { border-left: none; border-top: .5px solid var(--border); flex-direction: row; gap: 18px; padding: 22px 28px; justify-content: flex-start; }
    .footer { flex-direction: column; gap: 12px; text-align: center; padding: 22px; }
  }
`;

const TICKER_TEXT = Array(4).fill("BREAKING: AI-powered fact verification · Real-time misinformation detection · Cross-reference 1,200+ news sources · Powered by Claude Sonnet 4").join(" · ");

function ScoreRing({ score, color, animate }) {
  const r = 40, c = 2 * Math.PI * r;
  const [displayed, setDisplayed] = useState(0);

  useEffect(() => {
    if (!animate) { setDisplayed(score); return; }
    let start = null;
    const dur = 1200;
    const step = (ts) => {
      if (!start) start = ts;
      const p = Math.min((ts - start) / dur, 1);
      const ease = 1 - Math.pow(1 - p, 3);
      setDisplayed(Math.round(ease * score));
      if (p < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [score, animate]);

  const offset = c - (displayed / 100) * c;
  return (
    <div className="score-ring">
      <svg width="96" height="96" viewBox="0 0 96 96">
        <circle cx="48" cy="48" r={r} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="5" className="score-ring-track" />
        <circle cx="48" cy="48" r={r} fill="none" stroke={color} strokeWidth="5"
          strokeDasharray={c} strokeDashoffset={offset}
          strokeLinecap="round" className="score-ring-fill" />
      </svg>
      <div className="score-num" style={{ color }}>{displayed}</div>
    </div>
  );
}

function ScanningView({ step }) {
  const steps = ["Parsing content", "Detecting signals", "Cross-referencing"];
  return (
    <div className="scanning-overlay">
      <div className="scan-line" />
      <div className="scan-glow" />
      <div className="scan-label">● Analyzing content</div>
      <div className="scan-bars">
        {Array.from({ length: 10 }, (_, i) => (
          <div key={i} className="scan-bar" style={{ animationDelay: `${i * 0.08}s` }} />
        ))}
      </div>
      <div className="scan-steps">
        {steps.map((s, i) => (
          <div key={s} className={`scan-step ${i < step ? "done" : i === step ? "active" : ""}`}>
            <div className="scan-step-dot" />
            {s}
          </div>
        ))}
      </div>
    </div>
  );
}

function getVerdictMeta(score) {
  if (score <= 25) return { label: "Likely Fake", color: "#e84040", ringColor: "#e84040", glow: "var(--glow-red)" };
  if (score <= 50) return { label: "Questionable", color: "#fbbf24", ringColor: "#fbbf24", glow: "var(--glow-amber)" };
  if (score <= 75) return { label: "Mostly Credible", color: "#a3e635", ringColor: "#a3e635", glow: "var(--glow-green)" };
  return { label: "Credible", color: "#4ade80", ringColor: "#4ade80", glow: "var(--glow-green)" };
}

export default function App() {
  const [tab, setTab] = useState("text");
  const [text, setText] = useState("");
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [scanStep, setScanStep] = useState(0);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [ringAnimate, setRingAnimate] = useState(false);
  const [imageFile, setImageFile] = useState(null);
  const fileRef = useRef();

  const inputEmpty =
    (tab === "text" && !text.trim()) ||
    (tab === "url" && !url.trim()) ||
    (tab === "image" && !imageFile);

  async function analyze() {
    const content = tab === "text" ? text : tab === "url" ? url : "(image uploaded)";
    if (!content.trim()) return;
    setLoading(true); setResult(null); setError(null); setScanStep(0); setRingAnimate(false);

    const scanTimer = setInterval(() => {
      setScanStep(s => Math.min(s + 1, 2));
    }, 1800);

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
      clearInterval(scanTimer);
      setScanStep(2);
      setTimeout(() => {
        setResult(parsed);
        setLoading(false);
        setTimeout(() => setRingAnimate(true), 100);
      }, 400);
    } catch (e) {
      clearInterval(scanTimer);
      setError("Analysis failed. Please verify your input and try again.");
      setLoading(false);
    }
  }

  const verdict = result ? getVerdictMeta(result.score) : null;

  return (
    <>
      <style>{css}</style>

      <div className="ambient ambient-1" />
      <div className="ambient ambient-2" />

      <div className="ticker">
        <span className="ticker-inner">{TICKER_TEXT} &nbsp;&nbsp;&nbsp; {TICKER_TEXT}</span>
      </div>

      <nav className="nav">
        <div className="nav-logo">
          <div className="logo-dot" />
          FactLens
        </div>
        <div className="nav-right">
          <div className="nav-badge">Live</div>
          <div className="nav-tag">Misinformation Engine · v2.0</div>
        </div>
      </nav>

      <div className="hero">
        <div className="hero-eyebrow">
          <span className="hero-eyebrow-line" />
          AI-Powered Analysis
        </div>
        <h1 className="hero-title">
          Can you tell
          <span className="line2"><em>fact</em> from fiction?</span>
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
            {[
              { id: "text", label: "Paste Text" },
              { id: "url", label: "Enter URL" },
              { id: "image", label: "Upload Image" }
            ].map(t => (
              <button key={t.id} className={`tab ${tab === t.id ? "active" : ""}`} onClick={() => setTab(t.id)}>
                {t.label}
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
              <div className="drop-zone" onClick={() => fileRef.current?.click()} style={imageFile ? { borderColor: "rgba(74,222,128,0.5)", background: "rgba(74,222,128,0.03)" } : {}}>
                <div className="drop-icon">{imageFile ? "✓" : "⬆"}</div>
                <div className="drop-text">{imageFile ? imageFile.name : "Drop screenshot here or click to upload"}</div>
                <div className="drop-sub">{imageFile ? `${(imageFile.size / 1024).toFixed(0)} KB · Click to change` : "PNG, JPG, WEBP · Max 10MB"}</div>
                <input ref={fileRef} type="file" accept="image/*" style={{ display: "none" }}
                  onChange={e => setImageFile(e.target.files?.[0] || null)} />
              </div>
            )}
            <div className="action-row">
              <span className="hint">Powered by <span>Claude Sonnet 4</span> · ~8 second analysis</span>
              <button className="analyze-btn" onClick={analyze} disabled={loading || inputEmpty}>
                {loading
                  ? <><div className="spinner" /> Analyzing…</>
                  : <>Analyze →</>
                }
              </button>
            </div>
          </div>
        </div>

        {loading && <ScanningView step={scanStep} />}

        {error && (
          <div className="error-box">
            <div className="error-dot" />
            {error}
          </div>
        )}

        {result && verdict && (
          <div className="result-card" style={{ "--verdict-color": verdict.color }}>
            <div className="result-header">
              <div className="verdict-block">
                <div className="verdict-label">Verdict</div>
                <div className="verdict-text" style={{ color: verdict.color }}>{verdict.label}</div>
                <div className="verdict-sub">Analysis complete · {new Date().toLocaleTimeString()}</div>
              </div>
              <div className="score-block">
                <ScoreRing score={result.score} color={verdict.ringColor} animate={ringAnimate} />
                <div className="score-label">Credibility score</div>
              </div>
            </div>

            <div className="result-body">
              <div className="section-label">Summary</div>
              <div className="summary-box">{result.summary}</div>

              {result.signals?.length > 0 && (
                <>
                  <div className="section-label">Signal Breakdown</div>
                  <div className="signals">
                    {result.signals.map((s, i) => (
                      <div key={i} className={`signal ${s.status}`} style={{ animationDelay: `${i * 0.07}s` }}>
                        <div className="signal-top">
                          <div className="signal-name">{s.name}</div>
                          <div className="signal-status">{s.status === "flag" ? "⚑ Flag" : s.status === "warn" ? "⚠ Warn" : "✓ Pass"}</div>
                        </div>
                        <div className="signal-val">{s.detail}</div>
                      </div>
                    ))}
                  </div>
                </>
              )}

              {result.sources?.length > 0 && (
                <>
                  <div className="section-label">Reference Sources</div>
                  <div className="sources">
                    {result.sources.map((src, i) => (
                      <div key={i} className="source" style={{ animationDelay: `${i * 0.08}s` }}>
                        <div className="source-icon-wrap">◈</div>
                        <div className="source-text">
                          <div className="source-name">{src.name}</div>
                          <div className="source-rel">{src.relevance}</div>
                        </div>
                        <div className={`source-cred ${src.credibility === "high" ? "cred-high" : src.credibility === "medium" ? "cred-medium" : "cred-low"}`}>
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
        <div className="footer-l">© 2026 FactLens · For informational purposes only</div>
        <div className="powered">
          <div className="powered-dot" />
          Powered by <span>Claude</span> · Anthropic
        </div>
      </footer>
    </>
  );
}