const { getKnowledgeData } = require('../utils/ragEngine');

exports.generateQuiz = async (req, res) => {
  try {
    const GROQ_API_KEY = process.env.GROQ_API_KEY;
    const knowledgeData = getKnowledgeData();

    const contextLines = [...knowledgeData]
      .sort(() => 0.5 - Math.random())
      .slice(0, 8)
      .map(line => {
        try {
          const obj = JSON.parse(line);
          return JSON.stringify({ en: obj.fact || obj.description || obj.event || obj.name || "", am: obj.am || "" });
        } catch { return line; }
      })
      .join('\n');
    
    const systemPrompt = `You are an AI history tutor specialized in the Battle of Adwa.
Generate a valid JSON object containing a "questions" array of 5 multiple-choice questions.
Each question must have: "q_en", "q_am", "options_en" (4 strings), "options_am" (4 strings), "correct" (0-3), "explanation_en", and "explanation_am".
Use Ge'ez script for Amharic.`;

    // --- AI Generation Attempt ---
    try {
      const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${GROQ_API_KEY}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          model: 'llama-3.1-8b-instant',
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: `Context:\n${contextLines}\n\nGenerate the JSON quiz object.` }
          ],
          temperature: 0.5,
          max_tokens: 2000,
          response_format: { type: "json_object" }
        })
      });

      if (!response.ok) throw new Error(`AI Service Error: ${response.status}`);

      const data = await response.json();
      const answerText = data.choices?.[0]?.message?.content?.trim();
      if (!answerText) throw new Error("Empty response from AI");
      
      const fullObj = JSON.parse(answerText);
      const parsed = fullObj.questions || (Array.isArray(fullObj) ? fullObj : null);

      if (parsed && Array.isArray(parsed)) {
        const cleaned = parsed.slice(0, 5).map(q => ({
          q_en: q.q_en || "Question?",
          q_am: q.q_am || q.q_en || "ጥያቄ?",
          options_en: Array.isArray(q.options_en) ? q.options_en : ["O1", "O2", "O3", "O4"],
          options_am: Array.isArray(q.options_am) ? q.options_am : ["ሀ", "ለ", "ሐ", "መ"],
          correct: typeof q.correct === 'number' ? q.correct : 0,
          explanation_en: q.explanation_en || "",
          explanation_am: q.explanation_am || q.explanation_en || ""
        }));
        return res.json(cleaned);
      }
    } catch (aiError) {
      console.warn("AI Quiz Generation failed, using static fallback:", aiError.message);
    }

    // --- Static Fallback ---
    // If AI fails or returns invalid data, generate a simple quiz from knowledge base
    const fallbackQuiz = [...knowledgeData]
      .sort(() => 0.5 - Math.random())
      .slice(0, 5)
      .map((line, index) => {
        try {
          const obj = JSON.parse(line);
          const factEn = obj.fact || obj.description || obj.event || "The Battle of Adwa was a significant victory.";
          const factAm = obj.am || factEn;
          
          return {
            q_en: `Regarding the history of Adwa: ${factEn.slice(0, 100)}... Is this related to ${obj.category || 'the battle'}?`,
            q_am: `ስለ ዓድዋ ታሪክ፡ ${factAm.slice(0, 100)}... ይህ ከ${obj.category || 'ጦርነቱ'} ጋር የተያያዘ ነው?`,
            options_en: ["True", "False", "Not mentioned", "Irrelevant"],
            options_am: ["እውነት", "ሐሰት", "አልተጠቀሰም", "አግባብነት የለውም"],
            correct: 0,
            explanation_en: "This information is verified in the Adwa historical records.",
            explanation_am: "ይህ መረጃ በዓድዋ ታሪካዊ መዝገቦች ውስጥ የተረጋገጠ ነው።"
          };
        } catch {
          return null;
        }
      }).filter(Boolean);

    if (fallbackQuiz.length > 0) {
      return res.json(fallbackQuiz);
    }

    throw new Error("Failed to generate both AI and fallback quiz.");

  } catch (error) {
    console.error("Quiz Controller Error:", error);
    res.status(500).json({ error: "Failed to generate quiz." });
  }
};
