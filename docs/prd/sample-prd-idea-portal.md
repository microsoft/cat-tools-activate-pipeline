# Sample PRD: Community Idea Submission Portal

> Use this as a reference for how to write PRDs that agents can decompose and implement.

## Overview

Build a community-facing portal where Power Platform community members can submit feature ideas, vote on existing ideas, and track their status. Admins can review, approve/reject ideas, and provide feedback.

## User Stories

- **As a community member**, I want to submit an idea with a title, description, and category, so that I can propose improvements
- **As a community member**, I want to view all submitted ideas, so that I can see what others have proposed
- **As a community member**, I want to vote on ideas, so that popular ideas get prioritized
- **As an admin**, I want to review submitted ideas, so that I can approve or reject them with feedback
- **As an admin**, I want to see a dashboard of idea metrics, so that I can understand community engagement

## Data Model

### Tables
- **cat_idea** — Community idea submission
  - cat_name (Text, 200, Required) — Idea title
  - cat_description (Multiline Text, 10000, Required) — Detailed description
  - cat_status (Choice: Draft/Submitted/Under Review/Approved/Rejected/Implemented)
  - cat_categoryid (Lookup → cat_ideacategory) — Idea category
  - cat_votes (Integer) — Vote count
  - cat_adminfeedback (Multiline Text, 5000) — Admin response

- **cat_ideacategory** — Categories for organizing ideas
  - cat_name (Text, 100, Required) — Category name
  - cat_description (Text, 500) — Category description
  - cat_sortorder (Integer) — Display order

- **cat_ideavote** — Tracks who voted on what (prevents duplicate votes)
  - cat_ideaid (Lookup → cat_idea, Required)
  - cat_voterid (Lookup → Contact, Required)

## App Screens (Canvas App: Community Idea Portal)

1. **scr_Home** — Featured/top voted ideas, search bar, "Submit Idea" button
2. **scr_IdeaList** — Filterable gallery of all ideas (by category, status, votes)
3. **scr_IdeaDetail** — Full idea view with vote button and comments
4. **scr_SubmitIdea** — Form to submit a new idea
5. **scr_AdminReview** — Admin-only screen for reviewing/approving ideas

## Automations

1. **When Idea Submitted → Notify Admins** — Email + Teams notification
2. **When Idea Approved/Rejected → Notify Submitter** — Email with admin feedback
3. **Weekly Digest → Top Ideas Report** — Scheduled email to admin team

## Copilot Studio Agent

- **Community Ideas Helper** — Answers "How do I submit an idea?", "What's the status of my idea?", checks idea status by name

## Power BI Dashboard

- Ideas by status (pie chart)
- Ideas over time (line chart)
- Top voted ideas (bar chart)
- Category distribution (treemap)
- KPIs: Total ideas, Approved rate, Avg votes per idea

## Acceptance Criteria

- [ ] Community members can submit ideas through the canvas app
- [ ] Ideas appear in the gallery with search and filter
- [ ] Voting works (one vote per user per idea)
- [ ] Admins can review and change status with feedback
- [ ] Email notifications fire on submission and status change
- [ ] Dashboard shows real-time metrics
- [ ] Copilot agent can answer status queries
