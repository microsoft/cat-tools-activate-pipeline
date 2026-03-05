# Solution Architecture

## Overview

This repository uses an **agent-driven development** pattern for Power Platform solutions. The entire solution is stored as unpacked source files in Git, and AI agents implement changes by editing these files directly.

## Component Map

```
┌─────────────────────────────────────────────┐
│              Power Platform Solution         │
├─────────────────────────────────────────────┤
│  Dataverse     │ Tables, columns,           │
│  (Schema)      │ relationships, views,      │
│                │ forms, security roles       │
├────────────────┼────────────────────────────┤
│  Canvas App    │ Community-facing UI         │
│                │ (YAML source files)         │
├────────────────┼────────────────────────────┤
│  Model-Driven  │ Admin interface             │
│  App           │ (forms, views, dashboards)  │
├────────────────┼────────────────────────────┤
│  Cloud Flows   │ Automations (notifications, │
│                │ scheduled jobs, triggers)   │
├────────────────┼────────────────────────────┤
│  Copilot       │ Conversational AI agent     │
│  Studio Agent  │ (topics, entities, actions) │
├────────────────┼────────────────────────────┤
│  Power BI      │ Analytics dashboards        │
│  Report        │ (TMDL + JSON, DirectQuery)  │
└─────────────────────────────────────────────┘
```

## Deployment Pipeline

```
Developer/Agent edits source files
         │
         ▼
    Git commit + Push
         │
         ▼
    Pull Request created
         │
         ▼
    CI Pipeline runs:
    ├── pac solution pack
    ├── pac solution check
    ├── pac solution import (dev)
    └── pac test run
         │
         ▼
    Human reviews PR
         │
         ▼
    Merge to main
         │
         ▼
    Deploy to Dev (automatic)
         │
         ▼
    Promote to Staging (manual dispatch)
         │
         ▼
    Promote to Production (manual dispatch + approval)
```

## Security

- Service Principal authentication for CI/CD (no user passwords in pipelines)
- Environment-specific secrets stored in GitHub Secrets
- Managed solutions for staging/production (prevents ad-hoc customization)
- Connection references for portable connector configuration
- Environment variables for configuration that varies per environment
