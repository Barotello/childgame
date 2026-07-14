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

export function speakText(text: string, locale: Locale) {
  if (muted || !text.trim()) return;
  try {
    Speech.stop();
    Speech.speak(text, {
      language: LOCALE_SPEECH[locale],
      rate: 0.85,
      pitch: 1.05,
    });
  } catch {
    // Speech unavailable (e.g. restricted web environments)
  }
}

export function speakLetter(letter: string, locale: Locale) {
  speakText(letter, locale);
}

export function speakWord(word: string, locale: Locale) {
  speakText(word, locale);
}
