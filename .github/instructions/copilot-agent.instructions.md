---
appliesTo: "solution/BotComponents/**"
---

# Copilot Studio Agent Editing Rules

When editing Copilot Studio bot component files:

## File Structure
- `botcomponent.xml` — Component definition (kind, data reference)
- `botcomponent_data.xml` — Actual content (topics, entities, actions)

## Topic Patterns
- Minimum 5 trigger phrases per topic
- Include variations in phrasing, formality, and length
- Use entities for structured data extraction
- Always include a fallback message for unrecognized input
- End conversations with a clear resolution or handoff

## TaskDialog (Tool) Components
- `modelDescription` must be **declarative** (what the tool does)
  - ✅ "Extracts structured data from documents"
  - ❌ "Call this tool when a user uploads a document"
- Set `shouldPromptUser: true` ONLY for required inputs
- Set `shouldPromptUser: false` for optional inputs
- Add `description` to every input for orchestrator context

## Connection References
- Use connection reference names, not hardcoded connection IDs
- Map connectors in the solution's connection reference metadata

## Adaptive Cards
- Use for rich message formatting (tables, images, buttons)
- Keep card payloads under 28KB
- Test rendering in Teams and web chat

## Testing
- Test each topic with at least 3 different phrasings
- Verify entity extraction accuracy
- Test conversation handoff/escalation paths
- Validate adaptive card rendering
