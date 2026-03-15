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

  const speak = useCallback((
    text: string, 
    lang: 'en' | 'am', 
    profile: 'elderly-male' | 'elderly-female' | 'warrior' | 'strategic' | 'male' | 'female' = 'male'
  ) => {
    window.speechSynthesis.cancel();

    if (!text) return;

    const cleanText = text.replace(/[*#]/g, '');
    const utterance = new SpeechSynthesisUtterance(cleanText);
    
    // Set language tags
    utterance.lang = lang === 'am' ? 'am-ET' : 'en-US';

    // Map profiles to low-level parameters
    const isMale = (profile.includes('male') && !profile.includes('female')) || 
                   profile === 'warrior' || 
                   profile === 'strategic';

    // Advanced Voice Selection:
    const availableLocaleVoices = voices.filter(v => {
      const vLang = v.lang.toLowerCase();
      if (lang === 'am') return vLang.startsWith('am') || vLang.includes('eth');
      return vLang.startsWith('en');
    });

    if (availableLocaleVoices.length > 0) {
      const genderKey = isMale ? 'male' : 'female';
      
      // Filter voices by gender
      const genderMatchingVoices = availableLocaleVoices.filter(v => 
        v.name.toLowerCase().includes(genderKey) || 
        (genderKey === 'male' && (v.name.includes('David') || v.name.includes('Mark') || v.name.includes('George'))) ||
        (genderKey === 'female' && (v.name.includes('Zira') || v.name.includes('Sara') || v.name.includes('Hazel')))
      );

      // Try to pick a UNIQUE voice for different profiles if multiple exist
      let selectedVoice: SpeechSynthesisVoice | undefined;
      if (genderMatchingVoices.length > 1) {
        const offset = profile === 'elderly-male' ? 0 : (profile === 'warrior' ? 1 : 2);
        selectedVoice = genderMatchingVoices[offset % genderMatchingVoices.length];
      } else {
        selectedVoice = genderMatchingVoices[0];
      }

      utterance.voice = selectedVoice || availableLocaleVoices[0];
    }

    // High-Contrast Audio Tweaks
    if (profile === 'elderly-male') {
      utterance.pitch = 0.55; // Very deep, old King
      utterance.rate = 0.68;  // Very slow and wise
    } else if (profile === 'elderly-female') {
      utterance.pitch = 0.90; // Mature, maternal (clearly female)
      utterance.rate = 0.75;  // Deliberate
    } else if (profile === 'warrior') {
      utterance.pitch = 1.30; // High, urgent battle voice
      utterance.rate = 1.05;  // Faster, energetic
    } else if (profile === 'strategic') {
      utterance.pitch = 0.88; // Deep but precise
      utterance.rate = 0.85;  // Steady
    } else {
      utterance.pitch = isMale ? 0.90 : 1.10;
      utterance.rate = 0.82;
    }

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
