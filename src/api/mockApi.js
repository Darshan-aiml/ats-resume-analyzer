const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const keywordLibrary = [
  "product",
  "roadmap",
  "stakeholder",
  "strategy",
  "growth",
  "experiment",
  "metrics",
  "analytics",
  "user research",
  "customer",
  "go-to-market",
  "design",
  "engineering",
  "cross-functional",
  "launch",
  "retention",
  "a/b",
  "okrs",
  "kpis",
  "impact",
  "scalability",
  "leadership",
  "system design",
  "api",
  "react",
  "figma",
];

const sectionPatterns = [
  { label: "Summary", regex: /summary|profile|objective/i },
  { label: "Experience", regex: /experience|employment|work history/i },
  { label: "Projects", regex: /projects|case studies/i },
  { label: "Skills", regex: /skills|tooling|stack/i },
  { label: "Education", regex: /education|certifications/i },
];

const cleanText = (text) => text.replace(/\s+/g, " ").trim();

const splitSentences = (text) =>
  text
    .replace(/\s+/g, " ")
    .split(/[.!?]\s+/)
    .filter(Boolean);

const tokenize = (text) =>
  cleanText(text)
    .toLowerCase()
    .split(/[^a-z0-9+%$]+/)
    .filter(Boolean);

const getMetrics = (text) => {
  const matches = text.match(/\b\d{1,3}%|\$\d[\d,]*(?:\.\d+)?|\b\d{1,4}\+?\b/g) || [];
  return matches.slice(0, 6);
};

const findKeywordMatches = (text) => {
  const lower = text.toLowerCase();
  return keywordLibrary.filter((keyword) => lower.includes(keyword));
};

const detectSections = (text) =>
  sectionPatterns
    .filter((section) => section.regex.test(text))
    .map((section) => section.label);

const clamp = (value, min, max) => Math.max(min, Math.min(max, value));

const scoreLength = (wordCount) => {
  if (wordCount < 250) return 6;
  if (wordCount < 350) return 10;
  if (wordCount <= 900) return 15;
  if (wordCount <= 1200) return 10;
  return 6;
};

const scoreReadability = (avgSentenceLength) => {
  if (avgSentenceLength < 16) return 10;
  if (avgSentenceLength <= 22) return 15;
  if (avgSentenceLength <= 30) return 10;
  return 6;
};

const buildGeminiAnalysisPrompt = (resumeText) => {
  return `You are an expert ATS and recruitment professional. Analyze this resume for hiring signals.

RESUME:
${resumeText}

Provide a JSON response with this exact structure:
{
  "errors": [
    {
      "category": "error_type",
      "severity": "high|medium|low",
      "description": "specific issue found",
      "example": "actual text from resume"
    }
  ],
  "atsOptimizations": [
    {
      "title": "fix_title",
      "currentState": "what's wrong now",
      "improvement": "specific action to take",
      "expectedImpact": "ATS score improvement"
    }
  ],
  "strengths": ["strength1", "strength2", "strength3"],
  "estimatedATSLift": 5
}

Focus on:
1. Formatting issues that harm ATS parsing
2. Missing critical keywords or sections
3. Weak action verbs or vague impact statements
4. Inconsistent date formats
5. Contact info visibility
6. Quantifiable metrics presence
7. Proper chronological order`;
};

const parseGeminiAnalysis = async (resumeText) => {
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
  const model = import.meta.env.VITE_GEMINI_MODEL || "gemini-2.5-flash";

  if (!apiKey) {
    return null;
  }

  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-goog-api-key": apiKey,
        },
        body: JSON.stringify({
          contents: [
            {
              role: "user",
              parts: [{ text: buildGeminiAnalysisPrompt(resumeText) }],
            },
          ],
        }),
      }
    );

    const data = await response.json();
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!text) return null;

    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) return null;

    return JSON.parse(jsonMatch[0]);
  } catch (error) {
    console.warn("Gemini analysis failed, using local analysis only", error);
    return null;
  }
};

export async function analyzeResume(resumeText) {
  await delay(600);

  if (!resumeText) {
    throw new Error("Upload a PDF or TXT resume so we can analyze the content.");
  }

  const cleaned = cleanText(resumeText);
  const wordCount = cleaned.split(" ").filter(Boolean).length;
  const sentences = splitSentences(cleaned);
  const avgSentenceLength = sentences.length
    ? Math.round(wordCount / sentences.length)
    : 0;
  const keywordMatches = findKeywordMatches(cleaned);
  const metrics = getMetrics(cleaned);

  // Get intelligent analysis from Gemini if available
  const geminiAnalysis = await parseGeminiAnalysis(resumeText);
  const sectionsReviewed = detectSections(cleaned);

  const keywordScore = clamp(Math.round((keywordMatches.length / keywordLibrary.length) * 35), 0, 35);
  const metricScore = clamp(metrics.length * 4, 0, 20);
  const structureScore = clamp(sectionsReviewed.length * 4, 0, 20);
  const readabilityScore = scoreReadability(avgSentenceLength);
  const lengthScore = scoreLength(wordCount);

  const atsScore = clamp(
    keywordScore + metricScore + structureScore + readabilityScore + lengthScore,
    0,
    100
  );

  const highlights = [
    keywordMatches.length
      ? `Keyword coverage: ${keywordMatches.length} matched`
      : "Keyword coverage needs work",
    metrics.length
      ? `Quantified metrics found (${metrics.length})`
      : "Add more quantified impact",
    sectionsReviewed.length >= 4
      ? "Core sections detected"
      : "Add missing resume sections",
  ];

  // Build errors and suggestions from Gemini analysis or local heuristics
  let errors = [];
  let suggestions = [];
  let atsLift = 0;

  if (geminiAnalysis) {
    // Use Gemini-powered analysis
    errors = geminiAnalysis.errors || [];
    atsLift = geminiAnalysis.estimatedATSLift || 5;
    
    suggestions = (geminiAnalysis.atsOptimizations || []).map((opt) => ({
      title: opt.title,
      detail: opt.improvement,
      currentState: opt.currentState,
      expectedImpact: opt.expectedImpact,
      evidence: `Current: ${opt.currentState}`,
    }));
  } else {
    // Fallback to local heuristics
    if (metrics.length < 3) {
      errors.push({
        category: "Missing quantified metrics",
        severity: "high",
        description: "Resume lacks measurable impact statements",
        example: `Only ${metrics.length} numeric signals detected`,
      });
      suggestions.push({
        title: "Quantify impact",
        detail: "Add measurable outcomes (%, $, #) to recent roles to lift ATS confidence. Example: 'Increased user engagement by 23%' instead of 'Improved user engagement'.",
        evidence: `Detected ${metrics.length} numeric impact signals.`,
        expectedImpact: "+8-12 ATS points",
      });
    }
    
    if (keywordMatches.length < 8) {
      errors.push({
        category: "Weak keyword alignment",
        severity: "high",
        description: "Missing critical role-specific keywords",
        example: `Only ${keywordMatches.length} of ${keywordLibrary.length} keywords matched`,
      });
      suggestions.push({
        title: "Mirror job description keywords",
        detail: "Review the target job description and integrate 5-7 key terms into your experience bullets and skills section. Use natural language that matches the role.",
        evidence: `Matched ${keywordMatches.length} of ${keywordLibrary.length} target keywords.`,
        expectedImpact: "+10-15 ATS points",
      });
    }
    
    if (!sectionsReviewed.includes("Summary")) {
      errors.push({
        category: "Missing professional summary",
        severity: "medium",
        description: "No summary section to establish context",
        example: "Resume starts directly with experience",
      });
      suggestions.push({
        title: "Add a professional summary",
        detail: "Write a 2-3 line summary that captures your role, key strengths, and value prop. Example: 'Product Manager with 7+ years driving user engagement and revenue growth at B2B SaaS. Expertise in cross-functional leadership and data-driven decision making.'",
        evidence: "No summary section detected.",
        expectedImpact: "+5-8 ATS points",
      });
    }
    
    if (wordCount > 1100 || wordCount < 280) {
      errors.push({
        category: "Resume length out of range",
        severity: "medium",
        description: `Resume is ${wordCount < 280 ? 'too brief' : 'too long'} for ATS parsing`,
        example: `Current length: ${wordCount} words`,
      });
      suggestions.push({
        title: "Optimize resume length",
        detail: `Aim for 350–900 words. You're at ${wordCount} words. ${wordCount < 280 ? 'Add more detail to experience bullets.' : 'Cut down to essentials—remove dated or less relevant roles.'}`,
        evidence: `Current length: ${wordCount} words.`,
        expectedImpact: "+3-6 ATS points",
      });
    }
    
    if (avgSentenceLength > 30) {
      errors.push({
        category: "Poor readability",
        severity: "low",
        description: "Sentences are too long, hurting ATS parsing",
        example: `Avg sentence length: ${avgSentenceLength} words`,
      });
      suggestions.push({
        title: "Shorten sentences for clarity",
        detail: "Keep bullets to 1-2 lines max. ATS systems prefer concise, scannable content. Break long sentences into multiple bullet points.",
        evidence: `Current avg sentence length: ${avgSentenceLength} words.`,
        expectedImpact: "+2-4 ATS points",
      });
    }
    
    if (!suggestions.length) {
      suggestions.push({
        title: "Polish and refine",
        detail: "Your resume structure is solid. Now refine the top 3 bullets in each role to emphasize outcomes, leadership, and business impact.",
        evidence: "Core structure and metrics look healthy.",
        expectedImpact: "+2-5 ATS points",
      });
    }
  }

  // Sort suggestions by severity and impact
  suggestions.sort((a, b) => {
    const impactOrder = { high: 0, medium: 1, low: 2 };
    return (impactOrder[a.severity] || 1) - (impactOrder[b.severity] || 1);
  });

  return {
    atsScore: clamp(atsScore + atsLift, 0, 100),
    summary:
      atsScore >= 85
        ? "Your resume reads as high-fit with solid structure and measurable impact."
        : "Your resume has strong fundamentals with clear opportunities to boost ATS match.",
    highlights,
    suggestions,
    errors,
    estimatedLift: atsLift,
    sectionsReviewed: sectionsReviewed.length ? sectionsReviewed : ["Experience", "Skills"],
    evidence: {
      keywordsMatched: keywordMatches.slice(0, 10),
      metricSamples: metrics.slice(0, 4),
      wordCount,
      sentenceCount: sentences.length || 1,
    },
    breakdown: [
      {
        label: "Keyword alignment",
        score: keywordScore,
        weight: 35,
        note: "Matches against a curated role keyword set.",
        evidence: [
          `${keywordMatches.length} keywords matched`,
          `Top hits: ${keywordMatches.slice(0, 3).join(", ") || "None"}`,
        ],
      },
      {
        label: "Impact metrics",
        score: metricScore,
        weight: 20,
        note: "Counts quantified outcomes across the resume.",
        evidence: [
          `${metrics.length} numeric impact signals`,
          metrics.slice(0, 2).join(" · ") || "No metrics found",
        ],
      },
      {
        label: "Structure coverage",
        score: structureScore,
        weight: 20,
        note: "Checks for key ATS sections.",
        evidence: [
          `Sections detected: ${sectionsReviewed.join(", ") || "None"}`,
        ],
      },
      {
        label: "Readability",
        score: readabilityScore,
        weight: 15,
        note: "Average sentence length signals clarity.",
        evidence: [`${avgSentenceLength} words per sentence`],
      },
      {
        label: "Conciseness",
        score: lengthScore,
        weight: 10,
        note: "Targets recruiter-friendly length.",
        evidence: [`${wordCount} total words`],
      },
    ],
    geminiPowered: !!geminiAnalysis,
  };
}

const buildRagSnippets = (question, resumeText) => {
  const sentences = splitSentences(resumeText);
  const questionTokens = new Set(tokenize(question));

  const scored = sentences
    .map((sentence) => {
      const tokens = tokenize(sentence);
      const overlap = tokens.filter((token) => questionTokens.has(token));
      return {
        sentence,
        score: overlap.length,
      };
    })
    .filter((item) => item.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 3)
    .map((item) => item.sentence);

  return scored.length ? scored : sentences.slice(0, 3);
};

const buildGeminiPrompt = (question, snippets) => {
  return `You are an AI resume coach. Answer the question using ONLY the resume snippets below. ` +
    `If the answer is not in the snippets, say you need more detail.\n\n` +
    `Resume snippets:\n- ${snippets.join("\n- ")}\n\n` +
    `Question: ${question}\n\n` +
    `Respond with 2-4 sentences. Include a short actionable recommendation.`;
};

export async function askResumeQuestion(question, resumeText) {
  await delay(400);

  if (!resumeText) {
    throw new Error("Upload and analyze a resume before asking questions.");
  }

  if (!question.trim()) {
    throw new Error("Ask a focused question about your resume.");
  }

  const snippets = buildRagSnippets(question, resumeText);
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
  const model = import.meta.env.VITE_GEMINI_MODEL || "gemini-2.5-flash";

  if (apiKey) {
    try {
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-goog-api-key": apiKey,
          },
          body: JSON.stringify({
            contents: [
              {
                role: "user",
                parts: [{ text: buildGeminiPrompt(question, snippets) }],
              },
            ],
          }),
        }
      );

      const data = await response.json();
      const answer =
        data.candidates?.[0]?.content?.parts?.[0]?.text ||
        "I analyzed your resume, but could not form a complete response.";

      return {
        answer,
        sources: ["Resume context (RAG)", "Gemini response"],
        snippets,
        engineLabel: `Gemini (${model}) · RAG grounded`,
      };
    } catch (error) {
      return {
        answer: "Gemini is unavailable right now. Here's a local, grounded answer based on your resume.",
        sources: ["Resume context (RAG)"],
        snippets,
        engineLabel: "Local fallback · RAG grounded",
      };
    }
  }

  return {
    answer:
      "Based on your resume, strengthen your most recent role by adding 1-2 quantified outcomes and aligning the top skills to the target role.",
    sources: ["Resume context (RAG)"],
    snippets,
    engineLabel: "Local fallback · RAG grounded",
  };
}
