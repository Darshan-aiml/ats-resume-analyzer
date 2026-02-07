# 🎯 ATS Resume Analyzer

An intelligent AI-powered resume analyzer that provides detailed ATS (Applicant Tracking System) scoring, error detection, and actionable improvement suggestions using Google Gemini AI.

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![React](https://img.shields.io/badge/React-18.2-61dafb.svg)
![Vite](https://img.shields.io/badge/Vite-5.2-646cff.svg)

## ✨ Features

### 🤖 Intelligent AI Analysis
- **Google Gemini 2.5 Flash** integration for smart resume analysis
- **7+ Error Categories** with severity levels (High, Medium, Low)
- **5-Component ATS Scoring**: Keywords (35%), Metrics (20%), Structure (20%), Readability (15%), Conciseness (10%)
- **Transparent Scoring**: See exactly how your score is calculated

### 📊 Error Detection
- Missing quantifiable metrics and achievements
- Weak or missing keywords for target roles
- No professional summary or objective
- Resume length issues (too short/long)
- Poor readability and formatting
- Insufficient action verbs
- Structure and organization problems

### 💡 Actionable Suggestions
- **Priority-ranked improvements** with impact badges
- **ATS Score Projections** (+8-12 points, +10-15 points, etc.)
- **Section-specific guidance** (Experience, Skills, Summary)
- **Evidence-based recommendations** from your resume content
- **Before/After examples** for clarity

### 🎨 Modern UI/UX
- Clean, professional design with consistent spacing
- Priority badges (#1, #2, #3) for top suggestions
- Severity-coded error cards (High/Medium/Low)
- Lift potential indicator showing score improvement range
- Responsive design for all devices
- Smooth animations and transitions

## 🚀 Quick Start

### Prerequisites
- Node.js 16+ and npm
- Google Gemini API key ([Get one here](https://ai.google.dev/))

### Installation

```bash
# Clone the repository
git clone https://github.com/Darshan-aiml/ats-resume-analyzer.git
cd ats-resume-analyzer

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local
# Edit .env.local and add your Gemini API key
```

### Development

```bash
# Start development server
npm run dev

# Open http://localhost:5174
```

### Production Build

```bash
# Build for production
npm run build

# Preview production build
npm run preview
```

## 🔧 Configuration

### Environment Variables

Create a `.env.local` file in the root directory:

```env
VITE_GEMINI_API_KEY=your_gemini_api_key_here
```

**⚠️ Important**: Never commit `.env.local` to version control. It's already in `.gitignore`.

## 📦 Deployment

### Deploy to Vercel (Recommended)

```bash
# Install Vercel CLI
npm install -g vercel

# Login
vercel login

# Deploy
vercel --prod

# Add environment variable
vercel env add VITE_GEMINI_API_KEY
```

Or use the provided deployment script:
```bash
./deploy.sh
```

See [DEPLOYMENT.md](DEPLOYMENT.md) for detailed deployment instructions.

## 🏗️ Project Structure

```
├── src/
│   ├── api/
│   │   └── mockApi.js           # Gemini AI integration & analysis logic
│   ├── components/
│   │   ├── Hero.jsx              # Landing section
│   │   ├── UploadSection.jsx    # Resume upload interface
│   │   ├── ScoreSection.jsx     # ATS score display & error cards
│   │   ├── SuggestionsSection.jsx # Actionable improvements
│   │   ├── ChatSection.jsx      # Future chat interface
│   │   └── Footer.jsx           # Footer component
│   ├── hooks/
│   │   └── useReveal.js         # Scroll reveal animations
│   ├── utils/
│   │   └── resumeParser.js      # PDF parsing utilities
│   ├── App.jsx                   # Main app component
│   ├── main.jsx                  # Entry point
│   └── styles.css                # Global styles & design system
├── index.html
├── package.json
├── vite.config.js
├── vercel.json                   # Vercel deployment config
└── deploy.sh                     # Automated deployment script
```

## 🎨 Design System

The project uses a comprehensive CSS custom properties system:

- **Spacing**: 8px-based scale (--space-xs to --space-4xl)
- **Typography**: rem-based sizing (--text-xs to --text-5xl)
- **Colors**: Semantic variables (--success, --warning, --error, --info)
- **Shadows**: Consistent elevation (--shadow-sm to --shadow-xl)
- **Transitions**: Standardized timing (--transition-base, --transition-slow)

## 📚 Documentation

- [QUICKSTART.md](QUICKSTART.md) - Quick start guide
- [FEATURES.md](FEATURES.md) - Detailed feature documentation
- [IMPLEMENTATION.md](IMPLEMENTATION.md) - Implementation details
- [CODE_EXAMPLES.md](CODE_EXAMPLES.md) - Code examples and API usage
- [DEPLOYMENT.md](DEPLOYMENT.md) - Deployment instructions
- [VISUAL_GUIDE.md](VISUAL_GUIDE.md) - UI/UX visual guide

## 🛠️ Technologies

- **Frontend**: React 18.2, Vite 5.2
- **AI**: Google Gemini 2.5 Flash API
- **PDF Processing**: pdfjs-dist
- **Styling**: CSS Custom Properties
- **Deployment**: Vercel

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License.

## 🙏 Acknowledgments

- Google Gemini AI for intelligent analysis capabilities
- PDF.js for PDF parsing functionality
- React and Vite teams for excellent developer tools

## 📧 Contact

For questions or support, please open an issue on GitHub.

---

Made with ❤️ for job seekers worldwide
