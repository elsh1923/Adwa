import { useState, useEffect, useCallback } from 'react';

/**
 * Custom hook to handle Text-to-Speech narration for English and Amharic.
 * Uses the browser's native SpeechSynthesis API.
 */
export const useSpeech = () => {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);

  useEffect(() => {
    const updateVoices = () => {
      setVoices(window.speechSynthesis.getVoices());
    };

    window.speechSynthesis.onvoiceschanged = updateVoices;
    updateVoices();

    return () => {
      window.speechSynthesis.onvoiceschanged = null;
    };
  }, []);

  const speak = useCallback((text: string, lang: 'en' | 'am') => {
    // Stop any current speech
    window.speechSynthesis.cancel();

    if (!text) return;

    const utterance = new SpeechSynthesisUtterance(text);
    
    // Set language
    utterance.lang = lang === 'am' ? 'am-ET' : 'en-US';

    // Try to find a specific voice for the language
    const preferredVoice = voices.find(v => 
      v.lang.startsWith(lang === 'am' ? 'am' : 'en')
    );
    
    if (preferredVoice) {
      utterance.voice = preferredVoice;
    }

    utterance.rate = 0.9; // Slightly slower for better historical atmosphere
    utterance.pitch = 1.0;

    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    window.speechSynthesis.speak(utterance);
  }, [voices]);

  const stop = useCallback(() => {
    window.speechSynthesis.cancel();
    setIsSpeaking(false);
  }, []);

  return { speak, stop, isSpeaking, voicesSupported: voices.length > 0 };
};
