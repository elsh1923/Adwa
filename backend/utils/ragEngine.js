const fs = require('fs');
const path = require('path');

const knowledgeDir = path.join(__dirname, '../knowledge');
let knowledgeData = [];

function loadKnowledgeBase() {
  try {
    if (!fs.existsSync(knowledgeDir)) {
      console.warn("Knowledge directory not found:", knowledgeDir);
      return;
    }
    const files = fs.readdirSync(knowledgeDir);
    knowledgeData = []; // Clear and reload
    for (const file of files) {
      if (file.endsWith('.json')) {
        const filePath = path.join(knowledgeDir, file);
        const fileContent = fs.readFileSync(filePath, 'utf-8');
        const parsedData = JSON.parse(fileContent);
        
        parsedData.forEach(item => {
          knowledgeData.push(JSON.stringify(item));
        });
      }
    }
    console.log(`Knowledge base loaded with ${knowledgeData.length} records.`);
  } catch (error) {
    console.error("Error loading knowledge base:", error);
  }
}

function retrieveRelevantContext(question, topK = 3) {
  const words = question.toLowerCase().split(/\W+/).filter(w => w.length > 2);
  
  const scoredData = knowledgeData.map(record => {
    let score = 0;
    const recordLower = record.toLowerCase();
    
    words.forEach(word => {
      if (recordLower.includes(word)) {
        score += 1;
      }
    });
    
    return { record, score };
  });
  
  scoredData.sort((a, b) => b.score - a.score);
  
  const relevantRecords = scoredData
    .filter(item => item.score > 0)
    .slice(0, topK)
    .map(item => item.record);
    
  return relevantRecords.join('\n\n');
}

module.exports = {
  loadKnowledgeBase,
  retrieveRelevantContext,
  getKnowledgeData: () => knowledgeData,
  knowledgeDir
};
