# Mino narration recordings

Add final voice recordings under one folder per locale:

```text
assets/narration/tr/onboarding-01.mp3
assets/narration/tr/onboarding-02.mp3
assets/narration/tr/onboarding-03.mp3
assets/narration/tr/tutorial-spell.mp3
assets/narration/en/onboarding-01.mp3
...
```

Recording standard:

- MP3, 44.1 kHz, mono, 128-192 kbps
- One sentence or instruction per file
- No music or sound effects mixed into narration
- Consistent speaker, microphone distance, and loudness across a locale
- Leave about 100 ms of clean room tone at both ends
- Target approximately -16 LUFS and avoid clipping

React Native assets require static `require()` calls. Once recordings are
available, register them in a typed narration manifest and keep device TTS as
the fallback for missing languages or clips.
