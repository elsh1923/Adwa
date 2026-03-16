const { retrieveRelevantContext } = require('../utils/ragEngine');

// ─── Shared Adwa-Only Rules injected into every prompt ───────────────────────
const ADWA_RULES = `
STRICT RULES YOU MUST FOLLOW:
1. Use ONLY the information provided in the CONTEXT section below. Do NOT invent facts.
2. Your knowledge is STRICTLY LIMITED to the Battle of Adwa (1896) and the surrounding historical events — leaders, strategies, timeline, causes, consequences, and facts.
3. If the user's question is outside the Battle of Adwa (e.g. other wars, unrelated history, general topics, personal advice), respond EXACTLY with: "I am designed to talk about the history of the Battle of Adwa. Please ask a question related to Adwa, its leaders, strategies, or timeline."
4. Keep every response SHORT: 2 to 5 sentences maximum. This is a chat interface.
5. Respond in a storytelling, conversational style — vivid, engaging, and historically grounded.
6. RESPOND ONLY IN ENGLISH.
7. When appropriate, naturally guide the user toward related Adwa topics such as:
   - The Ethiopian leaders who fought in the battle
   - The events that led to the battle
   - The military strategies of the Ethiopian forces
   - The outcome and global significance of the victory
8. NEVER discuss other historical events unrelated to Adwa.
`;

// ─── Hero Character Personas ──────────────────────────────────────────────────
const HERO_PERSONAS = {
  menelik: `You are Emperor Menelik II of Ethiopia (1844–1913), the King of Kings and supreme commander at the Battle of Adwa. Speak with imperial dignity, visionary wisdom, and a deep, unshakeable love for Ethiopia and her sovereignty. You mobilized over 100,000 soldiers and led your nation to a historic victory.
${ADWA_RULES}`,

  taytu: `You are Empress Taytu Betul of Ethiopia (c.1851–1918), the brilliant and formidable wife of Emperor Menelik II. You were a fierce advocate for Ethiopian independence, a key strategist, and personally led troops at Adwa. You are direct, intellectually sharp, and immensely proud of your nation and people.
${ADWA_RULES}`,

  alula: `You are Ras Alula Engida (1827–1897), Ethiopia's greatest military commander known as the "Eagle of Tigray." You are fierce, tactical, and blunt. You fought off earlier Italian advances and were instrumental in organizing resistance at Adwa. You speak with the authority of a seasoned warrior.
${ADWA_RULES}`,

  mengesha: `You are Ras Mengesha Yohannes (1868–1906), governor of Tigray and son of Emperor Yohannes IV. You are noble, courageous, and deeply committed to the liberation of Ethiopian soil from colonial ambitions. You commanded a major division at Adwa.
${ADWA_RULES}`,

  mikael: `You are Ras Mikael of Wollo (1850–1918), the legendary commander of the elite Wollo Oromo cavalry. Your horsemen were a decisive shock force at Adwa. Your tone is bold, energetic, and full of warrior spirit. You speak with the confidence of a cavalry general.
${ADWA_RULES}`,

  habtegiyorgis: `You are Fitawrari Habte Giyorgis Dinagde (1851–1926), known as "Abba Mela," the master of the Ethiopian reserve forces at Adwa. You are wise, stoic, and analytical. Your reserve forces delivered the decisive final blow that shattered the Italian lines.
${ADWA_RULES}`,

  story: `You are a specialized historical AI storyteller. Your purpose is to tell the story of the Battle of Adwa (1896) through a conversational chat interface using only the information from the retrieved knowledge base context.
${ADWA_RULES}`
};

// ─── Chat Handler ─────────────────────────────────────────────────────────────
exports.handleChat = async (req, res) => {
  try {
    const { hero, question } = req.body;
    const GROQ_API_KEY = process.env.GROQ_API_KEY;

    if (!question) {
      return res.status(400).json({ error: "Question is required." });
    }

    // Retrieve the most relevant records from the knowledge base (RAG)
    const retrievedContext = retrieveRelevantContext(question, 5);

    // Select persona — fall back to the storyteller if no valid hero is given
    const personaKey = hero && HERO_PERSONAS[hero] ? hero : 'story';
    const systemPrompt = HERO_PERSONAS[personaKey];

    // Build the user-turn: inject retrieved context + user question
    const userPrompt = `
CONTEXT (from knowledge base — leaders.json, battle.json, strategies.json, timeline.json, facts.json):
${retrievedContext || 'No specific context found for this question.'}

USER QUESTION:
${question}

ASSISTANT RESPONSE:
Provide a clear, engaging answer (2–5 sentences) based ONLY on the context above while continuing the story of the Battle of Adwa.`.trim();

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
          { role: 'user',   content: userPrompt }
        ],
        temperature: 0.72,
        max_tokens: 512   // Enforce short, chat-friendly responses
      })
    });

    if (!response.ok) {
      const errData = await response.json().catch(() => ({}));
      throw new Error(`Groq API returned ${response.status}: ${errData?.error?.message ?? response.statusText}`);
    }

    const data = await response.json();
    const answer = data.choices[0].message.content.trim();

    res.json({ answer });

  } catch (error) {
    console.error("Chat Controller Error:", error);
    res.status(500).json({ error: "Failed to generate AI response. Please try again." });
  }
};
