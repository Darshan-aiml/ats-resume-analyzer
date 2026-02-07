import React, { useState } from "react";
import Section from "./Section";

export default function ChatSection({ onAsk, isLoading, engineLabel }) {
  const [question, setQuestion] = useState("");
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      text: "Ask anything about your resume or the job description and I will ground my answer in your document.",
    },
  ]);

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!question.trim()) return;

    const nextQuestion = question;
    setQuestion("");
    setMessages((prev) => [...prev, { role: "user", text: nextQuestion }]);

    try {
      const response = await onAsk(nextQuestion);
      setMessages((prev) => [...prev, { role: "assistant", text: response.answer, sources: response.sources }]);
    } catch (error) {
      setMessages((prev) => [...prev, { role: "assistant", text: error.message || "Something went wrong." }]);
    }
  };

  return (
    <Section
      id="chat"
      kicker="Step 04"
      title="Chat with a RAG-powered recruiter brain."
      description="Upload once, then ask questions tailored to your resume, the role, and the ATS criteria."
    >
      <p className="chat-meta">{engineLabel}</p>
      <div className="chat-card">
        <div className="chat-window">
          {messages.map((message, index) => (
            <div key={`${message.role}-${index}`} className={`chat-bubble ${message.role}`}>
              <p>{message.text}</p>
              {message.sources ? (
                <div className="chat-sources">
                  {message.sources.map((source) => (
                    <span key={source}>{source}</span>
                  ))}
                </div>
              ) : null}
              {message.snippets ? (
                <div className="chat-snippets">
                  {message.snippets.map((snippet, snippetIndex) => (
                    <p key={`${snippet}-${snippetIndex}`}>{snippet}</p>
                  ))}
                </div>
              ) : null}
            </div>
          ))}
        </div>
        <form className="chat-input" onSubmit={handleSubmit}>
          <input
            type="text"
            value={question}
            onChange={(event) => setQuestion(event.target.value)}
            placeholder="How can I make my experience stronger for product roles?"
          />
          <button className="primary-button" type="submit" disabled={isLoading}>
            {isLoading ? "Thinking..." : "Ask Nova"}
          </button>
        </form>
      </div>
    </Section>
  );
}
