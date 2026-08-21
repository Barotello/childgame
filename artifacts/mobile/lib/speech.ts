import { createAudioPlayer, type AudioPlayer } from 'expo-audio';
import * as Speech from 'expo-speech';
import { LOCALE_SPEECH, type Locale } from '@/constants/translations';
import { ANIMAL_AUDIO_REGISTRY } from '@/constants/animalAudio';

let muted = false;
let activeHumanVoicePlayer: AudioPlayer | null = null;

export function setSpeechMuted(value: boolean) {
  muted = value;
  if (value) {
    stopSpeech();
  }
}

export function stopSpeech() {
  if (activeHumanVoicePlayer) {
    try {
      activeHumanVoicePlayer.pause();
      activeHumanVoicePlayer = null;
    } catch {
      // ignore
    }
  }
  try {
    Speech.stop();
  } catch {
    // ignore
  }
}

function playHumanVoice(word: string): boolean {
  const normalized = word.trim().toLowerCase();
  const source = ANIMAL_AUDIO_REGISTRY[normalized];
  if (!source || muted) return false;

  try {
    stopSpeech();
    activeHumanVoicePlayer = createAudioPlayer(source);
    activeHumanVoicePlayer.play();
    return true;
  } catch {
    return false;
  }
}

export function speakText(text: string, locale: Locale = 'en') {
  if (muted || !text.trim()) return;
  try {
    stopSpeech();
    Speech.speak(text, {
      language: LOCALE_SPEECH[locale] || 'en-US',
      rate: 0.78,
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
    const estimatedMs = Math.min(14000, Math.max(2200, text.length * 110));
    const finish = () => {
      if (finished) return;
      finished = true;
      clearTimeout(timeout);
      resolve();
    };
    const timeout = setTimeout(finish, estimatedMs);

    try {
      stopSpeech();
      Speech.speak(text, {
        language: LOCALE_SPEECH[locale] || 'en-US',
        rate: 0.78,
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
  if (muted || !word.trim()) return;

  // 1. If English locale and human audio recording exists, play custom studio voice!
  if (locale === 'en' && playHumanVoice(word)) {
    return;
  }

  // 2. Fallback to system TTS speech
  speakText(word, locale);
}

export function speakWordAndWait(word: string, locale: Locale = 'en'): Promise<void> {
  if (muted || !word.trim()) return Promise.resolve();

  const normalized = word.trim().toLowerCase();
  const source = locale === 'en' ? ANIMAL_AUDIO_REGISTRY[normalized] : null;

  if (source) {
    return new Promise((resolve) => {
      try {
        stopSpeech();
        const player = createAudioPlayer(source);
        activeHumanVoicePlayer = player;

        const sub = player.addListener('playbackStatusUpdate', (status) => {
          if (status.didJustFinish) {
            sub.remove();
            resolve();
          }
        });

        player.play();

        // Safety fallback timer for short sound clips (approx 1s max)
        setTimeout(() => {
          try {
            sub.remove();
          } catch {
            // ignore
          }
          resolve();
        }, 1100);
      } catch {
        speakTextAndWait(word, locale).then(resolve);
      }
    });
  }

  return speakTextAndWait(word, locale);
}
