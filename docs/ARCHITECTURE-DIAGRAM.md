# Architecture Diagrams

## 🆕 Hybrid Architecture: Gemma + Gemini

Ember uses a **dual-layer AI architecture** that prioritizes user privacy:

### Layer 1: Privacy Shield (Gemma 4)

Before any user text reaches the main agent, it passes through a privacy layer powered by **Gemma 4** running on Vertex AI Model Garden:

1. **PII Anonymization**: Replaces names, schools, locations with generic tags
2. **Crisis Detection**: Identifies self-harm indicators, confirms with Gemma, triggers 988 lifeline
3. **Mood Analysis**: Quick emotional classification for UI feedback

**Why Gemma 4?**
- Efficient — 4B active parameters (26B A4B architecture)
- Fast inference for safety-critical operations
- Cost-effective for high-volume preprocessing
- Open weights — auditable privacy layer

### Layer 2: Deep Coaching (Gemini 3.5 Flash Lite)

Only after anonymization does the text reach the main ADK-powered agent for:
- Deep emotional reasoning
- Activity suggestions with geolocation
- Calendar scheduling and friend invitations
- Long-term pattern analysis

### The Flow

```
User's intimate text
↓
[🛡️ Gemma 4 - Privacy Layer]
• Anonymizes PII (names, locations)
• Checks for crisis (with Gemma confirmation)
• Analyzes mood (instant UI feedback)
↓
[Anonymized, safe text]
↓
[🤖 Gemini 3.5 Flash Lite - Agent Layer]
• Deep empathetic response
• Suggests real-world activities
• Updates Identity Graph
↓
[Response + Privacy Info]
↓
User sees: "🔒 Privacy Shield Active — 3 personal details protected"
```

This architecture ensures **maximum empathy with zero risk of data exposure**.

---

## 🧠 Memory Bank: Persistent Cross-Session Memory

Every journal entry is persisted to **Firestore** and the coach always sees the
user's history before responding:

```
User's intimate text
↓
[🛡️ Gemma 4 - Privacy Layer]
↓
Anonymized, safe text
↓
[🧠 Memory Bank (Firestore)]
streak · total entries · week vs week · emotional trend · recent excerpts
↓
[🤖 Gemini 3.5 Flash Lite - Agent Layer]
Responds WITH the user's history in context
↓
[Entry persisted (anonymized) + response]
↓
Frontend caches in localStorage (offline only — Firestore is the source of truth)
```

- **Live conversation**: `InMemorySessionService` keeps multi-turn context while
  the Cloud Run process lives (stable `session_id` per user).
- **Long-term memory**: `journal_service.build_memory_block()` injects the
  user's real history into every journal response, so Ember can truthfully say
  *"This is your 4th entry this week"* or *"Your emotional trend is improving"*.
- **Endpoints**: `POST /api/chat/journal` (full flow) · `POST/GET/DELETE
  /api/journal/entries` · `GET /api/journal/stats` · `GET /api/journal/memory`

---

## Diagram Sources

| Diagram | Source | Description |
|---------|--------|-------------|
| **Interactive Live Diagram** | [`architecture.html`](file:///home/xavier/AI-PROJECTS/ember/architecture.html) / `docs/architecture.html` | **Interactive web visualizer** with live flows (Journal, Privacy, Geo, Memory), dark/light mode toggle (<kbd>T</kbd>), node inspector, and high-DPI PNG export. [Open Live on GitHub Pages](https://xenwithcode.github.io/ember/architecture.html) |
| System overview (with Memory Bank) | `docs/architecture.mermaid` | Frontend → Cloud Run → Privacy Shield → Memory Bank → Coach → Firestore |
| Hybrid (Gemma + Gemini) | `docs/architecture-hybrid.mermaid` | Dual-layer architecture with Privacy Shield |

**Mmdc export example:**

```bash
npx @mermaid-js/mermaid-cli -i docs/architecture.mermaid -o docs/architecture.png
```