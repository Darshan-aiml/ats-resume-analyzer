import React from "react";
import Section from "./Section";

export default function ScoreSection({ analysis }) {
  return (
    <Section
      id="score"
      kicker="Step 02"
      title="A score that actually maps to hiring signals."
      description="We measure keyword match, impact clarity, and recruiter readability to build an ATS score you can trust."
    >
      <div className="score-grid">
        <div className="score-spotlight">
          <div className="score-ring large">
            <div>
              <p className="score-label">ATS Score</p>
              <p className="score">{analysis?.atsScore ?? "--"}</p>
            </div>
          </div>
          <p className="score-summary">{analysis?.summary ?? "Upload a resume to see your personalized score."}</p>
          {analysis?.estimatedLift ? (
            <div className="lift-indicator">
              <p className="lift-label">Potential improvement</p>
              <p className="lift-value">+{analysis.estimatedLift} points</p>
              <p className="lift-note">by implementing suggestions below</p>
            </div>
          ) : null}
          {analysis?.geminiPowered ? (
            <p className="gemini-badge">✨ Enhanced by Gemini AI</p>
          ) : null}
        </div>
        <div className="score-details">
          <h3>Highlights</h3>
          <ul>
            {(analysis?.highlights || []).map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
          <h3>Verification</h3>
          <div className="pill-row">
            {(analysis?.sectionsReviewed || ["Summary", "Experience", "Skills"]).map((item) => (
              <span key={item} className="pill">
                {item}
              </span>
            ))}
          </div>
          {analysis?.evidence ? (
            <div className="evidence-list">
              <div>
                <p className="evidence-title">Keywords matched</p>
                <p className="evidence-value">{analysis.evidence.keywordsMatched.join(", ") || "None detected"}</p>
              </div>
              <div>
                <p className="evidence-title">Impact metrics</p>
                <p className="evidence-value">{analysis.evidence.metricSamples.join(" · ") || "No quantified metrics detected"}</p>
              </div>
              <div>
                <p className="evidence-title">Resume length</p>
                <p className="evidence-value">{analysis.evidence.wordCount} words · {analysis.evidence.sentenceCount} sentences</p>
              </div>
            </div>
          ) : null}
        </div>
      </div>

      {analysis?.errors && analysis.errors.length > 0 ? (
        <div className="errors-section">
          <h3>Detected Issues</h3>
          <div className="errors-grid">
            {analysis.errors.map((error, idx) => (
              <div key={idx} className={`error-card severity-${error.severity}`}>
                <div className="error-header">
                  <p className="error-category">{error.category}</p>
                  <span className="severity-badge">{error.severity}</span>
                </div>
                <p className="error-description">{error.description}</p>
                {error.example ? (
                  <p className="error-example">Example: {error.example}</p>
                ) : null}
              </div>
            ))}
          </div>
        </div>
      ) : null}

      <div className="breakdown-grid">
        {(analysis?.breakdown || []).map((item) => (
          <div key={item.label} className="breakdown-card">
            <div className="breakdown-header">
              <p>{item.label}</p>
              <span>{item.score} / {item.weight}</span>
            </div>
            <p className="breakdown-desc">{item.note}</p>
            <div className="breakdown-evidence">
              {item.evidence.map((evidence) => (
                <span key={evidence}>{evidence}</span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </Section>
  );
}
