import { useState, useEffect, useCallback } from 'react';

/**
 * Custom hook to handle Text-to-Speech narration for English and Amharic.
 * Uses the browser's native SpeechSynthesis API with enhanced selection logic.
 */
export const useSpeech = () => {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);

  useEffect(() => {
    const updateVoices = () => {
      const availableVoices = window.speechSynthesis.getVoices();
      setVoices(availableVoices);
    };

    window.speechSynthesis.onvoiceschanged = updateVoices;
    updateVoices();

    return () => {
      window.speechSynthesis.onvoiceschanged = null;
    };
  }, []);

  const speak = useCallback((text: string, lang: 'en' | 'am', requestedGender: 'male' | 'female' = 'male') => {
    window.speechSynthesis.cancel();

    if (!text) return;

    const cleanText = text.replace(/[*#]/g, '');
    const utterance = new SpeechSynthesisUtterance(cleanText);
    
    // Set language tags - support wider range of Amharic tags
    utterance.lang = lang === 'am' ? 'am-ET' : 'en-US';

    // Advanced Voice Selection:
    const availableLocaleVoices = voices.filter(v => {
      const vLang = v.lang.toLowerCase();
      if (lang === 'am') {
        return vLang.startsWith('am') || vLang.includes('eth');
      }
      return vLang.startsWith('en');
    });

    if (availableLocaleVoices.length > 0) {
      // 1. First priority: High quality voices that match the gender
      let selectedVoice = availableLocaleVoices.find(v => 
        (v.name.toLowerCase().includes('natural') || v.name.toLowerCase().includes('google')) &&
        (v.name.toLowerCase().includes(requestedGender) || 
         (requestedGender === 'male' && (v.name.includes('David') || v.name.includes('Mark'))) ||
         (requestedGender === 'female' && (v.name.includes('Zira') || v.name.includes('Sara'))))
      );

      // 2. Second priority: Any voice that matches the gender
      if (!selectedVoice) {
        selectedVoice = availableLocaleVoices.find(v => 
          v.name.toLowerCase().includes(requestedGender) ||
          (requestedGender === 'male' && (v.name.includes('David') || v.name.includes('Mark'))) ||
          (requestedGender === 'female' && (v.name.includes('Zira') || v.name.includes('Sara')))
        );
      }

      // 3. Third priority: High quality voices (any gender)
      if (!selectedVoice) {
        selectedVoice = availableLocaleVoices.find(v => 
          v.name.toLowerCase().includes('natural') || 
          v.name.toLowerCase().includes('google')
        );
      }

      utterance.voice = selectedVoice || availableLocaleVoices[0];
    }

    utterance.rate = 0.82; // Deliberate narrator pace
    utterance.pitch = requestedGender === 'male' ? 0.95 : 1.05;
    utterance.volume = 1.0;

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
