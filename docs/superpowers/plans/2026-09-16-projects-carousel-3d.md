# Projects Carousel + 3D Viewer Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add an honest concept-project carousel with live Three.js previews and an interactive 3D viewer to the Crivo 3D website.

**Architecture:** Project metadata lives in a dedicated data module. A reusable `ModelStage` owns WebGL loading/rendering and fallback geometry, while `ProjectsCarousel` owns carousel state, pointer/keyboard navigation and the viewer modal. The existing `App` only composes the new scene.

**Tech Stack:** React 18, TypeScript, Three.js, CSS transforms, native Pointer Events, IntersectionObserver.

**Spec:** `docs/superpowers/specs/2026-09-16-projects-carousel-3d-design.md`

## Global Constraints
- Do not add dependencies.
- Do not claim third-party concept models were produced by Crivo 3D.
- External models must have explicit commercial-use permission; source/license must remain documented.
- 3D loads lazily and has a procedural fallback.
- Respect `prefers-reduced-motion`.

---

### Task 1: Project data and provenance
**Files:** Create `src/data/projects.ts`; Create `CREDITS-3D.md`.
- [ ] Define six concept projects, one procedural and five lightweight GLB references.
- [ ] Store source URL, GLB URL, license label, visual variant, and project copy.
- [ ] Document the exact external source pages and usage notes.

### Task 2: Shared Three.js model stage
**Files:** Create `src/components/ModelStage.tsx`.
- [ ] Build renderer/camera/lights/resize lifecycle with cleanup.
- [ ] Load GLB through `GLTFLoader` only for referenced projects.
- [ ] Auto-fit loaded models using a bounding box.
- [ ] Add local procedural C-01 and per-variant fallback objects.
- [ ] Add optional `OrbitControls` for the full viewer and pause offscreen rendering.

### Task 3: Depth carousel and viewer
**Files:** Create `src/components/ProjectsCarousel.tsx`.
- [ ] Implement circular active-index math, previous/next buttons, click selection and arrow-key navigation.
- [ ] Implement drag/swipe threshold navigation with pointer capture.
- [ ] Mount only the active `ModelStage` when the section is near the viewport.
- [ ] Add full-screen accessible viewer modal, Escape close and body-scroll lock.
- [ ] Keep visible disclaimer that projects are concept demonstrations.

### Task 4: Integrate into page narrative
**Files:** Modify `src/App.tsx`; Modify `src/styles.css`.
- [ ] Add “Projetos” navigation anchor.
- [ ] Insert carousel after Processo.
- [ ] Renumber following story scenes to 06/07 and 07/07.
- [ ] Add desktop/tablet/mobile styling, depth transforms, animated layer indicator, viewer styling and reduced-motion overrides.

### Task 5: Verification and package
**Files:** All touched files.
- [ ] Run TypeScript syntax transpilation for every `.ts/.tsx` file with the globally installed compiler API.
- [ ] Run static checks for missing project model/source fields and accidental “Crivo project” claims.
- [ ] Build a clean ZIP excluding generated caches.
- [ ] Report the limitation that a full Vite production build cannot be executed in this offline container unless dependencies are available.
