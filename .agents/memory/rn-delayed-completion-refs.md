---
name: Delayed-completion closures in React Native
description: setTimeout-based "advance to next step" logic after an animation/celebration delay must not rely on render-time closures for state that could change or repeat.
---

When a completion handler schedules a `setTimeout` (e.g. to let a celebration
animation play before advancing to the next item/level), don't compute the
"next" value from variables captured in the closure at the moment the timer
was scheduled. Store the latest relevant state in a ref (updated every
render) and read from the ref inside the timeout callback instead.

**Why:** In a game/quiz-style flow (word game, quiz, level progression), a
completion closure created at drop/answer time can become stale if any
further re-render happens before the timeout fires, or if the same handler
could double-fire (e.g. redundant gesture callbacks). Symptom observed: after
answering a round correctly, the game froze on the same round because the
"next item" was computed from state that was already out of date by the time
the timer fired — the round advanced internally, but the UI didn't reflect
it. Also guard the completion handler with a `useRef` boolean flag reset on
new-round entry, to prevent double execution if the trigger can fire twice.

**How to apply:** Any "answer correct → celebrate → auto-advance after N ms"
flow. Keep a `latestRef` synced every render with the current index/category/
level, and have the timeout callback recompute the "next" target from
`latestRef.current` + the source list, not from values closed over earlier.
