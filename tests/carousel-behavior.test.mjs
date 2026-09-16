import assert from 'node:assert/strict'
import fs from 'node:fs'
import path from 'node:path'

const root = path.resolve(import.meta.dirname, '..')
const carousel = fs.readFileSync(path.join(root, 'src/components/ProjectsCarousel.tsx'), 'utf8')
const modelStage = fs.readFileSync(path.join(root, 'src/components/ModelStage.tsx'), 'utf8')
const projects = fs.readFileSync(path.join(root, 'src/data/projects.ts'), 'utf8')

assert.match(
  carousel,
  /closest\(['"]button, a['"]\)/,
  'carousel drag handler should ignore interactive buttons/links so arrow controls remain clickable',
)

assert.match(
  carousel,
  /sectionVisible\s*&&\s*!hidden/,
  'visible side cards should mount real ModelStage previews, not only the active card',
)
assert.match(
  carousel,
  /animate=\{isActive\}/,
  'only the active card should animate its 3D preview; side previews should stay lightweight/static',
)

assert.match(modelStage, /const modelPivot = new THREE\.Group\(\)/, 'ModelStage should use a centered pivot for loaded models')
assert.match(modelStage, /modelPivot\.rotation\.y/, 'preview animation should rotate the centered pivot')
assert.doesNotMatch(modelStage, /model\.rotation\.y\s*=/, 'loaded model root should not rotate around an offset source origin')
assert.match(modelStage, /const animateRef = useRef\(animate\)/, 'preview motion changes should not rebuild/reload the 3D model')
assert.doesNotMatch(modelStage, /\[animate, interactive, project\]/, 'switching active card should not recreate ModelStage and make side previews reload')
assert.match(modelStage, /!interactive && !animateRef\.current/, 'static side previews should skip GPU rendering while staying mounted')

assert.ok(projects.includes("modelUrl: '/assets/models/goku.glb'"), 'slot 04 should use the local Goku GLB')
assert.ok(!projects.includes("modelUrl: '/assets/models/mini-dragon.glb'"), 'Mini Dragon should be removed from the project data')
assert.ok(fs.existsSync(path.join(root, 'public/assets/models/goku.glb')), 'Goku GLB should exist')

console.log('carousel-behavior: controls, side previews, pivot centering, and Goku replacement verified')
