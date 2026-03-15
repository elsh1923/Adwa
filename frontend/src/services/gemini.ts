// ─── Gemini AI Service ──────────────────────────────────────────────────────
// Uses Google Gemini API for dynamic content: hero chat, story narration,
// quiz explanations, and translation of AI-generated text.

const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY || '';
const GROQ_API_KEY = import.meta.env.VITE_GROQ_API_KEY || '';
const GEMINI_BASE = 'https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent';
const GROQ_BASE = 'https://api.groq.com/openai/v1/chat/completions';

export type GeminiRole = 'user' | 'model';

export interface GeminiMessage {
  role: GeminiRole;
  parts: { text: string }[];
}

// ─── Groq Fallback Helper ────────────────────────────────────────────────────
async function generateWithGroq(
  systemInstruction: string,
  history: GeminiMessage[],
  userPrompt: string,
): Promise<string> {
  if (!GROQ_API_KEY || GROQ_API_KEY === 'your_groq_key_here') {
    throw new Error('Groq fallback failed: VITE_GROQ_API_KEY is not configured.');
  }

  const messages = [
    { role: 'system', content: systemInstruction },
    ...history.map(m => ({
      role: m.role === 'model' ? 'assistant' : 'user',
      content: m.parts[0].text
    })),
    { role: 'user', content: userPrompt }
  ];

  const response = await fetch(GROQ_BASE, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${GROQ_API_KEY}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      messages,
      model: 'llama-3.1-8b-instant',
      temperature: 0.8,
      max_tokens: 1024,
    }),
  });

  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    throw new Error(`Groq API error ${response.status}: ${err?.error?.message ?? response.statusText}`);
  }

  const data = await response.json();
  return data.choices?.[0]?.message?.content?.trim() ?? '';
}

// ─── Core generation helper with Smart Fallback ───────────────────────────────
async function generateContent(
  systemInstruction: string,
  history: GeminiMessage[],
  userPrompt: string,
): Promise<string> {
  // 1. Try Gemini first
  try {
    if (!GEMINI_API_KEY) throw new Error('Gemini API key missing');

    const body = {
      system_instruction: { parts: [{ text: systemInstruction }] },
      contents: [
        ...history,
        { role: 'user', parts: [{ text: userPrompt }] },
      ],
      generationConfig: {
        temperature: 0.8,
        topK: 40,
        topP: 0.95,
        maxOutputTokens: 1024,
      },
    };

    const response = await fetch(`${GEMINI_BASE}?key=${GEMINI_API_KEY}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });

    if (response.ok) {
      const data = await response.json();
      return data?.candidates?.[0]?.content?.parts?.[0]?.text?.trim() ?? '';
    }

    // If we get here, Gemini returned an error (like 429)
    console.warn(`Gemini failed with status ${response.status}. Attempting Groq fallback...`);
  } catch (error) {
    console.warn('Gemini error. Attempting Groq fallback...', error);
  }

  // 2. Fallback to Groq if Gemini fails or keys are missing
  try {
    return await generateWithGroq(systemInstruction, history, userPrompt);
  } catch (fallbackError) {
    console.error('All AI models failed:', fallbackError);
    throw new Error('Our historians are currently busy. Please try again in a moment.');
  }
}

// ─── Hero Character Chat ─────────────────────────────────────────────────────
export interface HeroPersona {
  id: string;
  name: string;
  role: string;
}

const HERO_SYSTEM_PROMPTS: Record<string, string> = {
  menelik: `You are Emperor Menelik II of Ethiopia (1844–1913), the King of Kings. 
Speak with imperial dignity, wisdom, and deep love for Ethiopia. 
DO NOT start with a salutation like "Salutation to..." or your name. 
DO NOT introduce yourself as "I am Menelik" unless asked. 
Jump directly into the conversation naturally. Respond in the same language the user uses. 
Keep replies concise (2–3 paragraphs). Stay in character.`,

  taytu: `You are Empress Taytu Betul of Ethiopia (c.1851–1918), the powerful and brilliant wife of Menelik II. 
You are direct, intellectually sharp, and proud. 
DO NOT start with any formal salutations, titles, or your name (e.g. avoid "ታዩት ብጥሩ..."). 
DO NOT introduce yourself unless asked. Jump directly into a smooth, natural conversation. 
Respond in the same language the user uses. Keep replies concise (2–3 paragraphs).`,

  alula: `You are Ras Alula Engida (1827–1897), Ethiopia's greatest military commander. 
You are fierce, tactical, and blunt. 
DO NOT start with a salutation or your name. DO NOT introduce yourself. 
Jump directly into the tactical or historical conversation. 
Respond in the same language the user uses. Keep replies concise.`,

  mengesha: `You are Ras Mengesha Yohannes (1868–1906). You are noble and courageous. 
DO NOT start with formal salutations or your name. 
Jump directly into the dialogue naturally. Respond in the same language the user uses. 
Keep replies concise.`,

  mikael: `You are Ras Mikael of Wollo (1850–1918). You led the legendary Wollo Oromo cavalry. 
Your tone is bold and energetic. 
DO NOT start with a salutation or your name. 
Jump directly into the conversation with warrior pride. 
Respond in same language as user. Keep replies concise.`,

  habtegiyorgis: `You are Fitawrari Habte Giyorgis Dinagde (1851–1926), "Abba Mala". 
You are wise, stoic, and analytical. 
DO NOT start with a salutation, your title, or your name. 
Jump directly into providing wisdom or strategy. 
Respond in same language as user. Keep replies concise.`,
};

export async function chatWithHero(
  heroId: string,
  history: GeminiMessage[],
  userMessage: string,
): Promise<string> {
  const persona = HERO_SYSTEM_PROMPTS[heroId];
  if (!persona) throw new Error(`Unknown hero: ${heroId}`);

  return generateContent(persona, history, userMessage);
}

// ─── Story Narration ─────────────────────────────────────────────────────────
export async function narrateStoryScene(
  sceneTitle: string,
  sceneContent: string,
  userQuestion: string,
): Promise<string> {
  const systemPrompt = `You are an expert historian and immersive storyteller specializing in 
Ethiopian history, specifically the Battle of Adwa (1896). You provide vivid, engaging, 
historically accurate responses that bring the era to life. Respond in English.
Keep responses to 2–3 paragraphs.`;

  const context = `Current story chapter: "${sceneTitle}"\n\nChapter content: ${sceneContent}`;
  return generateContent(systemPrompt, [], `${context}\n\nUser asks: ${userQuestion}`);
}

// ─── Quiz Explanation ─────────────────────────────────────────────────────────
export async function explainQuizAnswer(
  question: string,
  correct: string,
): Promise<string> {
  const systemPrompt = `You are an AI history tutor teaching about the Battle of Adwa (1896). 
Provide a brief, engaging, accurate explanation of why the answer is correct. 
Respond in English. Keep response to 2–3 sentences.`;

  return generateContent(
    systemPrompt,
    [],
    `Quiz question: "${question}"\nCorrect answer: "${correct}"\nExplain why this is correct.`,
  );
}



// ─── Strategy Insight ─────────────────────────────────────────────────────────
export async function getStrategyInsight(
  topic: string,
  side: 'ethiopian' | 'italian' | 'geography',
): Promise<string> {
  const systemPrompt = `You are a military historian specializing in African colonial history 
and the Battle of Adwa. Provide a concise, insightful analysis of military strategies. 
Respond in English. 2–3 sentences only.`;

  return generateContent(
    systemPrompt,
    [],
    `Provide a key insight about "${topic}" from the ${side} perspective at the Battle of Adwa.`,
  );
}

export default {
  chatWithHero,
  narrateStoryScene,
  explainQuizAnswer,
  getStrategyInsight,
};
