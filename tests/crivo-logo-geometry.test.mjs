import test from 'node:test'
import assert from 'node:assert/strict'
import geometry from '../src/data/crivoLogoGeometry.json' with { type: 'json' }

function bounds(points) {
  const xs = points.map(([x]) => x)
  const ys = points.map(([, y]) => y)
  return {
    minX: Math.min(...xs),
    maxX: Math.max(...xs),
    minY: Math.min(...ys),
    maxY: Math.max(...ys),
  }
}

test('Crivo symbol silhouette matches the reference proportions', () => {
  assert.equal(geometry.c.length, 11)
  const c = bounds(geometry.c)
  assert.deepEqual(c, { minX: 34, maxX: 99, minY: 32, maxY: 111 })
  assert.ok((c.maxY - c.minY) > (c.maxX - c.minX), 'the C must be taller than it is wide')
  assert.deepEqual(geometry.c[4], [57, 111], 'lower C terminal must finish on the diagonal point')
  assert.deepEqual(geometry.c[5], [75, 93], 'lower inner terminal must angle back toward the opening')
})

test('Crivo symbol uses four descending orange fins aligned to the lower opening', () => {
  assert.equal(geometry.fins.length, 4)
  assert.deepEqual(geometry.fins[0], [[87, 89], [112, 89], [116, 85], [91, 85]])
  assert.deepEqual(geometry.fins[3], [[63, 112], [88, 113], [93, 109], [68, 108]])
  for (let i = 1; i < geometry.fins.length; i += 1) {
    const previous = bounds(geometry.fins[i - 1])
    const current = bounds(geometry.fins[i])
    assert.ok(current.minX < previous.minX, 'each lower fin must step left')
    assert.ok(current.minY > previous.minY, 'each lower fin must step down')
  }
})
