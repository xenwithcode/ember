# Ember — Judges Demo Script

Spoken presentation script, adapted from the product narrative and synchronized
with the on-screen demo (`Try a Scenario → Stuck in the Scroll`, then
`EmberJourney` reveal). Each line maps to a screen so the demo and the talk
advance together.

## Demo run: Scenario → "Stuck in the Scroll" (📱)

| Screen | What you say |
|---|---|
| **Journal** | "Three hours deep in the scroll. The feed feels endless — everything on it outshines his own life. But instead of staying trapped, he opens Ember and writes what he actually feels." |
| **Privacy Shield** | "But here's what makes Ember's architecture truly unique. When a young person writes something intimate, it doesn't go straight to the cloud. First, it passes through our Privacy Layer — powered by Gemma 4. In seconds, Gemma anonymizes names and locations — 'Jake at Lincoln High' becomes '[PERSON] at [SCHOOL]' — and runs a critical safety check for self-harm indicators." |
| **Thinking** | "Only the anonymized text reaches Gemini 3.5 for the deep emotional coaching. And if Gemma detects crisis keywords, it immediately triggers our safety protocol with the 988 lifeline." |
| **Coach / agent** | "No lecture, no advice dump. The coach names the loop and offers the fastest exit: change your physical space." |
| **Disconnect Mode** | "And when the user feels trapped — stuck in the scroll, stuck in their thoughts — there's the red button. Disconnect Mode. One tap. Gemma 4 analyzes the pattern and generates a persuasive insight in under a second." |
| **Nearby places** | "Then Ember surfaces two real places near them right now — a park, a library, a café — each with a micro-challenge they can complete. Distance, walk time, exactly what to do when they get there." |
| **Medal claimed** | "They pick one. Accept the mission. Go outside. And when they come back, they claim their medal. This is what 'agent doing things' looks like. Not advice. Action. Geolocated, personalized, real." |
| **Triumph Board + medals** | "Two weeks later, the Triumph Board. Every small step counted — and the medals are already here, reminding them what getting out feels like." |

## Why Gemma 4 (say while the Privacy Shield screen is up)

"We chose Gemma 4 — Google's open-weight model family — for the Privacy
Layer. It's efficient, with 4 billion active parameters, and because its
weights are open, the anonymization it performs is auditable by security
researchers. Privacy you can verify, not just promise. Maximum empathy.
Zero raw data exposure."

## Backup: Activity journey (if audience asks for a second demo)

Use "Real-world Activity" track (🎨). Lines:

- Activity card: "Insight is only half of it — Ember finds something concrete, matched to their comfort level."
- Map: "Here it is on the map. Verified, close by."
- Register: "One tap: spot reserved, calendar invite, reminder, and an invitation drafted for a friend."
- Attend: "When the day arrives, they just show up. No logistics, no friction. That's the whole point."

## Speaker notes

- Before the demo, run `npm run dev` and do a hard refresh (Ctrl+Shift+R); open
  "Try a Scenario" once to warm the MP3s (they're local — no network needed live).
- Audio narration plays automatically per step (pre-generated Edge TTS voice,
  stored in `frontend/public/narration/`). Use the 🎙️ toggle to mute if the
  room audio is bad.
- The red button only appears in the scroll scenario — that's Disconnect Mode,
  the feature judges should remember.