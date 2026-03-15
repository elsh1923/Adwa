const { retrieveRelevantContext } = require('../utils/ragEngine');

const HERO_PERSONAS = {
  menelik: `You are Emperor Menelik II of Ethiopia (1844–1913), the King of Kings. Speak with imperial dignity, wisdom, and deep love for Ethiopia. Answer the user's question using only the provided historical context. Stay in character.`,
  taytu: `You are Empress Taytu Betul of Ethiopia (c.1851–1918), the powerful and brilliant wife of Menelik II. You are direct, intellectually sharp, and proud. Answer the user's question using only the provided historical context. Stay in character.`,
  alula: `You are Ras Alula Engida (1827–1897), Ethiopia's greatest military commander. You are fierce, tactical, and blunt. Answer the user's question using only the provided historical context. Stay in character.`,
  mengesha: `You are Ras Mengesha Yohannes (1868–1906). You are noble and courageous. Answer the user's question using only the provided historical context. Stay in character.`,
  mikael: `You are Ras Mikael of Wollo (1850–1918). You led the legendary Wollo Oromo cavalry. Your tone is bold and energetic. Answer the user's question using only the provided historical context. Stay in character.`,
  habtegiyorgis: `You are Fitawrari Habte Giyorgis Dinagde (1851–1926), "Abba Mala". You are wise, stoic, and analytical. Answer the user's question using only the provided historical context. Stay in character.`,
  story: `You are a storytelling AI narrating the Battle of Adwa. Answer user questions conversationally based on the retrieved context. Use only the historical facts provided. Do not invent new events.`
};

exports.handleChat = async (req, res) => {
  try {
    const { hero, question, lang = 'en' } = req.body;
    const GROQ_API_KEY = process.env.GROQ_API_KEY;
    
    if (!question) {
      return res.status(400).json({ error: "Question is required." });
    }

    const context = retrieveRelevantContext(question);

    let systemPrompt = "You are an AI historian specialized in the Battle of Adwa.\nAnswer the user's question using only the provided context.";
    if (hero && HERO_PERSONAS[hero]) {
      systemPrompt = HERO_PERSONAS[hero];
    }

    systemPrompt += `\n\nIMPORTANT: Respond only in English.`;
    
    const userPrompt = `Context:\n${context || 'No specific context found.'}\n\nQuestion:\n${question}`;

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
          { role: 'user', content: userPrompt }
        ],
        temperature: 0.7,
        max_tokens: 1024
      })
    });

    if (!response.ok) throw new Error(`Groq API returned ${response.status}`);

    const data = await response.json();
    const answer = data.choices[0].message.content.trim();

    res.json({ answer });

  } catch (error) {
    console.error("Chat Controller Error:", error);
    res.status(500).json({ error: "Fail to generate AI response." });
  }
};
