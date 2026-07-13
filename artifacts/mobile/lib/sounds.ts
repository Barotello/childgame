import { createAudioPlayer, setAudioModeAsync, type AudioPlayer } from 'expo-audio';

/**
 * Shared, preloaded sound effect players for the word game.
 *
 * Players are created once at module load and reused via `seekTo(0)` +
 * `play()` so overlapping triggers (fast successive drops) always restart
 * cleanly instead of queuing.
 */

let correctPlayer: AudioPlayer | null = null;
let wrongPlayer: AudioPlayer | null = null;
let celebratePlayer: AudioPlayer | null = null;
let audioModeReady = false;
let muted = false;

export function setSoundsMuted(value: boolean) {
  muted = value;
}

async function ensureAudioMode() {
  if (audioModeReady) return;
  audioModeReady = true;
  try {
    await setAudioModeAsync({ playsInSilentMode: true });
  } catch {
    // Non-fatal: playback still works without silent-mode override.
  }
}

function getPlayer(kind: 'correct' | 'wrong' | 'celebrate'): AudioPlayer {
  if (kind === 'correct') {
    if (!correctPlayer) {
      correctPlayer = createAudioPlayer(require('../assets/sounds/correct.mp3'));
    }
    return correctPlayer;
  }
  if (kind === 'wrong') {
    if (!wrongPlayer) {
      wrongPlayer = createAudioPlayer(require('../assets/sounds/wrong.mp3'));
    }
    return wrongPlayer;
  }
  if (!celebratePlayer) {
    celebratePlayer = createAudioPlayer(require('../assets/sounds/celebrate.mp3'));
  }
  return celebratePlayer;
}

function playSound(kind: 'correct' | 'wrong' | 'celebrate') {
  if (muted) return;
  ensureAudioMode().finally(() => {
    try {
      const player = getPlayer(kind);
      player.seekTo(0);
      player.play();
    } catch {
      // Ignore playback failures (e.g. web without a user gesture yet).
    }
  });
}

export function playCorrectSound() {
  playSound('correct');
}

export function playWrongSound() {
  playSound('wrong');
}

export function playCelebrateSound() {
  playSound('celebrate');
}
