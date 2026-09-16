import { useEffect, useMemo, useState } from 'react'

type EntryOverlayProps = {
  sceneReady: boolean
}

type EntryState = 'hidden' | 'waiting' | 'opening'

const SESSION_KEY = 'crivo3d:thematic-entry-seen:v1'
const SAFE_TIMEOUT_MS = 7000

function canUseStorage() {
  try {
    const test = '__crivo_storage_test__'
    sessionStorage.setItem(test, '1')
    sessionStorage.removeItem(test)
    return true
  } catch {
    return false
  }
}

export function EntryOverlay({ sceneReady }: EntryOverlayProps) {
  const reducedMotion = useMemo(
    () => typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches,
    [],
  )

  const [state, setState] = useState<EntryState>(() => {
    if (typeof window === 'undefined') return 'hidden'
    if (reducedMotion) return 'hidden'
    try {
      return sessionStorage.getItem(SESSION_KEY) === '1' ? 'hidden' : 'waiting'
    } catch {
      return 'waiting'
    }
  })

  useEffect(() => {
    if (reducedMotion) {
      if (canUseStorage()) sessionStorage.setItem(SESSION_KEY, '1')
      setState('hidden')
      return
    }

    if (state !== 'waiting') return

    let openingTimer: number | undefined
    const safetyTimer = window.setTimeout(() => {
      setState('opening')
    }, SAFE_TIMEOUT_MS)

    if (sceneReady) {
      openingTimer = window.setTimeout(() => setState('opening'), 280)
    }

    return () => {
      window.clearTimeout(safetyTimer)
      if (openingTimer) window.clearTimeout(openingTimer)
    }
  }, [reducedMotion, sceneReady, state])

  useEffect(() => {
    if (state !== 'opening') return

    if (canUseStorage()) sessionStorage.setItem(SESSION_KEY, '1')
    const timer = window.setTimeout(() => setState('hidden'), 1250)
    return () => window.clearTimeout(timer)
  }, [state])

  if (state === 'hidden') return null

  return (
    <div className={`entry-overlay entry-overlay--${state}`} aria-hidden="true">
      <div className="entry-overlay__panel entry-overlay__panel--top" />
      <div className="entry-overlay__panel entry-overlay__panel--bottom" />
      <div className="entry-overlay__scan" />
      <div className="entry-overlay__center">
        <div className="entry-overlay__micro">CRIVO / PRIMEIRA CAMADA</div>
        <div className="entry-overlay__layers" aria-hidden="true">
          {Array.from({ length: 7 }).map((_, index) => (
            <span key={index} style={{ '--layer': index } as React.CSSProperties} />
          ))}
        </div>
        <p>{state === 'waiting' ? 'Preparando a forma' : 'Peça pronta'}</p>
      </div>
    </div>
  )
}
