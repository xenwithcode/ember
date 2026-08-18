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

## Diagram Sources

| Diagram | Source | Description |
|---------|--------|-------------|
| Hybrid (Gemma + Gemini) | `docs/architecture-hybrid.mermaid` | Updated dual-layer architecture with Privacy Shield |
| Original overview | README "Architecture" section | Full system overview (Frontend → Cloud Run → Agents → Firestore) |

**Mmdc export example:**

```bash
npx @mermaid-js/mermaid-cli -i docs/architecture-hybrid.mermaid -o docs/architecture-hybrid.png
```