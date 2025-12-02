# 🎵 Nagma-e-AI - AI-Powered Songwriting Companion

> Your intelligent assistant for creating, analyzing, and perfecting song lyrics with the power of AI.

[![Next.js](https://img.shields.io/badge/Next.js-14.0-black?style=flat-square&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
[![Google Gemini](https://img.shields.io/badge/Google-Gemini%202.5-4285F4?style=flat-square&logo=google)](https://ai.google.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-CSS-38B2AC?style=flat-square&logo=tailwind-css)](https://tailwindcss.com/)

---

## ✨ Features

### 🎤 **Songwriting Assistance**
- **Singing Lines** - Generate singable, rhythmic lyrical lines that continue your song
- **Next Lines** - Create catchy song-like stanzas with emotional depth
- **Music Styles** - Get AI suggestions for music genres that fit your lyrics

### 🎭 **Emotion Analysis**
- Analyzes lyrics for 6 emotions: Happy, Sad, Angry, Romantic, Energetic, Melancholic
- Visual emotion breakdown with animated color bars
- Identifies dominant emotion and mood description

### 🎵 **Song Structure Builder**
- AI-powered professional song structure suggestions (Intro, Verse, Chorus, Bridge, Outro)
- Bar count recommendations for each section
- Rhyme scheme analysis (AABB, ABAB, etc.)
- Tempo and musical key suggestions

### 🎨 **Rhyme Pattern Visualizer**
- Real-time rhyme pattern detection
- Color-coded lines that rhyme together
- Visual rhyme scheme display (A, B, C pattern)

### 🗣️ **Voice Features**
- **Voice Input** - Dictate your lyrics hands-free
- **Talk to Google AI** - Full voice conversation with AI assistant
- **Text-to-Speech** - Listen to generated lyrics with song-like delivery (line-by-line with pauses)

### 🌍 **Bilingual Support**
- English and Hinglish (Hindi-English mix)
- Seamless language switching

---

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ installed
- Google Gemini API key ([Get one here](https://ai.google.dev/))

### Installation

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd Poetry-Companion
   ```

2. **Install dependencies**
   ```bash
   cd nextjs-app
   npm install
   ```

3. **Set up environment variables**
   
   Create a `.env` file in the `nextjs-app` directory:
   ```env
   GEMINI_API_KEY=your_gemini_api_key_here
   ```

4. **Run the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   
   Navigate to [http://localhost:3000](http://localhost:3000)

---

## 🎯 How to Use

### Creating Lyrics

1. **Write a line** in the textarea (or use Voice Input)
2. **Select assistance type:**
   - Singing Lines - Get more lyrical lines
   - Next Lines - Generate a full stanza
   - Music Styles - Get genre suggestions
3. **Click "Create Song"** to generate AI suggestions
4. **Listen** to results using the speaker icon

### Analyzing Your Song

1. **Write your lyrics** (4-8 lines recommended)
2. **Click "Analyze Song"** button
3. **View three analysis panels:**
   - 🎭 Emotion breakdown
   - 🎵 Song structure timeline
   - 🎨 Rhyme pattern visualization

### Voice Conversation

1. **Click "Talk to Google AI"** button
2. **Wait for intro** ("Ask me anything, I am listening")
3. **Speak your question** about songwriting
4. **Listen to AI response** spoken out loud

---

## 🛠️ Tech Stack

- **Framework:** Next.js 14 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **AI:** Google Gemini 2.5 Flash
- **Voice:** Web Speech API (Recognition & Synthesis)
- **Deployment:** Vercel-ready

---

## 📁 Project Structure

```
nextjs-app/
├── app/
│   ├── api/
│   │   ├── emotion-analyzer/     # Emotion analysis endpoint
│   │   ├── song-structure/       # Structure analysis endpoint
│   │   └── poetry-companion/     # Main lyrics generation endpoint
│   ├── layout.tsx                # Root layout
│   └── page.tsx                  # Main page component
├── components/
│   ├── EmotionAnalyzer.tsx       # Emotion visualization
│   ├── SongStructure.tsx         # Structure timeline
│   └── RhymeVisualizer.tsx       # Rhyme pattern display
├── public/
│   └── logo.png                  # App logo
└── package.json
```

---

## 🎨 Features Showcase

### Emotion Analysis
Detects and visualizes emotional content with percentage breakdowns:
- �  Happy
- 😢 Sad
- 😡 Angry
- 💕 Romantic
- ⚡ Energetic
- 🌧️ Melancholic

### Song Structure
Suggests professional structure with:
- Section types (Intro, Verse, Chorus, Bridge, Outro)
- Bar counts for each section
- Rhyme scheme patterns
- Tempo and key recommendations

### Rhyme Patterns
Visual color-coding shows which lines rhyme together, making it easy to see patterns like AABB, ABAB, ABCB, etc.

---

## 🌟 Unique Selling Points

1. **All-in-One Solution** - Generation + Analysis in one place
2. **Voice-First Design** - Full voice interaction capabilities
3. **Real-time Analysis** - Instant feedback on your lyrics
4. **Bilingual Support** - Works in English and Hinglish
5. **Beautiful UI** - Pinterest-style masonry layout
6. **Song-like Speech** - TTS with natural pauses between lines

---

## 🔧 Configuration

### API Rate Limits
The app uses Google Gemini 2.5 Flash which has generous free tier limits:
- 15 requests per minute
- 1 million tokens per minute
- 1,500 requests per day

### Voice Settings
- Speech recognition works best in Chrome/Edge
- Requires microphone permissions
- Supports English (en-US) and Hindi (hi-IN)

---

## 📝 Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `GEMINI_API_KEY` | Your Google Gemini API key | Yes |

---

## 🚀 Deployment

### Deploy to Vercel (Recommended)

1. **Push to GitHub**
   ```bash
   git add .
   git commit -m "Initial commit"
   git push origin main
   ```

2. **Import to Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Click "New Project"
   - Import your GitHub repository
   - Set root directory to `nextjs-app`
   - Add `GEMINI_API_KEY` environment variable
   - Deploy!

---

## 🤝 Contributing

Contributions are welcome! Feel free to:
- Report bugs
- Suggest new features
- Submit pull requests

---

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

---

## 🙏 Acknowledgments

- **Google Gemini** for powerful AI capabilities
- **Next.js** for the amazing framework
- **Tailwind CSS** for beautiful styling
- **Web Speech API** for voice features

---

## 📧 Contact

For questions or feedback, please open an issue on GitHub.

---

## 🎵 Happy Songwriting!

Made with ❤️ and AI

---

## 📸 Screenshots

> Add screenshots of your app here after deployment

---

**⭐ If you like this project, please give it a star on GitHub!**
