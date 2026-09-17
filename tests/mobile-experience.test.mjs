import test from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'

const css = readFileSync(new URL('../src/styles.css', import.meta.url), 'utf8')

function block(selector) {
  const escaped = selector.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
  const match = css.match(new RegExp(`${escaped}\\s*\\{([\\s\\S]*?)\\}`))
  return match?.[1] ?? ''
}

test('3D viewer renders above the floating navigation', () => {
  const nav = block('.floating-nav')
  const viewer = block('.project-viewer')
  const navZ = Number(nav.match(/z-index:\s*(\d+)/)?.[1] ?? 0)
  const viewerZ = Number(viewer.match(/z-index:\s*(\d+)/)?.[1] ?? 0)
  assert.ok(viewerZ > navZ, `viewer z-index ${viewerZ} must be above nav ${navZ}`)
})

test('mobile viewer topbar respects safe area and keeps close controls on top', () => {
  assert.match(css, /@media \(max-width: 620px\)[\s\S]*?\.project-viewer__topbar\s*\{[\s\S]*?env\(safe-area-inset-top\)/)
  assert.match(css, /\.project-viewer__topbar\s*\{[\s\S]*?z-index:\s*[2-9]\d*/)
})

test('mobile keeps the desktop project content instead of hiding it', () => {
  const mobile900 = css.match(/@media \(max-width: 900px\)\s*\{([\s\S]*?)@media \(max-width: 620px\)/)?.[1] ?? ''
  const mobile620 = css.match(/@media \(max-width: 620px\)\s*\{([\s\S]*?)@media \(prefers-reduced-motion/ )?.[1] ?? ''
  assert.doesNotMatch(mobile900, /\.project-card__copy\s*>\s*p\s*\{\s*display:\s*none/)
  assert.doesNotMatch(mobile620, /\.project-card__meta\s+span:last-child\s*\{\s*display:\s*none/)
  assert.doesNotMatch(mobile620, /\.crivo-scene__label\s*\{\s*display:\s*none/)
})
