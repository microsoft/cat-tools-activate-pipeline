---
appliesTo: "solution/Workflows/**"
---

# Cloud Flow JSON Editing Rules

When editing Power Automate flow JSON files:

## Structure
Flows are JSON objects with `properties.definition` containing the Logic Apps schema:
- `triggers` — single trigger object
- `actions` — all flow actions (flat map, ordering via `runAfter`)
- `outputs` — flow outputs (rare)

## Action Ordering
Actions use `runAfter` to define execution order:
```json
"Send_Email": {
  "runAfter": { "Get_Record": ["Succeeded"] },
  "type": "ApiConnection",
  ...
}
```

## Error Handling Pattern
Use Scope actions for Try/Catch:
```json
"Try_Scope": { "type": "Scope", "actions": { ... } },
"Catch_Scope": {
  "type": "Scope",
  "runAfter": { "Try_Scope": ["Failed", "TimedOut"] },
  "actions": { "Send_Error_Notification": { ... } }
}
```

## Connection References
Never hardcode connection IDs. Use:
```json
"connectionReferences": {
  "shared_commondataserviceforapps": {
    "connectionName": "@parameters('$connections')['shared_commondataserviceforapps']['connectionId']"
  }
}
```

## Environment Variables
Reference via: `@parameters('cat_VariableName (cat_variablename)')`

## Expression Best Practices
- Access trigger data: `@triggerOutputs()?['body/cat_name']`
- Null-safe property access: use `?` operator
- String interpolation: `@{variables('myVar')}`
- Conditional: `@if(empty(body('action')), 'default', body('action')?['value'])`
