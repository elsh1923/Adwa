const fs = require('fs');
const path = require('path');
const { knowledgeDir } = require('../utils/ragEngine');

exports.getKnowledgeFile = (req, res) => {
  try {
    const filename = req.params.file.includes('.json') ? req.params.file : req.params.file + '.json';
    const filePath = path.join(knowledgeDir, filename);
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ error: "Knowledge block not found." });
    }
    const content = fs.readFileSync(filePath, 'utf-8');
    res.json(JSON.parse(content));
  } catch (error) {
    res.status(500).json({ error: "Failed to read knowledge file." });
  }
};
