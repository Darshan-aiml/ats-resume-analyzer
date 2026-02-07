import React from "react";
import Section from "./Section";

export default function SuggestionsSection({ analysis }) {
  return (
    <Section
      id="suggestions"
      kicker="Step 03"
      title="Actionable edits, not generic tips."
      description="Each suggestion is ranked by impact and tied back to hiring signals so you know what to fix first."
    >
      <div className="suggestions-grid">
        {(analysis?.suggestions || []).map((suggestion, idx) => (
          <article key={idx} className={`suggestion-card priority-${idx + 1}`}>
            <div className="card-priority-badge">#{idx + 1}</div>
            
            <div className="suggestion-header">
              <div className="header-content">
                <h4>{suggestion.title}</h4>
                {suggestion.expectedImpact ? (
                  <span className="impact-badge">{suggestion.expectedImpact}</span>
                ) : null}
              </div>
            </div>
            
            <p className="suggestion-detail">{suggestion.detail}</p>
            
            <div className="suggestion-content">
              {suggestion.currentState ? (
                <div className="suggestion-section current">
                  <div className="section-icon">⚠️</div>
                  <div className="section-content">
                    <p className="suggestion-label">Current state</p>
                    <p className="suggestion-value">{suggestion.currentState}</p>
                  </div>
                </div>
              ) : null}
              
              {suggestion.evidence ? (
                <div className="suggestion-section evidence">
                  <div className="section-icon">📊</div>
                  <div className="section-content">
                    <p className="suggestion-label">Evidence</p>
                    <p className="suggestion-value">{suggestion.evidence}</p>
                  </div>
                </div>
              ) : null}
            </div>

            <div className="suggestion-actions">
              <button className="suggestion-button primary">
                <span className="button-icon">✏️</span>
                Edit Resume
              </button>
              <button className="suggestion-button secondary">
                <span className="button-icon">✨</span>
                See Example
              </button>
            </div>
          </article>
        ))}
        {!analysis?.suggestions?.length ? (
          <div className="empty-state">
            Run an analysis to unlock prioritized improvements.
          </div>
        ) : null}
      </div>

      {analysis?.suggestions?.length > 0 ? (
        <div className="optimization-summary">
          <h3>How to maximize your ATS score</h3>
          <ol className="priority-list">
            {analysis.suggestions.slice(0, 3).map((suggestion, idx) => (
              <li key={idx}>
                <strong>{suggestion.title}:</strong> {suggestion.detail}
              </li>
            ))}
          </ol>
          <p className="summary-note">
            Implementing these changes could improve your score by <strong>+{analysis.estimatedLift || 5}-{Math.min(25, (analysis.estimatedLift || 5) * 2)} points</strong>.
          </p>
        </div>
      ) : null}
    </Section>
  );
}
