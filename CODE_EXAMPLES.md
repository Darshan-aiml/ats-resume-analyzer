# Code Examples: Enhanced Analysis System

## Example 1: What Gemini Analysis Returns

### Input
```javascript
const resumeText = `
John Doe
john@example.com | 555-0123

Experience
Product Manager at TechCorp (2021-2023)
- Worked on product features
- Collaborated with engineering
- Improved user engagement

Skills
Product Management, Leadership, Analytics
`;
```

### Output from Gemini
```javascript
{
  errors: [
    {
      category: "Missing quantified metrics",
      severity: "high",
      description: "Resume lacks measurable impact statements",
      example: "Only 0 numeric signals detected"
    },
    {
      category: "Weak keyword alignment",
      severity: "high",
      description: "Missing critical role-specific keywords",
      example: "Matched only 2 of 25 target keywords"
    }
  ],
  atsOptimizations: [
    {
      title: "Quantify Impact",
      currentState: "Vague impact statements without numbers",
      improvement: "Replace 'improved user engagement' with 'increased daily active users by 34%'",
      expectedImpact: "12% ATS score improvement"
    }
  ],
  strengths: [
    "Clear role progression",
    "Relevant domain experience"
  ],
  estimatedATSLift: 15
}
```

## Example 2: Local Error Detection (Fallback)

```javascript
// When Gemini unavailable, local analysis provides:
errors = [
  {
    category: "Missing professional summary",
    severity: "medium",
    description: "No summary section to establish context",
    example: "Resume starts directly with experience"
  },
  {
    category: "Resume length out of range",
    severity: "medium", 
    description: "Resume is too brief for ATS parsing",
    example: "Current length: 180 words (optimal: 350-900)"
  }
];

suggestions = [
  {
    title: "Add a professional summary",
    detail: "Write a 2-3 line summary that captures your role, key strengths, and value prop. Example: 'Product Manager with 7+ years driving user engagement and revenue growth at B2B SaaS.'",
    evidence: "No summary section detected.",
    expectedImpact: "+5-8 ATS points"
  }
];
```

## Example 3: ATS Score Breakdown

```javascript
// Score components with evidence
breakdown = [
  {
    label: "Keyword alignment",
    score: 18,           // earned points
    weight: 35,          // max possible
    note: "Matches against a curated role keyword set",
    evidence: [
      "8 keywords matched",
      "Top hits: product, strategy, leadership"
    ]
  },
  {
    label: "Impact metrics",
    score: 8,
    weight: 20,
    note: "Counts quantified outcomes across resume",
    evidence: [
      "2 numeric impact signals",
      "Examples: 34% · +$2M"
    ]
  },
  {
    label: "Structure coverage",
    score: 20,
    weight: 20,
    note: "Checks for key ATS sections",
    evidence: [
      "Sections detected: Summary, Experience, Skills, Education"
    ]
  },
  {
    label: "Readability",
    score: 15,
    weight: 15,
    note: "Average sentence length signals clarity",
    evidence: [
      "18 words per sentence"
    ]
  },
  {
    label: "Conciseness",
    score: 10,
    weight: 10,
    note: "Targets recruiter-friendly length",
    evidence: [
      "542 total words"
    ]
  }
]

// Total: 71/100 ATS Score
```

## Example 4: Error Detection Pipeline

```javascript
// Step 1: Detect missing metrics
if (metrics.length < 3) {
  errors.push({
    category: "Missing quantified metrics",
    severity: "high",
    description: "Resume lacks measurable impact statements",
    example: `Only ${metrics.length} numeric signals detected`
  });
}

// Step 2: Check keyword coverage
if (keywordMatches.length < 8) {
  errors.push({
    category: "Weak keyword alignment",
    severity: "high",
    description: "Missing critical role-specific keywords",
    example: `Matched ${keywordMatches.length} of ${keywordLibrary.length} keywords`
  });
}

// Step 3: Validate resume structure
if (!sectionsReviewed.includes("Summary")) {
  errors.push({
    category: "Missing professional summary",
    severity: "medium",
    description: "No summary section to establish context",
    example: "Resume starts directly with experience"
  });
}
```

## Example 5: Suggestion Generation with Impact

```javascript
suggestions = [
  {
    title: "Quantify impact",
    detail: "Add measurable outcomes (%, $, #) to recent roles. Example: 'Increased user engagement by 23%' instead of 'Improved user engagement'.",
    currentState: "Only 2 numeric metrics found",
    evidence: `Detected ${metrics.length} numeric impact signals.`,
    expectedImpact: "+8-12 ATS points",
    severity: "high"
  },
  {
    title: "Mirror job description keywords",
    detail: "Review the target job description and integrate 5-7 key terms into your experience bullets. Use natural language that matches the role.",
    currentState: `Matched ${keywordMatches.length} of ${keywordLibrary.length} keywords`,
    evidence: `Top matches: ${keywordMatches.slice(0, 3).join(", ")}`,
    expectedImpact: "+10-15 ATS points",
    severity: "high"
  },
  {
    title: "Add a professional summary",
    detail: "Write a 2-3 line summary. Example: 'Product Manager with 7+ years driving user engagement and revenue growth at B2B SaaS. Expertise in cross-functional leadership.'",
    currentState: "No professional summary",
    evidence: "No summary section detected.",
    expectedImpact: "+5-8 ATS points",
    severity: "medium"
  }
];
```

## Example 6: Gemini Prompt Engineering

```javascript
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
  "strengths": ["strength1", "strength2"],
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
```

## Example 7: Enhanced UI Component

```jsx
export default function ScoreSection({ analysis }) {
  return (
    <Section id="score" kicker="Step 02" title="ATS Score">
      {/* Score Display */}
      <div className="score-spotlight">
        <div className="score-ring large">
          <p className="score">{analysis?.atsScore ?? "--"}</p>
        </div>
        
        {/* Lift Indicator - NEW! */}
        {analysis?.estimatedLift && (
          <div className="lift-indicator">
            <p className="lift-label">Potential improvement</p>
            <p className="lift-value">+{analysis.estimatedLift} points</p>
            <p className="lift-note">by implementing suggestions below</p>
          </div>
        )}
        
        {/* Gemini Badge - NEW! */}
        {analysis?.geminiPowered && (
          <p className="gemini-badge">✨ Enhanced by Gemini AI</p>
        )}
      </div>

      {/* Errors Section - NEW! */}
      {analysis?.errors?.length > 0 && (
        <div className="errors-section">
          <h3>Detected Issues</h3>
          <div className="errors-grid">
            {analysis.errors.map((error) => (
              <div key={error.category} 
                   className={`error-card severity-${error.severity}`}>
                <div className="error-header">
                  <p className="error-category">{error.category}</p>
                  <span className="severity-badge">{error.severity}</span>
                </div>
                <p className="error-description">{error.description}</p>
                <p className="error-example">Example: {error.example}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Score Breakdown */}
      <div className="breakdown-grid">
        {analysis?.breakdown?.map((item) => (
          <div key={item.label} className="breakdown-card">
            <div className="breakdown-header">
              <p>{item.label}</p>
              <span>{item.score} / {item.weight}</span>
            </div>
            <p className="breakdown-desc">{item.note}</p>
          </div>
        ))}
      </div>
    </Section>
  );
}
```

## Example 8: Styled Error Cards

```css
/* Error card with severity color-coding */
.error-card {
  background: var(--bg-alt);
  padding: 20px;
  border-radius: var(--radius-md);
  border-left: 4px solid;
}

/* High severity - Red */
.error-card.severity-high {
  border-left-color: #ef4444;
  background: rgba(239, 68, 68, 0.05);
}

/* Medium severity - Orange */
.error-card.severity-medium {
  border-left-color: #f97316;
  background: rgba(249, 115, 22, 0.05);
}

/* Low severity - Yellow */
.error-card.severity-low {
  border-left-color: #eab308;
  background: rgba(234, 179, 8, 0.05);
}

.severity-badge {
  padding: 4px 10px;
  border-radius: 999px;
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.error-card.severity-high .severity-badge {
  background: rgba(239, 68, 68, 0.2);
  color: #991b1b;
}
```

## Example 9: Complete Analysis Flow

```javascript
// src/api/mockApi.js
export async function analyzeResume(resumeText) {
  // 1. Local analysis
  const cleaned = cleanText(resumeText);
  const wordCount = cleaned.split(" ").length;
  const keywordMatches = findKeywordMatches(cleaned);
  const metrics = getMetrics(cleaned);
  
  // 2. Gemini AI analysis
  const geminiAnalysis = await parseGeminiAnalysis(resumeText);
  
  // 3. Error detection
  let errors = [];
  if (geminiAnalysis) {
    errors = geminiAnalysis.errors; // Use Gemini errors
  } else {
    errors = detectLocalErrors(metrics, keywordMatches); // Fallback
  }
  
  // 4. Suggestion generation  
  const suggestions = generateSuggestions(errors, metrics, keywordMatches);
  
  // 5. ATS scoring
  const atsScore = calculateScore(wordCount, keywordMatches, metrics);
  
  // 6. Return complete analysis
  return {
    atsScore,
    errors,
    suggestions,
    geminiPowered: !!geminiAnalysis,
    estimatedLift: geminiAnalysis?.estimatedATSLift || 5,
    breakdown: [/* 5-component breakdown */],
    evidence: {/* keyword matches, metrics, etc */}
  };
}
```

## Example 10: What the User Sees

### Before Enhancement
```
Score: 68/100
✓ Keyword coverage: 5 matched
✓ Quantified metrics found (2)
✓ Core sections detected

Tips:
- Quantify impact
- Keyword alignment
- Add a sharp summary
```

### After Enhancement  
```
Score: 68/100
Potential improvement: +23 points
✨ Enhanced by Gemini AI

Detected Issues:
  ❌ High: Missing quantified metrics
     Resume lacks measurable impact statements
     Example: Only 2 numeric signals detected
     
  ⚠️ High: Weak keyword alignment
     Missing critical role-specific keywords
     Example: Matched 5 of 25 target keywords

Top Suggestions:
  1. Quantify impact → +8-12 points
     Fix: Add % increases, $ savings, # of people impacted
     [Edit Now] [See Example]
     
  2. Mirror job keywords → +10-15 points
     Fix: Integrate 5-7 key terms into bullets
     [Edit Now] [See Example]
     
  3. Add professional summary → +5-8 points
     Fix: Write 2-3 line summary of your role and impact
     [Edit Now] [See Example]

Score Breakdown:
  Keyword alignment: 18/35 ⚠️
  Impact metrics: 8/20 ⚠️  
  Structure coverage: 20/20 ✅
  Readability: 15/15 ✅
  Conciseness: 10/10 ✅
```

---

These examples show how the system works from raw resume text to intelligent, actionable feedback!
