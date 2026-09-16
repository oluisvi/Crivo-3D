import { useCallback, useEffect, useMemo, useRef, useState, type CSSProperties, type KeyboardEvent as ReactKeyboardEvent, type PointerEvent as ReactPointerEvent } from 'react'
import { conceptProjects, type ConceptProject, type ProjectVisual } from '../data/projects'
import { ModelStage } from './ModelStage'
import { Reveal } from './Reveal'

function Arrow({ direction }: { direction: 'left' | 'right' }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className={direction === 'left' ? 'is-left' : ''}>
      <path d="M5 12h13M13 6l6 6-6 6" />
    </svg>
  )
}

function ExpandIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M9 4H4v5M15 4h5v5M9 20H4v-5M15 20h5v-5" />
    </svg>
  )
}

function ProjectGlyph({ visual }: { visual: ProjectVisual }) {
  return (
    <svg className={`project-glyph project-glyph--${visual}`} viewBox="0 0 260 260" aria-hidden="true">
      {visual === 'robot' && (
        <>
          <rect x="70" y="70" width="120" height="112" rx="18" />
          <rect x="86" y="34" width="88" height="58" rx="12" />
          <path d="M105 58h50M98 182v44M162 182v44M70 106H38v60M190 106h32v60" />
          <circle cx="146" cy="62" r="8" />
        </>
      )}
      {visual === 'wizard' && (
        <>
          <path d="M130 26L70 170h120L130 26Z" />
          <path d="M48 174c0-12 37-22 82-22s82 10 82 22-37 22-82 22-82-10-82-22Z" />
          <path d="M104 128c22 8 46 8 68 0" />
        </>
      )}
      {visual === 'sword' && (
        <>
          <path d="M130 24l18 28-10 120h-16L112 52l18-28Z" />
          <path d="M70 170h120M130 170v62M110 232h40" />
        </>
      )}
      {visual === 'helmet' && (
        <>
          <path d="M54 150c0-68 34-108 76-108s76 40 76 108" />
          <path d="M38 150h184M130 44v74" />
          <path d="M76 150v42M184 150v42" />
        </>
      )}
      {visual === 'headphones' && (
        <>
          <path d="M58 138v-28c0-52 31-84 72-84s72 32 72 84v28" />
          <rect x="43" y="122" width="42" height="88" rx="18" />
          <rect x="175" y="122" width="42" height="88" rx="18" />
        </>
      )}
      {visual === 'planter' && (
        <>
          <path d="M76 112h108l-15 112H91L76 112Z" />
          <path d="M130 112V48M130 82c-34 0-50-16-50-36 34 0 50 16 50 36ZM130 92c34 0 50-16 50-36-34 0-50 16-50 36Z" />
        </>
      )}
    </svg>
  )
}

function relativeOffset(index: number, active: number, total: number) {
  let offset = index - active
  if (offset > total / 2) offset -= total
  if (offset < -total / 2) offset += total
  return offset
}

function viewerTitle(project: ConceptProject) {
  return `${project.title} — visualização 3D`
}

export function ProjectsCarousel() {
  const [active, setActive] = useState(0)
  const [viewerProject, setViewerProject] = useState<ConceptProject | null>(null)
  const [sectionVisible, setSectionVisible] = useState(false)
  const [dragging, setDragging] = useState(false)
  const sectionRef = useRef<HTMLElement | null>(null)
  const pointerStart = useRef<{ id: number; x: number; y: number } | null>(null)
  const movedRef = useRef(false)
  const total = conceptProjects.length
  const activeProject = conceptProjects[active]

  const go = useCallback((delta: number) => {
    setActive((current) => (current + delta + total) % total)
  }, [total])

  useEffect(() => {
    const section = sectionRef.current
    if (!section) return
    const observer = new IntersectionObserver(([entry]) => {
      setSectionVisible(entry.isIntersecting)
    }, { rootMargin: '280px 0px' })
    observer.observe(section)
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    if (!viewerProject) return
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setViewerProject(null)
    }
    window.addEventListener('keydown', onKeyDown)
    return () => {
      window.removeEventListener('keydown', onKeyDown)
      document.body.style.overflow = previousOverflow
    }
  }, [viewerProject])

  const onKeyDown = (event: ReactKeyboardEvent<HTMLDivElement>) => {
    if (event.key === 'ArrowLeft') {
      event.preventDefault()
      go(-1)
    }
    if (event.key === 'ArrowRight') {
      event.preventDefault()
      go(1)
    }
    if (event.key === 'Enter') {
      event.preventDefault()
      setViewerProject(activeProject)
    }
  }

  const onPointerDown = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (event.pointerType === 'mouse' && event.button !== 0) return
    const target = event.target as HTMLElement
    if (target.closest('button, a')) return
    pointerStart.current = { id: event.pointerId, x: event.clientX, y: event.clientY }
    movedRef.current = false
    setDragging(true)
    event.currentTarget.setPointerCapture(event.pointerId)
  }

  const onPointerMove = (event: ReactPointerEvent<HTMLDivElement>) => {
    const start = pointerStart.current
    if (!start || start.id !== event.pointerId) return
    if (Math.abs(event.clientX - start.x) > 9 || Math.abs(event.clientY - start.y) > 9) movedRef.current = true
  }

  const finishPointer = (event: ReactPointerEvent<HTMLDivElement>) => {
    const start = pointerStart.current
    if (!start || start.id !== event.pointerId) return
    const deltaX = event.clientX - start.x
    const deltaY = event.clientY - start.y
    if (Math.abs(deltaX) > 54 && Math.abs(deltaX) > Math.abs(deltaY) * 1.2) go(deltaX > 0 ? -1 : 1)
    pointerStart.current = null
    setDragging(false)
    if (event.currentTarget.hasPointerCapture(event.pointerId)) event.currentTarget.releasePointerCapture(event.pointerId)
  }

  const cardStyles = useMemo(() => conceptProjects.map((_, index) => {
    const offset = relativeOffset(index, active, total)
    const distance = Math.abs(offset)
    const scale = Math.max(0.66, 1 - distance * 0.13)
    const opacity = distance > 2 ? 0 : Math.max(0.22, 1 - distance * 0.26)
    const z = -distance * 190
    const y = distance * 24
    const x = offset * 72
    const rotate = offset * -10
    return {
      transform: `translate3d(calc(-50% + ${x}%), ${y}px, ${z}px) rotateY(${rotate}deg) scale(${scale})`,
      opacity,
      zIndex: 10 - distance,
      pointerEvents: distance > 2 ? 'none' : 'auto',
    } as CSSProperties
  }), [active, total])

  return (
    <section className="projects-section" id="projetos" ref={sectionRef}>
      <div className="projects-section__grid" aria-hidden="true" />
      <div className="section-shell projects-section__shell">
        <Reveal className="projects-section__head">
          <div>
            <p className="section-index">05 / POSSIBILIDADES</p>
            <p className="projects-section__micro">Projetos conceito · visualização demonstrativa</p>
          </div>
          <h2>Não basta imaginar.<br /><em>Dá para girar a ideia.</em></h2>
          <p className="projects-section__lead">Uma seleção de formas para mostrar o alcance da impressão 3D — de colecionáveis e props a acessórios e objetos funcionais.</p>
        </Reveal>

        <div
          className={`projects-carousel ${dragging ? 'is-dragging' : ''}`}
          role="region"
          aria-roledescription="carousel"
          aria-label="Projetos conceito em 3D"
          tabIndex={0}
          onKeyDown={onKeyDown}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={finishPointer}
          onPointerCancel={finishPointer}
        >
          <div className="projects-carousel__stage">
            {conceptProjects.map((project, index) => {
              const offset = relativeOffset(index, active, total)
              const isActive = offset === 0
              const hidden = Math.abs(offset) > 2
              return (
                <article
                  className={`project-card ${isActive ? 'is-active' : ''}`}
                  style={cardStyles[index]}
                  aria-hidden={hidden || undefined}
                  key={project.id}
                  onClick={() => {
                    if (!movedRef.current && !isActive) setActive(index)
                  }}
                >
                  <div className="project-card__visual">
                    <div className="project-card__grid" aria-hidden="true" />
                    <div className="project-card__ghost-number" aria-hidden="true">{project.number}</div>
                    {sectionVisible && !hidden ? (
                      <ModelStage project={project} animate={isActive} className="project-card__model" />
                    ) : (
                      <ProjectGlyph visual={project.visual} />
                    )}
                    <div className="project-card__scan" aria-hidden="true" />
                    <div className="project-card__badge">{project.category}</div>
                  </div>

                  <div className="project-card__copy">
                    <div className="project-card__meta">
                      <span>{project.number} / {String(total).padStart(2, '0')}</span>
                      <span>{project.materialHint}</span>
                    </div>
                    <h3>{project.title}</h3>
                    <p>{project.description}</p>
                    <div className="project-card__footer">
                      <span>{project.application}</span>
                      {isActive && (
                        <button
                          type="button"
                          className="project-card__explore"
                          onPointerDown={(event) => event.stopPropagation()}
                          onClick={(event) => {
                            event.stopPropagation()
                            setViewerProject(project)
                          }}
                        >
                          Explorar em 3D <ExpandIcon />
                        </button>
                      )}
                    </div>
                  </div>
                </article>
              )
            })}
          </div>

          <div className="projects-carousel__controls">
            <button type="button" onClick={() => go(-1)} aria-label="Projeto anterior"><Arrow direction="left" /></button>
            <div className="projects-carousel__progress" aria-label={`Projeto ${active + 1} de ${total}`}>
              {conceptProjects.map((project, index) => (
                <button
                  type="button"
                  key={project.id}
                  className={index === active ? 'is-active' : ''}
                  onClick={() => setActive(index)}
                  aria-label={`Ver ${project.title}`}
                  aria-current={index === active ? 'true' : undefined}
                ><span /></button>
              ))}
            </div>
            <button type="button" onClick={() => go(1)} aria-label="Próximo projeto"><Arrow direction="right" /></button>
          </div>
        </div>

        <div className="projects-section__disclaimer">
          <span>CONCEITO, NÃO CASE REAL</span>
          <p>Estes modelos demonstram possibilidades de aplicação e não representam trabalhos já produzidos pela Crivo 3D. O portfólio será substituído pelos projetos reais após a coleta de materiais com a empresa.</p>
        </div>
      </div>

      {viewerProject && (
        <div className="project-viewer" role="dialog" aria-modal="true" aria-label={viewerTitle(viewerProject)}>
          <button className="project-viewer__backdrop" type="button" onClick={() => setViewerProject(null)} aria-label="Fechar visualização 3D" />
          <div className="project-viewer__panel">
            <div className="project-viewer__topbar">
              <div>
                <span>{viewerProject.category}</span>
                <strong>{viewerProject.title}</strong>
              </div>
              <button type="button" className="project-viewer__close" onClick={() => setViewerProject(null)} aria-label="Fechar">
                <span />
                <span />
              </button>
            </div>

            <ModelStage project={viewerProject} interactive className="project-viewer__stage" />

            <div className="project-viewer__info">
              <div>
                <span>APLICAÇÃO</span>
                <p>{viewerProject.application}</p>
              </div>
              <div>
                <span>MODELO</span>
                <p>{viewerProject.sourceName}</p>
              </div>
              <div>
                <span>LICENÇA / ORIGEM</span>
                {viewerProject.sourceUrl ? (
                  <a href={viewerProject.sourceUrl} target="_blank" rel="noreferrer">{viewerProject.license} ↗</a>
                ) : (
                  <p>{viewerProject.license}</p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  )
}
