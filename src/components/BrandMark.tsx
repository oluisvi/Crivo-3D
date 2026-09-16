export function BrandMark({ compact = false }: { compact?: boolean }) {
  return (
    <span className={`brand-mark ${compact ? 'brand-mark--compact' : ''}`} aria-label="Crivo 3D">
      <img src="/assets/crivo-logo.png" alt="" aria-hidden="true" />
      {!compact && (
        <span className="brand-mark__word">
          CRIVO <b>3D</b>
        </span>
      )}
    </span>
  )
}
