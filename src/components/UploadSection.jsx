import React from "react";
import Section from "./Section";

export default function UploadSection({
  file,
  setFile,
  onAnalyze,
  isLoading,
  error,
}) {
  return (
    <Section
      id="upload"
      kicker="Step 01"
      title="Upload once. We read everything."
      description="Drop your resume and let Nova parse structure, wording, and ATS signals in seconds."
    >
      <div className="upload-card">
        <label className="file-drop">
          <input
            type="file"
            accept=".pdf,.txt"
            onChange={(event) => setFile(event.target.files?.[0] || null)}
          />
          <div>
            <p className="file-title">{file ? file.name : "Choose a resume"}</p>
            <p className="file-sub">PDF or TXT · Max 10MB</p>
          </div>
        </label>
        <button
          className="primary-button"
          onClick={onAnalyze}
          disabled={isLoading}
        >
          {isLoading ? "Analyzing..." : "Run ATS analysis"}
        </button>
        {error ? <p className="error-text">{error}</p> : null}
      </div>
    </Section>
  );
}
