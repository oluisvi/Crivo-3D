import { useEffect, useRef, useState } from 'react'
import * as THREE from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import type { ConceptProject, ProjectVisual } from '../data/projects'

type ModelStageProps = {
  project: ConceptProject
  interactive?: boolean
  className?: string
}

function makeMaterial(color: number, metalness = 0.35, roughness = 0.5, emissive = 0x000000) {
  return new THREE.MeshStandardMaterial({
    color,
    metalness,
    roughness,
    emissive,
    emissiveIntensity: emissive === 0x000000 ? 0 : 0.18,
  })
}

function createRobot() {
  const group = new THREE.Group()
  const metal = makeMaterial(0xbfc2c7, 0.76, 0.26)
  const dark = makeMaterial(0x1c1d20, 0.7, 0.34)
  const orange = makeMaterial(0xe2490e, 0.38, 0.28, 0x4f1300)
  const white = makeMaterial(0xf2f2ef, 0.28, 0.42)

  const body = new THREE.Mesh(new THREE.BoxGeometry(1.8, 2, 1.15, 2, 2, 2), dark)
  body.position.y = 0.15
  body.rotation.z = -0.04
  group.add(body)

  const chest = new THREE.Mesh(new THREE.BoxGeometry(1.22, 0.62, 1.23), white)
  chest.position.set(0, 0.28, 0.08)
  group.add(chest)

  const head = new THREE.Mesh(new THREE.BoxGeometry(1.2, 0.88, 1), metal)
  head.position.y = 1.62
  head.rotation.y = -0.08
  group.add(head)

  const visor = new THREE.Mesh(new THREE.BoxGeometry(0.76, 0.22, 1.04), orange)
  visor.position.set(0.13, 1.67, 0.08)
  group.add(visor)

  const antenna = new THREE.Mesh(new THREE.CylinderGeometry(0.035, 0.035, 0.62, 10), metal)
  antenna.position.set(0.36, 2.33, 0)
  antenna.rotation.z = -0.18
  group.add(antenna)

  const antennaTip = new THREE.Mesh(new THREE.SphereGeometry(0.11, 14, 10), orange)
  antennaTip.position.set(0.41, 2.65, 0)
  group.add(antennaTip)

  for (const side of [-1, 1]) {
    const shoulder = new THREE.Mesh(new THREE.SphereGeometry(0.28, 16, 12), metal)
    shoulder.position.set(side * 1.16, 0.62, 0)
    group.add(shoulder)

    const arm = new THREE.Mesh(new THREE.CylinderGeometry(0.17, 0.2, 1.25, 12), dark)
    arm.position.set(side * 1.22, -0.1, 0)
    arm.rotation.z = side * 0.08
    group.add(arm)

    const hand = new THREE.Mesh(new THREE.BoxGeometry(0.36, 0.34, 0.38), orange)
    hand.position.set(side * 1.27, -0.84, 0.02)
    group.add(hand)

    const leg = new THREE.Mesh(new THREE.BoxGeometry(0.5, 1.26, 0.62), dark)
    leg.position.set(side * 0.48, -1.55, 0)
    group.add(leg)

    const foot = new THREE.Mesh(new THREE.BoxGeometry(0.7, 0.28, 1.05), metal)
    foot.position.set(side * 0.48, -2.26, 0.17)
    foot.rotation.y = side * 0.06
    group.add(foot)
  }

  const badge = new THREE.Mesh(new THREE.TorusGeometry(0.24, 0.06, 10, 24, Math.PI * 1.5), orange)
  badge.position.set(-0.32, 0.28, 0.68)
  badge.rotation.x = Math.PI / 2
  badge.rotation.z = Math.PI * 0.25
  group.add(badge)

  group.scale.setScalar(0.86)
  group.rotation.y = -0.28
  return group
}

function createFallbackObject(visual: ProjectVisual) {
  if (visual === 'robot') return createRobot()

  const group = new THREE.Group()
  const metal = makeMaterial(0xbfc2c7, 0.76, 0.28)
  const dark = makeMaterial(0x202125, 0.55, 0.4)
  const orange = makeMaterial(0xe2490e, 0.32, 0.35, 0x481100)

  if (visual === 'wizard') {
    const brim = new THREE.Mesh(new THREE.CylinderGeometry(1.45, 1.45, 0.16, 40), dark)
    brim.position.y = -0.95
    group.add(brim)
    const crown = new THREE.Mesh(new THREE.ConeGeometry(1.05, 2.9, 28), orange)
    crown.position.y = 0.42
    crown.rotation.z = -0.17
    group.add(crown)
    const band = new THREE.Mesh(new THREE.TorusGeometry(0.93, 0.09, 12, 36), metal)
    band.position.y = -0.73
    band.rotation.x = Math.PI / 2
    group.add(band)
  }

  if (visual === 'sword') {
    const blade = new THREE.Mesh(new THREE.BoxGeometry(0.34, 3.5, 0.12), metal)
    blade.position.y = 0.65
    group.add(blade)
    const tip = new THREE.Mesh(new THREE.ConeGeometry(0.24, 0.62, 4), metal)
    tip.position.y = 2.71
    tip.rotation.y = Math.PI / 4
    group.add(tip)
    const guard = new THREE.Mesh(new THREE.BoxGeometry(1.65, 0.18, 0.24), orange)
    guard.position.y = -1.18
    group.add(guard)
    const grip = new THREE.Mesh(new THREE.CylinderGeometry(0.16, 0.18, 1.05, 12), dark)
    grip.position.y = -1.78
    group.add(grip)
    group.rotation.z = -0.52
  }

  if (visual === 'helmet') {
    const dome = new THREE.Mesh(new THREE.SphereGeometry(1.38, 34, 20, 0, Math.PI * 2, 0, Math.PI * 0.62), metal)
    dome.scale.y = 0.76
    dome.position.y = -0.15
    group.add(dome)
    const brim = new THREE.Mesh(new THREE.CylinderGeometry(1.62, 1.62, 0.12, 40), dark)
    brim.position.y = -0.2
    group.add(brim)
    const stripe = new THREE.Mesh(new THREE.BoxGeometry(0.18, 1.15, 1.32), orange)
    stripe.position.set(0, 0.52, 0.1)
    stripe.rotation.x = -0.45
    group.add(stripe)
  }

  if (visual === 'headphones') {
    const arc = new THREE.Mesh(new THREE.TorusGeometry(1.32, 0.16, 16, 44, Math.PI * 1.1), metal)
    arc.rotation.z = Math.PI * 0.95
    arc.position.y = 0.28
    group.add(arc)
    for (const side of [-1, 1]) {
      const ear = new THREE.Mesh(new THREE.BoxGeometry(0.46, 1.18, 0.66), dark)
      ear.position.set(side * 1.08, -0.48, 0)
      ear.rotation.z = side * 0.12
      group.add(ear)
      const accent = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.76, 0.7), orange)
      accent.position.set(side * 1.08, -0.48, side * 0.01)
      group.add(accent)
    }
  }

  if (visual === 'planter') {
    const pot = new THREE.Mesh(new THREE.CylinderGeometry(1.25, 0.86, 1.72, 8), dark)
    pot.position.y = -0.7
    group.add(pot)
    const rim = new THREE.Mesh(new THREE.TorusGeometry(1.24, 0.12, 12, 32), orange)
    rim.position.y = 0.16
    rim.rotation.x = Math.PI / 2
    group.add(rim)
    const plant = new THREE.Mesh(new THREE.IcosahedronGeometry(1.14, 1), makeMaterial(0x565d50, 0.05, 0.82))
    plant.position.y = 1.03
    plant.scale.set(1, 0.8, 1)
    group.add(plant)
  }

  return group
}

function disposeObject(root: THREE.Object3D) {
  root.traverse((object) => {
    if (!(object instanceof THREE.Mesh)) return
    object.geometry?.dispose()
    if (Array.isArray(object.material)) object.material.forEach((material) => material.dispose())
    else object.material?.dispose()
  })
}

export function ModelStage({ project, interactive = false, className = '' }: ModelStageProps) {
  const mountRef = useRef<HTMLDivElement | null>(null)
  const [status, setStatus] = useState<'loading' | 'ready' | 'fallback'>('loading')
  const [webglUnavailable, setWebglUnavailable] = useState(false)

  useEffect(() => {
    const mount = mountRef.current
    if (!mount) return

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    let renderer: THREE.WebGLRenderer

    setWebglUnavailable(false)

    try {
      renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' })
    } catch {
      setWebglUnavailable(true)
      setStatus('fallback')
      return
    }

    renderer.setClearColor(0x000000, 0)
    renderer.outputColorSpace = THREE.SRGBColorSpace
    renderer.toneMapping = THREE.ACESFilmicToneMapping
    renderer.toneMappingExposure = 1.12
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, interactive ? 1.55 : 1.25))
    mount.appendChild(renderer.domElement)

    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(interactive ? 36 : 40, 1, 0.05, 200)
    camera.position.set(3.6, 2.4, 6.8)

    const stage = new THREE.Group()
    scene.add(stage)

    const hemi = new THREE.HemisphereLight(0xf6f6f4, 0x171719, 2.2)
    scene.add(hemi)

    const key = new THREE.DirectionalLight(0xffffff, 4.4)
    key.position.set(4.5, 6.5, 7)
    scene.add(key)

    const orange = new THREE.PointLight(0xff5a1b, 26, 16, 2)
    orange.position.set(-3.8, -1.5, 4)
    scene.add(orange)

    const cool = new THREE.PointLight(0x6d7380, 12, 13, 2)
    cool.position.set(3.6, 1.5, -3)
    scene.add(cool)

    const ring = new THREE.Mesh(
      new THREE.TorusGeometry(2.7, 0.015, 8, 96),
      new THREE.MeshBasicMaterial({ color: 0xe2490e, transparent: true, opacity: 0.26 }),
    )
    ring.rotation.x = Math.PI / 2
    ring.position.y = -2.15
    stage.add(ring)

    const base = new THREE.Mesh(
      new THREE.CircleGeometry(2.35, 72),
      new THREE.MeshStandardMaterial({ color: 0x0d0d0f, metalness: 0.45, roughness: 0.72 }),
    )
    base.rotation.x = -Math.PI / 2
    base.position.y = -2.16
    stage.add(base)

    let model: THREE.Object3D | null = null
    let controls: OrbitControls | null = null
    let raf = 0
    let visible = true
    let disposed = false
    let loadToken = 0

    const fitObject = (object: THREE.Object3D) => {
      object.updateMatrixWorld(true)
      const box = new THREE.Box3().setFromObject(object)
      const size = box.getSize(new THREE.Vector3())
      const center = box.getCenter(new THREE.Vector3())
      const maxDim = Math.max(size.x, size.y, size.z, 0.6)

      object.position.sub(center)
      object.updateMatrixWorld(true)

      const fov = THREE.MathUtils.degToRad(camera.fov)
      const distance = (maxDim / (2 * Math.tan(fov / 2))) * (interactive ? 1.75 : 1.58)
      camera.position.set(distance * 0.58, Math.max(maxDim * 0.26, 0.7), distance)
      camera.near = Math.max(distance / 120, 0.02)
      camera.far = Math.max(distance * 35, 80)
      camera.updateProjectionMatrix()
      camera.lookAt(0, 0, 0)
      camera.updateMatrixWorld()

      if (controls) {
        controls.target.set(0, 0, 0)
        controls.minDistance = distance * 0.56
        controls.maxDistance = distance * 2.2
        controls.update()
      }
    }

    const addObject = (object: THREE.Object3D, isFallback = false) => {
      if (disposed) {
        disposeObject(object)
        return
      }
      if (model) {
        stage.remove(model)
        disposeObject(model)
      }
      model = object
      stage.add(object)
      fitObject(object)
      setStatus(isFallback ? 'fallback' : 'ready')
    }

    if (interactive) {
      controls = new OrbitControls(camera, renderer.domElement)
      controls.enablePan = false
      controls.enableDamping = true
      controls.dampingFactor = 0.065
      controls.rotateSpeed = 0.72
      controls.zoomSpeed = 0.72
      controls.autoRotate = !reducedMotion
      controls.autoRotateSpeed = 0.72
    }

    const loadProject = () => {
      setStatus('loading')
      const token = ++loadToken

      if (!project.modelUrl) {
        addObject(createFallbackObject(project.visual), false)
        return
      }

      const loader = new GLTFLoader()
      loader.setCrossOrigin('anonymous')
      loader.load(
        project.modelUrl,
        (gltf) => {
          if (token !== loadToken || disposed) {
            disposeObject(gltf.scene)
            return
          }
          gltf.scene.traverse((object) => {
            if (!(object instanceof THREE.Mesh)) return
            object.castShadow = false
            object.receiveShadow = false
            if (Array.isArray(object.material)) {
              object.material.forEach((material) => {
                material.side = THREE.FrontSide
              })
            } else if (object.material) {
              object.material.side = THREE.FrontSide
            }
          })
          addObject(gltf.scene, false)
        },
        undefined,
        () => {
          if (token !== loadToken || disposed) return
          addObject(createFallbackObject(project.visual), true)
        },
      )
    }

    const resize = () => {
      const width = mount.clientWidth
      const height = mount.clientHeight
      if (!width || !height) return
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, width < 700 ? 1.15 : interactive ? 1.55 : 1.25))
      renderer.setSize(width, height, false)
      camera.aspect = width / height
      camera.updateProjectionMatrix()
    }

    resize()
    loadProject()

    const ro = new ResizeObserver(resize)
    ro.observe(mount)

    const io = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting
    }, { rootMargin: '100px' })
    io.observe(mount)

    const clock = new THREE.Clock()
    const animate = () => {
      raf = requestAnimationFrame(animate)
      if (!visible) return
      const elapsed = clock.getElapsedTime()
      if (model && !interactive && !reducedMotion) {
        model.rotation.y = Math.sin(elapsed * 0.34) * 0.16 + elapsed * 0.12
        model.rotation.x = Math.sin(elapsed * 0.24) * 0.03
      }
      if (!reducedMotion) ring.rotation.z = elapsed * 0.08
      controls?.update()
      renderer.render(scene, camera)
    }
    animate()

    return () => {
      disposed = true
      loadToken += 1
      cancelAnimationFrame(raf)
      ro.disconnect()
      io.disconnect()
      controls?.dispose()
      scene.traverse((object) => {
        if (!(object instanceof THREE.Mesh)) return
        object.geometry?.dispose()
        if (Array.isArray(object.material)) object.material.forEach((material) => material.dispose())
        else object.material?.dispose()
      })
      renderer.dispose()
      renderer.domElement.remove()
    }
  }, [interactive, project])

  return (
    <div className={`model-stage ${interactive ? 'model-stage--interactive' : ''} ${className}`.trim()} ref={mountRef}>
      {webglUnavailable && (
        <div className="model-stage__html-fallback" role="img" aria-label={`${project.title} — preview 3D indisponível neste dispositivo`}>
          <span>3D</span>
          <strong>{project.shortTitle}</strong>
          <small>Preview 3D indisponível neste dispositivo</small>
        </div>
      )}
      <div className={`model-stage__status model-stage__status--${status}`} aria-live="polite">
        {status === 'loading' && <><span /> Carregando forma 3D</>}
        {status === 'fallback' && <><span /> Preview procedural</>}
      </div>
      {interactive && <div className="model-stage__hint">Arraste para girar · scroll para aproximar</div>}
    </div>
  )
}
