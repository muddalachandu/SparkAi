## Goal

Upgrade the five learning modules into one connected, roadmap.sh-inspired AI learning ecosystem with rich domain catalog, interactive node-based roadmaps, embedded resources/videos, AI mentor + study guide on every node, progress tracking, and AI-generated custom roadmaps.

This is large — I'll ship it as 4 sequential slices. Each slice is fully usable on its own.

---

## Slice A — Domain catalog + roadmap data layer

**Files**

- `src/lib/domains.ts` — 100+ domains across AI/ML, Web, Backend, Languages, Cloud/DevOps, Security, Blockchain, Mobile, Game, Design, CP/DSA, Systems. Each: `{ slug, name, category, icon, blurb, tags }`.
- `src/lib/roadmap-catalog.ts` — for each domain, three tiers (Beginner / Intermediate / Advanced). Each tier = ordered nodes with `{ id, title, why, prerequisites, outcome, hours, difficulty, resources:[{type:'doc'|'youtube'|'github'|'blog'|'practice', title, url, channel?, thumbnail?}], projects:[...] }`. Seed ~12 flagship domains by hand (React, Next.js, Python, ML, GenAI, AWS, DevOps, Cybersecurity, DSA, System Design, Flutter, UI/UX); the rest are generated on demand by AI and cached in DB.
- DB migration: `roadmap_cache (domain, tier, content jsonb, updated_at)` + `node_progress (user_id, domain, tier, node_id, status, hours, completed_at)` with RLS + GRANTs.

## Slice B — Resources Hub revamp

**Files**

- `src/routes/_app.resources.tsx` — replace with searchable, category-filtered grid of all domains. Glassmorphism cards, hover glow, click → `/roadmap/:slug`. Global search bar (fuzzy over domains + node titles).
- `src/components/DomainCard.tsx`, `src/components/SearchPalette.tsx` (⌘K).

## Slice C — Interactive roadmap viewer (the centerpiece)

**Files**

- `src/routes/_app.roadmap.$slug.tsx` — vertical node graph using React Flow (`@xyflow/react`), tier tabs, animated connectors, glowing nodes, progress ring per tier. Node states: locked / available / in-progress / done.
- `src/components/RoadmapNode.tsx` — hover popup card (title, why, prereqs, outcome, est. time) + click opens drawer.
- `src/components/NodeDrawer.tsx` — right-side glass drawer with tabs:
  - **Learn** — markdown explanation
  - **Resources** — grouped (Docs / Videos with embedded YouTube thumbnails / GitHub / Practice). Per-resource Bookmark + Mark Complete.
  - **Study Guide** — generates "what/how/practice/mini-project/quiz" via `generateNodeStudyGuide` server fn (cached on node).
  - **AI Mentor** — chat scoped to this node, prefills "Explain X / Examples / Interview Qs / Assignment".
  - **Projects** — project cards → "Build with AI" → routes to `/builder?seed=...`.
- Server fns in `src/lib/roadmap.functions.ts`: `getRoadmap(slug,tier)` (DB cache → AI fill), `generateNodeStudyGuide(slug,nodeId)`, `generateCustomRoadmap(goal,timeframe)`.
- Progress: clicking "Mark Complete" writes `node_progress`, awards XP via existing `award_xp_and_streak`, updates tier % ring.

## Slice D — Custom AI roadmaps + cross-module wiring

**Files**

- `src/routes/_app.roadmap.index.tsx` — "Generate a custom roadmap" hero (goal + timeframe + level), saved roadmaps list, popular domains grid.
- Update existing `_app.roadmap.tsx` flow to feed into the new viewer.
- Update `_app.mentor.tsx` + `_app.study-guide.tsx` + `_app.builder.tsx` to accept `?node=domain:nodeId` query params and prefill context (so the drawer's "Open in Mentor / Study Guide / Builder" buttons work full-screen too).
- Global `⌘K` search palette mounted in `_app.tsx`.

---

## Technical notes

- **AI calls**: reuse existing AI gateway pattern in `src/lib/ai.functions.ts`. Model: `google/gemini-3-flash-preview`. Structured output via tool-calling for roadmap JSON.
- **Visual style**: keep existing monochrome glassmorphism. React Flow themed via CSS variables; custom node component renders glass card with gradient border + glow on hover.
- **Performance**: roadmap JSON cached in `roadmap_cache` table — first viewer hit for a non-seeded domain triggers AI generation (loading shimmer), subsequent hits are instant.
- **Video embeds**: use YouTube thumbnail (`https://img.youtube.com/vi/<id>/hqdefault.jpg`) + lite-embed pattern (click to load iframe) to keep bundle light.
- **No new heavy deps** beyond `@xyflow/react` (~80KB) and `cmdk` (already common in shadcn stacks; verify before adding).

---

## What I'll build now

**Slice A only** in this turn (domain catalog, seed roadmaps for 12 flagship domains, DB migration, server fns scaffold). Then you confirm and I ship B, C, D in three more turns.

Sound good? Approve to proceed with Slice A.
