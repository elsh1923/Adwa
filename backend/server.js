const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const { loadKnowledgeBase } = require('./utils/ragEngine');
const apiRoutes = require('./routes/api');

// Initialize Environment
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Initialize RAG Engine
loadKnowledgeBase();

// Use Routes
app.use('/api', apiRoutes);

// Root Endpoint
app.get('/', (req, res) => {
  res.json({ 
    message: "Adwa AI API is running.", 
    status: "Bilingual RAG Engine Active" 
  });
});

// Start Server
// Export the app for Vercel Serverless Functions
module.exports = app;

// Start Server locally if not running as a serverless function
if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`===========================================`);
    console.log(`🚀 ADWA AI BACKEND RUNNING ON PORT: ${PORT}`);
    console.log(`🌐 API ENDPOINT: http://localhost:${PORT}/api`);
    console.log(`===========================================`);
  });
}
