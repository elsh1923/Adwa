# Adwa AI: The Battle of Adwa AI Assistant 🏆

Adwa AI is a state-of-the-art educational platform designed to bring the history of the Battle of Adwa to life using Artificial Intelligence. Built with a Retrieval-Augmented Generation (RAG) architecture, the platform allows users to interact with history through English-language chat with historical leaders, AI-driven story modes, and interactive quizzes.

## 🚀 Features

- **AI Story Mode**: Step into a chronological narrative of the battle, asking questions along the way.
- **Consult the Leaders**: Chat directly with Emperor Menelik II, Empress Taytu Betul, Ras Alula, and others.
- **RAG-Powered Quiz**: Test your knowledge with questions generated dynamically from historical data.
- **Battle Strategy Explainer**: Visualize and understand the tactical genius behind the victory.
- **Interactive Learning**: Comprehensive exploration of Adwa history through a modern, responsive UI.
- **Premium Design**: A museum-quality digital experience with smooth animations and rich aesthetics.

## 📂 Project Structure

```text
├── backend/                # Node.js + Express API
│   ├── knowledge/          # RAG Knowledge Base (JSON files)
│   ├── server.js           # Core server logic
│   └── .env                # Backend environment variables
├── frontend/               # React + TypeScript App
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   ├── pages/          # Layout-level components
│   │   ├── context/        # State & Language management
│   │   ├── services/       # API interaction logic
│   │   └── types/          # TypeScript definitions
│   └── .env                # Frontend environment variables
├── docs/                   # Documentation, images, and diagrams
├── examples/               # RAG JSON templates & examples
│   └── rag-format/         # Templates for adding new facts
├── package.json            # Root configuration for orchestration
└── README.md               # You are here!
```

## 🛠️ Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/your-username/adwa-ai.git
   cd adwa-ai
   ```

2. **Install dependencies**:
   Run the following from the root directory:
   ```bash
   npm run install-all
   ```

3. **Environment Setup**:
   Create a `.env` file in the `backend/` directory:
   ```env
   GROQ_API_KEY=your_groq_api_key
   PORT=5000
   ```
    Create a `.env` file in the `frontend/` directory:
    ```env
    VITE_GROQ_API_KEY=your_groq_api_key
    ```

## 🏃 Usage Instructions

### Development Mode
To run both the frontend and backend concurrently from the root:
```bash
npm run dev
```

### Individual Components
- **Start Backend**: `npm run server`
- **Start Frontend**: `npm run start`
- **Build Frontend**: `npm run build`

## 📚 Updating the Knowledge Base

The AI's "brain" is fueled by JSON files in `backend/knowledge/`. To add or update historical data:

1. Locate the relevant file (e.g., `battle.json`, `leaders.json`).
2. Add a new entry following the standard format:
   ```json
   {
     "fact": "Historical fact in English.",
     "category": "History"
   }
   ```
3. The RAG system will automatically incorporate the new data upon server restart.

## 🌐 Deployment

The project is configured for deployment on platforms like Vercel (frontend) and Railway/Render (backend).
- **Frontend URL**: [https://adwa-gamma.vercel.app](https://adwa-gamma.vercel.app)
- **API Reference**: `https://adwa-api.your-platform.com`

---
*Built with ❤️ to celebrate Ethiopia's victory and African pride.*
