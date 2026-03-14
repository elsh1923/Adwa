// ─── Gemini AI Service ──────────────────────────────────────────────────────
// Uses Google Gemini API for dynamic content: hero chat, story narration,
// quiz explanations, and translation of AI-generated text.

const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY || '';
const GEMINI_BASE = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent';

export type GeminiRole = 'user' | 'model';

export interface GeminiMessage {
  role: GeminiRole;
  parts: { text: string }[];
}

// ─── Core generation helper ─────────────────────────────────────────────────
async function generateContent(
  systemInstruction: string,
  history: GeminiMessage[],
  userPrompt: string,
): Promise<string> {
  if (!GEMINI_API_KEY) {
    throw new Error('VITE_GEMINI_API_KEY is not set. Please add it to your .env file.');
  }

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
    safetySettings: [
      { category: 'HARM_CATEGORY_HARASSMENT',        threshold: 'BLOCK_MEDIUM_AND_ABOVE' },
      { category: 'HARM_CATEGORY_HATE_SPEECH',       threshold: 'BLOCK_MEDIUM_AND_ABOVE' },
      { category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT', threshold: 'BLOCK_MEDIUM_AND_ABOVE' },
      { category: 'HARM_CATEGORY_DANGEROUS_CONTENT', threshold: 'BLOCK_MEDIUM_AND_ABOVE' },
    ],
  };

  const response = await fetch(`${GEMINI_BASE}?key=${GEMINI_API_KEY}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    throw new Error(`Gemini API error ${response.status}: ${err?.error?.message ?? response.statusText}`);
  }

  const data = await response.json();
  const text: string = data?.candidates?.[0]?.content?.parts?.[0]?.text ?? '';
  return text.trim();
}

// ─── Hero Character Chat ─────────────────────────────────────────────────────
export interface HeroPersona {
  id: string;
  name: string;
  role: string;
}

const HERO_SYSTEM_PROMPTS: Record<string, string> = {
  menelik: `You are Emperor Menelik II of Ethiopia (1844–1913), the King of Kings who led his country to 
victory at the Battle of Adwa on March 1, 1896. You speak with imperial dignity, wisdom, and deep love 
for Ethiopia. You unify diverse peoples. You are strategic, forward-thinking, and deeply spiritual. 
Respond in the same language the user uses (English or Amharic). Keep replies concise (2–4 paragraphs). 
Always stay in character. Speak in first person as Menelik. Reference actual historical events.`,

  taytu: `You are Empress Taytu Betul of Ethiopia (c.1851–1918), the powerful, brilliant, and fiercely 
independent wife of Emperor Menelik II. You were the real strategic architect of the defense of Ethiopia 
against Italian colonialism. You led the siege of Mekelle and cut off Italian water supplies. You are 
direct, intellectually sharp, proud, and diplomatic. Respond in the same language the user uses 
(English or Amharic). Keep replies concise (2–4 paragraphs). Always stay in character as Empress Taytu.`,

  alula: `You are Ras Alula Engida (1827–1897), Ethiopia's greatest military commander, known as "the 
Eagle of Ethiopia" and "the Lion of the North." You were the field strategist at the Battle of Adwa and 
numerous earlier victories against Egypt and Italy. You are fierce, tactical, loyal to Ethiopia, and 
blunt. Respond in the same language the user uses (English or Amharic). Keep replies concise 
(2–4 paragraphs). Always stay in character as Ras Alula.`,
};

export async function chatWithHero(
  heroId: string,
  history: GeminiMessage[],
  userMessage: string,
  lang: 'en' | 'am',
): Promise<string> {
  const persona = HERO_SYSTEM_PROMPTS[heroId];
  if (!persona) throw new Error(`Unknown hero: ${heroId}`);

  const langNote = lang === 'am'
    ? '\n\nIMPORTANT: The user is speaking Amharic. Respond ENTIRELY in Amharic (Ethiopic script).'
    : '';

  return generateContent(persona + langNote, history, userMessage);
}

// ─── Story Narration ─────────────────────────────────────────────────────────
export async function narrateStoryScene(
  sceneTitle: string,
  sceneContent: string,
  userQuestion: string,
  lang: 'en' | 'am',
): Promise<string> {
  const systemPrompt = `You are an expert historian and immersive storyteller specializing in 
Ethiopian history, specifically the Battle of Adwa (1896). You provide vivid, engaging, 
historically accurate responses that bring the era to life. Respond in ${lang === 'am' ? 'Amharic (Ethiopic script)' : 'English'}.
Keep responses to 2–3 paragraphs.`;

  const context = `Current story chapter: "${sceneTitle}"\n\nChapter content: ${sceneContent}`;
  return generateContent(systemPrompt, [], `${context}\n\nUser asks: ${userQuestion}`);
}

// ─── Quiz Explanation ─────────────────────────────────────────────────────────
export async function explainQuizAnswer(
  question: string,
  correct: string,
  lang: 'en' | 'am',
): Promise<string> {
  const systemPrompt = `You are an AI history tutor teaching about the Battle of Adwa (1896). 
Provide a brief, engaging, accurate explanation of why the answer is correct. 
Respond in ${lang === 'am' ? 'Amharic (Ethiopic script)' : 'English'}. 
Keep response to 2–3 sentences.`;

  return generateContent(
    systemPrompt,
    [],
    `Quiz question: "${question}"\nCorrect answer: "${correct}"\nExplain why this is correct.`,
  );
}

// ─── Dynamic Translation ──────────────────────────────────────────────────────
// Used to translate AI-generated responses that come back in English
// when user is in Amharic mode, or vice versa.
export async function translateText(text: string, targetLang: 'en' | 'am'): Promise<string> {
  const langName = targetLang === 'am' ? 'Amharic (using Ethiopic script ፊደላት)' : 'English';
  const systemPrompt = `You are a professional translator specializing in English and Amharic 
with deep knowledge of Ethiopian history and culture. Translate naturally and accurately. 
Output only the translated text, nothing else.`;

  return generateContent(
    systemPrompt,
    [],
    `Translate the following text to ${langName}:\n\n${text}`,
  );
}

// ─── Strategy Insight ─────────────────────────────────────────────────────────
export async function getStrategyInsight(
  topic: string,
  side: 'ethiopian' | 'italian' | 'geography',
  lang: 'en' | 'am',
): Promise<string> {
  const systemPrompt = `You are a military historian specializing in African colonial history 
and the Battle of Adwa. Provide a concise, insightful analysis of military strategies. 
Respond in ${lang === 'am' ? 'Amharic (Ethiopic script)' : 'English'}. 2–3 sentences only.`;

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
  translateText,
  getStrategyInsight,
};
