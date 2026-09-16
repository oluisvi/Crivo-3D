import assert from 'node:assert/strict'
import fs from 'node:fs'
import path from 'node:path'

const root = path.resolve(import.meta.dirname, '..')
const app = fs.readFileSync(path.join(root, 'src/App.tsx'), 'utf8')
const styles = fs.readFileSync(path.join(root, 'src/styles.css'), 'utf8')

assert.match(app, /className="outcomes-list"/, 'section 06 should use an editorial list instead of a card grid')
assert.match(app, /className="outcome-row"/, 'each outcome should render as an editorial row')
assert.match(app, /outcome-row__number/, 'rows should expose a large editorial index')
assert.match(app, /outcome-row__line/, 'rows should include the restrained orange motion line')
assert.doesNotMatch(app, /outcome-card__art/, 'decorative circles and floating bars should be removed')
assert.doesNotMatch(styles, /\.outcome-card__art/, 'legacy decorative card art CSS should be removed')
assert.match(styles, /\.outcome-row:hover[\s\S]*?\.outcome-row__line/, 'desktop hover should animate the restrained orange line')
assert.match(styles, /@media \(max-width: 900px\)[\s\S]*?\.outcome-row article\s*\{/, 'editorial rows should have a mobile/tablet layout')

console.log('outcomes-section: editorial section 06 structure verified')
