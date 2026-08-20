import * as Speech from 'expo-speech';
import { LOCALE_SPEECH, type Locale } from '@/constants/translations';

let muted = false;

export function setSpeechMuted(value: boolean) {
  muted = value;
}

export function stopSpeech() {
  try {
    Speech.stop();
  } catch {
    // ignore
  }
}

export function speakText(text: string, locale: Locale = 'en') {
  if (muted || !text.trim()) return;
  try {
    Speech.stop();
    Speech.speak(text, {
      language: LOCALE_SPEECH[locale] || 'en-US',
      rate: 0.9,
      pitch: 1,
    });
  } catch {
    // Speech unavailable (e.g. restricted web environments)
  }
}

/** Resolves only after narration ends, with a timeout fallback for web engines. */
export function speakTextAndWait(text: string, locale: Locale = 'en'): Promise<void> {
  if (muted || !text.trim()) return Promise.resolve();

  return new Promise((resolve) => {
    let finished = false;
    const estimatedMs = Math.min(12000, Math.max(1800, text.length * 85));
    const finish = () => {
      if (finished) return;
      finished = true;
      clearTimeout(timeout);
      resolve();
    };
    const timeout = setTimeout(finish, estimatedMs);

    try {
      Speech.stop();
      Speech.speak(text, {
        language: LOCALE_SPEECH[locale] || 'en-US',
        rate: 0.9,
        pitch: 1,
        onDone: finish,
        onStopped: finish,
        onError: finish,
      });
    } catch {
      finish();
    }
  });
}

export function speakLetter(letter: string, locale: Locale = 'en') {
  speakText(letter, locale);
}

export function speakWord(word: string, locale: Locale = 'en') {
  speakText(word, locale);
}

export function speakWordAndWait(word: string, locale: Locale = 'en') {
  return speakTextAndWait(word, locale);
}
