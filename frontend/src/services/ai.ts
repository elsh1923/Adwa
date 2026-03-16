// ─── AI Service ──────────────────────────────────────────────────────────────
import { API_BASE } from './apiConfig';
// Uses Groq API (Llama 3.1) for dynamic content: hero chat, story narration,
// quiz explanations, and tactical insights.

const GROQ_API_KEY = import.meta.env.VITE_GROQ_API_KEY || '';
const GROQ_BASE = 'https://api.groq.com/openai/v1/chat/completions';

export type AIRole = 'user' | 'model';

export interface AIMessage {
  role: AIRole;
  parts: { text: string }[];
}

// ─── Core generation helper using Groq ───────────────────────────────────────
async function generateWithGroq(
  systemInstruction: string,
  history: AIMessage[],
  userPrompt: string,
): Promise<string> {
  if (!GROQ_API_KEY) {
    throw new Error('AI Service failed: VITE_GROQ_API_KEY is not configured.');
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

async function generateContent(
  systemInstruction: string,
  history: AIMessage[],
  userPrompt: string,
): Promise<string> {
  try {
    return await generateWithGroq(systemInstruction, history, userPrompt);
  } catch (error) {
    console.error('AI generation failed:', error);
    throw new Error('Our historians are currently busy. Please try again in a moment.');
  }
}

// ─── Hero Character Chat ─────────────────────────────────────────────────────
export interface HeroPersona {
  id: string;
  name: string;
  role: string;
}

// HERO_SYSTEM_PROMPTS removed since the local RAG backend is used directly.

export async function chatWithHero(
  heroId: string,
  _history: AIMessage[],
  userMessage: string
): Promise<string> {
  const url = `${API_BASE}/api/chat`;
  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ hero: heroId, question: userMessage, lang: 'en' })
    });
    
    if (!response.ok) {
      console.error(`Backend error at ${url}:`, response.status, response.statusText);
      throw new Error(`Our backend failed to respond (${response.status}). URL: ${url}`);
    }
    
    const data = await response.json();
    return data.answer;
  } catch (err: any) {
    console.error(`Network or fetch error at ${url}:`, err);
    throw new Error(`Connection failed. Make sure the backend is running at: ${url}`);
  }
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
  correct: string
): Promise<string> {
  const systemPrompt = `You are an AI history tutor teaching about the Battle of Adwa (1896). 
Provide a brief, engaging, accurate explanation of why the answer is correct. 
Respond only in English. Keep response to 2–3 sentences.`;

  return generateContent(
    systemPrompt,
    [],
    `Quiz question: "${question}"\nCorrect answer: "${correct}"\nExplain why this is correct.`,
  );
}

// ─── Strategy Insight ─────────────────────────────────────────────────────────
export async function getStrategyInsight(
  topic: string,
  side: 'ethiopian' | 'italian' | 'geography'
): Promise<string> {
  const systemPrompt = `You are a military historian specializing in African colonial history 
and the Battle of Adwa. Provide a concise, insightful analysis of military strategies. 
Respond only in English. 2–3 sentences only.`;

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
