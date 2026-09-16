import assert from 'node:assert/strict'
import fs from 'node:fs'
import path from 'node:path'

const root = path.resolve(import.meta.dirname, '..')
const projectsSource = fs.readFileSync(path.join(root, 'src/data/projects.ts'), 'utf8')
const expectedModels = [
  'supersonic.glb',
  'spiderman-urban.glb',
  'heavy-metal-groot.glb',
  'mini-dragon.glb',
  'charizard.glb',
  'frieza.glb',
]

for (const file of expectedModels) {
  const rel = `/assets/models/${file}`
  assert.ok(projectsSource.includes(rel), `projects.ts should reference ${rel}`)
  const full = path.join(root, 'public', rel)
  assert.ok(fs.existsSync(full), `${file} should exist in public/assets/models`)
  assert.ok(fs.statSync(full).size > 1000, `${file} should not be empty`)
}

assert.ok(!projectsSource.includes('polyfork.dev/cdn/'), 'legacy external model URLs should be removed')
console.log(`project-models: ${expectedModels.length}/${expectedModels.length} local model references verified`)
