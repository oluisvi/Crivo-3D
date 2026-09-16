import { useCallback, useEffect, useState } from 'react'
import { BrandMark } from './components/BrandMark'
import { CrivoScene } from './components/CrivoScene'
import { EntryOverlay } from './components/EntryOverlay'
import { Reveal } from './components/Reveal'
import { site } from './data/site'

function ArrowIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M5 12h13M13 6l6 6-6 6" />
    </svg>
  )
}

function InstagramIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="1" className="icon-fill" />
    </svg>
  )
}

function MenuIcon({ open }: { open: boolean }) {
  return (
    <span className={`menu-icon ${open ? 'is-open' : ''}`} aria-hidden="true">
      <i />
      <i />
    </span>
  )
}

function App() {
  const [sceneReady, setSceneReady] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  const onSceneReady = useCallback(() => setSceneReady(true), [])

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    if (!menuOpen) return
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setMenuOpen(false)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [menuOpen])

  const closeMenu = () => setMenuOpen(false)

  return (
    <>
      <a className="skip-link" href="#conteudo">Pular para o conteúdo</a>
      <EntryOverlay sceneReady={sceneReady} />

      <header className={`floating-nav ${scrolled ? 'is-scrolled' : ''}`}>
        <a href="#topo" className="floating-nav__brand" aria-label="Crivo 3D — início" onClick={closeMenu}>
          <BrandMark />
        </a>

        <nav className={`floating-nav__links ${menuOpen ? 'is-open' : ''}`} aria-label="Navegação principal">
          <a href="#crivo" onClick={closeMenu}>O Crivo</a>
          <a href="#processo" onClick={closeMenu}>Processo</a>
          <a href="#sobre" onClick={closeMenu}>Sobre</a>
          <a className="nav-cta" href={site.instagram} target="_blank" rel="noreferrer" onClick={closeMenu}>
            Falar com a Crivo <ArrowIcon />
          </a>
        </nav>

        <button
          className="menu-button"
          type="button"
          aria-label={menuOpen ? 'Fechar menu' : 'Abrir menu'}
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen((value) => !value)}
        >
          <MenuIcon open={menuOpen} />
        </button>
      </header>

      <main id="conteudo">
        <section className="hero" id="topo">
          <div className="hero__grid hero__grid--back" aria-hidden="true" />
          <div className="hero__glow" aria-hidden="true" />
          <div className="hero__content">
            <p className="eyebrow"><span />{site.hero.eyebrow}</p>
            <h1>
              <span>{site.hero.titleTop}</span>
              <strong>{site.hero.titleAccent}</strong>
            </h1>
            <p className="hero__body">{site.hero.body}</p>
            <div className="hero__actions">
              <a className="button button--primary" href={site.instagram} target="_blank" rel="noreferrer">
                Leve sua ideia ao Crivo <ArrowIcon />
              </a>
              <a className="button button--ghost" href="#processo">Conheça o processo</a>
            </div>
          </div>

          <div className="hero__scene-wrap">
            <CrivoScene onReady={onSceneReady} />
          </div>

          <div className="hero__footnote" aria-hidden="true">
            <span>01 / 06</span>
            <span>role para descobrir</span>
          </div>
        </section>

        <section className="filter-section" id="crivo">
          <div className="section-shell">
            <Reveal className="filter-section__intro">
              <p className="section-index">02 / O NOME</p>
              <h2>Antes de uma ideia <em>ganhar forma,</em><br />ela passa pelo nosso Crivo.</h2>
              <p className="section-lead">Crivo não é só o nome. É a forma como a marca pensa o projeto antes de apertar “imprimir”.</p>
            </Reveal>

            <div className="filter-grid">
              {site.filters.map((item) => (
                <Reveal className="filter-card" key={item.id}>
                  <article>
                    <div className="filter-card__top">
                      <span>{item.id}</span>
                      <span className="filter-card__glyph" aria-hidden="true" />
                    </div>
                    <h3>{item.title}</h3>
                    <p>{item.text}</p>
                  </article>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        <section className="material-section" aria-label="Produção Crivo 3D">
          <div className="material-section__media">
            <img src="/assets/printer-crivo.webp" alt="Impressora 3D da Crivo produzindo uma peça com a identidade da marca" loading="lazy" />
            <div className="material-section__scanline" aria-hidden="true" />
            <div className="material-section__stamp">
              <span>PROCESSO REAL</span>
              <strong>CAMADA<br />POR CAMADA.</strong>
            </div>
          </div>
          <div className="material-section__copy">
            <Reveal>
              <p className="section-index">03 / MATÉRIA</p>
              <h2>Da tela<br />para a <em>mão.</em></h2>
              <p>Impressão 3D é o momento em que uma ideia deixa de ser só intenção e passa a ocupar espaço. É esse instante que o site transforma em linguagem visual.</p>
              <div className="material-section__meta">
                <span><b>01</b> Ideia</span>
                <i />
                <span><b>02</b> Crivo</span>
                <i />
                <span><b>03</b> Forma</span>
              </div>
            </Reveal>
          </div>
        </section>

        <section className="process-section" id="processo">
          <div className="section-shell">
            <Reveal className="process-section__head">
              <p className="section-index">04 / PROCESSO</p>
              <h2>O caminho da ideia<br /><em>até a peça.</em></h2>
            </Reveal>

            <div className="process-track" aria-hidden="true"><span /></div>
            <div className="process-list">
              {site.process.map((step) => (
                <Reveal className="process-item" key={step.number}>
                  <article>
                    <div className="process-item__number">{step.number}</div>
                    <h3>{step.label}</h3>
                    <p>{step.text}</p>
                  </article>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        <section className="outcomes-section">
          <div className="section-shell">
            <Reveal className="outcomes-section__head">
              <p className="section-index">05 / O QUE GANHA FORMA</p>
              <h2>Mais do que<br /><em>imprimir peças.</em></h2>
            </Reveal>

            <div className="outcomes-grid">
              {site.outcomes.map((item, index) => (
                <Reveal className="outcome-card" key={item.kicker}>
                  <article>
                    <div className={`outcome-card__art outcome-card__art--${index + 1}`} aria-hidden="true">
                      <span /><span /><span /><span />
                    </div>
                    <p className="outcome-card__kicker">{item.kicker}</p>
                    <h3>{item.title}</h3>
                    <p className="outcome-card__body">{item.text}</p>
                  </article>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        <section className="story-section" id="sobre">
          <div className="story-section__brand" aria-hidden="true">
            <div className="story-section__big-c">C</div>
            <div className="story-section__fins"><i /><i /><i /><i /></div>
          </div>
          <div className="section-shell story-section__layout">
            <Reveal>
              <p className="section-index">06 / A HISTÓRIA</p>
              <h2>Toda grande ideia começa com um <em>primeiro passo.</em></h2>
            </Reveal>
            <Reveal className="story-section__copy">
              {site.story.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
              <p className="story-section__welcome">Seja bem-vindo à Crivo 3D.<br /><strong>Ideias que ganham forma.</strong></p>
            </Reveal>
          </div>
        </section>

        <section className="cta-section">
          <div className="cta-section__noise" aria-hidden="true" />
          <div className="section-shell cta-section__layout">
            <Reveal>
              <p className="section-index">PRÓXIMA CAMADA</p>
              <h2>Tem uma ideia?<br /><em>Vamos dar forma.</em></h2>
            </Reveal>
            <Reveal className="cta-section__action">
              <a className="cta-orbit" href={site.instagram} target="_blank" rel="noreferrer" aria-label="Abrir o Instagram da Crivo 3D">
                <span>Falar com<br />a Crivo</span>
                <ArrowIcon />
              </a>
            </Reveal>
          </div>
        </section>
      </main>

      <footer>
        <div className="footer__top">
          <BrandMark />
          <p>Ideias que ganham forma.</p>
        </div>
        <div className="footer__bottom">
          <span>{site.location}</span>
          <a href={site.instagram} target="_blank" rel="noreferrer"><InstagramIcon /> @crivo3d</a>
          <span>© {new Date().getFullYear()} Crivo 3D</span>
        </div>
      </footer>
    </>
  )
}

export default App
