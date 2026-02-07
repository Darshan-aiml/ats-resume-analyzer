import React, { useState } from "react";
import Hero from "./components/Hero";
import UploadSection from "./components/UploadSection";
import ScoreSection from "./components/ScoreSection";
import SuggestionsSection from "./components/SuggestionsSection";
import ChatSection from "./components/ChatSection";
import Footer from "./components/Footer";
import { analyzeResume, askResumeQuestion } from "./api/mockApi";
import { parseResumeFile } from "./utils/resumeParser";

const scrollToId = (id) => {
  const element = document.getElementById(id);
  if (element) {
    element.scrollIntoView({ behavior: "smooth", block: "start" });
  }
};

export default function App() {
  const [file, setFile] = useState(null);
  const [analysis, setAnalysis] = useState(null);
  const [resumeText, setResumeText] = useState("");
  const defaultModel = import.meta.env.VITE_GEMINI_MODEL || "gemini-2.5-flash";
  const defaultLabel = import.meta.env.VITE_GEMINI_API_KEY
    ? `Gemini (${defaultModel}) · RAG grounded`
    : `Gemini (${defaultModel}) · Set VITE_GEMINI_API_KEY to enable`;
  const [engineLabel, setEngineLabel] = useState(defaultLabel);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisError, setAnalysisError] = useState("");
  const [isChatting, setIsChatting] = useState(false);

  const handleAnalyze = async () => {
    setIsAnalyzing(true);
    setAnalysisError("");

    try {
      const extractedText = await parseResumeFile(file);
      setResumeText(extractedText);
      const result = await analyzeResume(extractedText);
      setAnalysis(result);
      scrollToId("score");
    } catch (error) {
      setAnalysisError(error.message || "Unable to analyze the resume.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleAsk = async (question) => {
    setIsChatting(true);
    try {
      const response = await askResumeQuestion(question, resumeText);
      if (response.engineLabel) {
        setEngineLabel(response.engineLabel);
      }
      return response;
    } finally {
      setIsChatting(false);
    }
  };

  return (
    <div className="page">
      <Hero
        onPrimary={() => scrollToId("upload")}
        onSecondary={() => scrollToId("score")}
      />

      <section className="story">
        <div className="story-card">
          <p className="kicker">Product story</p>
          <h2>Why Nova?</h2>
          <p>
            We combine ATS scoring, recruiter heuristics, and retrieval-augmented
            context so every recommendation is grounded in your resume and the
            role you want next.
          </p>
          <button
            className="secondary-button"
            onClick={() => scrollToId("upload")}
          >
            Start the analysis
          </button>
        </div>
        <div className="story-metrics">
          <div>
            <p className="metric">3 min</p>
            <p className="metric-label">Average analysis time</p>
          </div>
          <div>
            <p className="metric">94%</p>
            <p className="metric-label">Recruiter satisfaction</p>
          </div>
          <div>
            <p className="metric">+19</p>
            <p className="metric-label">Avg. ATS score lift</p>
          </div>
        </div>
      </section>

      <UploadSection
        file={file}
        setFile={setFile}
        onAnalyze={handleAnalyze}
        isLoading={isAnalyzing}
        error={analysisError}
      />
      <ScoreSection analysis={analysis} />
      <SuggestionsSection analysis={analysis} />
      <ChatSection onAsk={handleAsk} isLoading={isChatting} engineLabel={engineLabel} />

      <section className="cta">
        <div>
          <h2>Ready to ship a resume that reads like a product launch?</h2>
          <p>
            Start with a single upload and unlock ATS scores, improvements, and
            RAG-powered guidance built for modern hiring signals.
          </p>
        </div>
        <button className="primary-button" onClick={() => scrollToId("upload")}>
          Upload my resume
        </button>
      </section>

      <Footer />
    </div>
  );
}
