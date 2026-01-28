# 🌟 Lumina: Academic Discovery Engine

Lumina is a next-generation academic discovery platform that transforms how researchers, students, and curious minds explore human knowledge. By synthesizing over 200M research papers and 50M books into a single, beautiful interface, Lumina turns static searching into dynamic discovery.

![Lumina Screenshot](https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?auto=format&fit=crop&q=80&w=1200)

## 🚀 Standout Features

### 1. Neural Knowledge Map (Visual Discovery)
Most search engines give you a list; Lumina gives you a landscape. Using a **D3-powered force-directed graph**, Lumina visualizes the "connective tissue" between research topics, allowing you to see how disparate fields overlap at a glance.

### 2. Voice-First Research (Multimodal Input)
Remove the friction between thought and discovery. With integrated **Web Speech API**, Lumina supports high-accuracy voice search, making complex academic queries as natural as a conversation.

### 3. The Unified Repository
Lumina bridges the gap between deep academic theory and broad general context by simultaneously querying:
- **OpenAlex API:** 200M+ global research works and datasets.
- **OpenLibrary API:** 50M+ books, editions, and literary works.

### 4. Adaptive Experience
- **Glassmorphism UI:** A premium, Apple-style design system built with Tailwind CSS.
- **Intelligent Dark Mode:** Auto-switching theme support for late-night research sessions.
- **Responsive Mastery:** Fully optimized for seamless discovery on mobile, tablet, and desktop.

## 🛠️ Technology Stack

- **Core:** [React 19](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/)
- **Build Tool:** [Vite](https://vitejs.dev/)
- **Styling:** [Tailwind CSS](https://tailwindcss.com/)
- **Visualizations:** [D3.js](https://d3js.org/)
- **Logic & State:** Custom Hooks (`useVoiceSearch`, `useDarkMode`)
- **Intelligence:** [Google Generative AI (Gemini)](https://ai.google.dev/) (Ready for expansion)

## 📦 Getting Started

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/Apurv-15/Hackthon-2-0.git
   cd Hackthon-2-0
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Run the development server:**
   ```bash
   npm run dev
   ```

4. **Build for production:**
   ```bash
   npm run build
   ```

## 🗺️ Project Structure

```text
├── components/          # Reusable UI components (Cards, Hero, Graph)
├── hooks/               # Custom logic for Voice and Theme
├── services/            # API abstraction (OpenAlex, OpenLibrary)
├── types.ts             # Global TypeScript interfaces
├── App.tsx              # Application layout & state management
└── main.tsx             # Entry point
```

## 🌿 Future Roadmap

- [ ] **AI Synthesis:** Summarizing search results using Gemini AI.
- [ ] **Personal Library:** Save and bookmark resources via local storage/Firebase.
- [ ] **PDF Previewer:** Direct viewing of Open Access papers inside the app.

---

Built with ❤️ for the Hackathon 2.0. 
**Knowledge, Reimagined.**
