const express = require('express');
const router = express.Router();

const chatController = require('../controllers/chatController');
const quizController = require('../controllers/quizController');
const knowledgeController = require('../controllers/knowledgeController');

// Chat routes
router.post('/chat', chatController.handleChat);

// Quiz routes
router.get('/quiz', quizController.generateQuiz);

// Knowledge browser routes
router.get('/knowledge/:file', knowledgeController.getKnowledgeFile);

module.exports = router;
