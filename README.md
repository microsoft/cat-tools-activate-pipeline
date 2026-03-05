# CAT Tools Activate Pipeline

> Agent-driven Power Platform solution development. Define a PRD, assign issues to AI agents, and let them build, test, and ship your Power Platform solutions.

## How It Works

```
PRD → Issues → Agent Implements → CI Validates → Human Reviews PR → Deploy
```

### 1. Write a PRD
Create a GitHub Issue using the **PRD Feature** template. Describe what you need — Dataverse schema, Power Apps, flows, Copilot Studio agents, Power BI dashboards.

### 2. Decompose into Work Items
Assign the PRD to the **@solution-architect** agent (or use the `decompose` label). It breaks the PRD into actionable child issues tagged by component type.

### 3. Agents Implement
Assign child issues to `@copilot`. The coding agent:
- Creates a feature branch
- Edits unpacked solution files (XML, JSON, YAML, TMDL)
- Uses PAC CLI and MCP tools for validation
- Opens a PR linking back to the issue

### 4. CI Pipeline Validates
On every PR, the pipeline:
- Packs the solution (`pac solution pack`)
- Runs Solution Checker (`pac solution check`)
- Imports to dev environment (`pac solution import`)
- Runs automated tests (`pac test run`)
- Reports results on the PR

### 5. Review & Deploy
Human reviews the PR. On merge:
- Dev deployment is automatic
- Staging/prod promoted via manual workflow dispatch

## Repository Structure

```
solution/           → Unpacked Power Platform solution (Dataverse, Flows, Apps, Agents)
pbip/               → Power BI reports in PBIP format (TMDL + JSON)
tests/              → Automated test plans (YAML + Power Fx)
config/             → Environment config, connection refs, env vars
docs/               → PRDs and architecture docs
.github/agents/     → Specialized agent personas
.github/workflows/  → CI/CD pipelines
```

## Prerequisites

- **PAC CLI**: `dotnet tool install --global Microsoft.PowerApps.CLI.Tool`
- **Service Principal**: App registration with Dataverse permissions for CI/CD
- **Power Platform Environments**: Dev, Staging, Prod with solution publisher configured
- **GitHub Copilot**: Enterprise license with coding agent enabled

## Publisher Info

| Property | Value |
|----------|-------|
| Publisher Prefix | `cat` |
| Publisher Name | CAT Tools |
| Solution Name | CATToolsActivatePipeline |

## Quick Start

1. Clone this repo
2. Configure `config/environments.json` with your environment details
3. Set GitHub Secrets: `PP_CLIENT_ID`, `PP_CLIENT_SECRET`, `PP_TENANT_ID`
4. Create a PRD issue → assign to agent → watch the magic ✨
