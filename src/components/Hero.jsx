import React from "react";

export default function Hero({ onPrimary, onSecondary }) {
  return (
    <header className="hero">
      <nav className="nav">
        <div className="logo">Nova Resume</div>
      </nav>

      <div className="hero-grid">
        <div className="hero-copy">
          <p className="kicker">AI Resume Analyzer</p>
          <h1>
            Make your resume feel
            <span className="hero-highlight"> unmistakably hireable.</span>
          </h1>
          <p className="hero-subtitle">
            A premium, ATS-optimized resume review that scores clarity, surfaces
            hidden gaps, and answers role-specific questions with RAG-powered
            precision.
          </p>
          <div className="hero-actions">
            <button className="primary-button" onClick={onPrimary}>
              Analyze my resume
            </button>
            <button className="secondary-button" onClick={onSecondary}>
              View sample report
            </button>
          </div>
          <div className="hero-meta">
            <span>Trusted by 1,200+ candidates</span>
            <span>Avg. score lift: 19 points</span>
          </div>
        </div>
        <div className="hero-card">
          <div className="card-header">
            <p>Instant ATS Snapshot</p>
            <span className="chip">Live Preview</span>
          </div>
          <div className="score-ring">
            <div>
              <p className="score-label">ATS Score</p>
              <p className="score">82</p>
            </div>
          </div>
          <div className="card-list">
            <div>
              <p className="card-title">Impact clarity</p>
              <p className="card-sub">High potential, add metrics</p>
            </div>
            <div>
              <p className="card-title">Keyword alignment</p>
              <p className="card-sub">6 missing keywords</p>
            </div>
            <div>
              <p className="card-title">Structure</p>
              <p className="card-sub">Tighten summary + projects</p>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
