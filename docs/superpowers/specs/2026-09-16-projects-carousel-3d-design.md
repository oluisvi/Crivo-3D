# Crivo 3D — Projects Carousel + 3D Viewer Design

## Goal
Add a portfolio-like “Projetos conceito” experience that visually demonstrates the kinds of objects 3D printing can create without falsely presenting third-party models as work already produced by Crivo 3D.

## Experience
- Insert a new scene after Processo and before the existing outcomes/story content.
- Use a custom depth carousel inspired by the interaction principle of React Bits Depth Carousel: one large active card, side cards receding in 3D perspective, drag/swipe, arrow buttons and keyboard navigation.
- Keep the Crivo visual language: black, graphite, white, orange, technical labels, layer/progress motifs and restrained industrial motion.
- Active project contains a live lightweight Three.js preview only when the section is near the viewport.
- “Explorar em 3D” opens a full-screen interactive viewer with orbit controls, close button, model metadata and source/license disclosure.

## Content & Truthfulness
- Label the section “Projetos conceito / possibilidades”.
- Explicitly state that the models are demonstrative references and not claimed as projects already produced by Crivo.
- Use one original procedural character (C-01) and lightweight web-ready reference models from Polyfork for fantasy, cosplay, tech and object-design examples.
- Preserve source/license links in the UI and in `CREDITS-3D.md`.

## Performance
- Do not add another rendering library; reuse `three` already installed.
- Load only the active carousel model when the projects section becomes visible.
- Load the larger interactive scene only when the modal opens.
- Pause rendering when stages are not visible.
- Provide local procedural fallback geometry if an external model fails.
- Respect `prefers-reduced-motion` by removing idle rotation and minimizing card depth movement.

## Accessibility
- Carousel is keyboard navigable with left/right arrows.
- Controls are real buttons with visible focus.
- Modal has `role="dialog"`, `aria-modal="true"`, descriptive title and Escape-to-close.
- Viewer remains supplemental; project copy and CTA are available without WebGL.

## Responsive
- Desktop: full depth rail with previous/next cards visible.
- Tablet: reduced perspective and two adjacent cards.
- Mobile: swipe-first single dominant card with smaller neighboring hints; viewer becomes edge-to-edge.

## Files
- Create `src/data/projects.ts` — content/model metadata.
- Create `src/components/ModelStage.tsx` — shared Three.js stage, GLB loading, procedural objects and fallbacks.
- Create `src/components/ProjectsCarousel.tsx` — depth carousel and modal shell.
- Modify `src/App.tsx` — nav and new scene insertion/section numbering.
- Modify `src/styles.css` — complete visual/responsive/motion system.
- Create `CREDITS-3D.md` — model provenance and licensing notes.
