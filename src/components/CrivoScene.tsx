import { useEffect, useRef, useState } from 'react'
import * as THREE from 'three'

type CrivoSceneProps = {
  onReady?: () => void
}

function createCrivoGeometry() {
  const shape = new THREE.Shape()
  const points: Array<[number, number]> = [
    [1.65, 1.55],
    [0.15, 1.55],
    [-0.85, 1.15],
    [-1.45, 0.35],
    [-1.45, -0.35],
    [-0.85, -1.15],
    [0.15, -1.55],
    [1.65, -1.55],
    [1.65, -0.62],
    [0.35, -0.62],
    [-0.18, -0.4],
    [-0.48, 0],
    [-0.18, 0.4],
    [0.35, 0.62],
    [1.65, 0.62],
  ]

  shape.moveTo(points[0][0], points[0][1])
  points.slice(1).forEach(([x, y]) => shape.lineTo(x, y))
  shape.closePath()

  const geometry = new THREE.ExtrudeGeometry(shape, {
    depth: 0.52,
    bevelEnabled: true,
    bevelSegments: 4,
    steps: 1,
    bevelSize: 0.09,
    bevelThickness: 0.08,
    curveSegments: 2,
  })
  geometry.center()
  return geometry
}

export function CrivoScene({ onReady }: CrivoSceneProps) {
  const mountRef = useRef<HTMLDivElement | null>(null)
  const readyRef = useRef(false)
  const [fallback, setFallback] = useState(false)

  useEffect(() => {
    const mount = mountRef.current
    if (!mount) return

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    let renderer: THREE.WebGLRenderer

    try {
      renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' })
    } catch {
      setFallback(true)
      onReady?.()
      return
    }

    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.7))
    renderer.setClearColor(0x000000, 0)
    renderer.outputColorSpace = THREE.SRGBColorSpace
    renderer.toneMapping = THREE.ACESFilmicToneMapping
    renderer.toneMappingExposure = 1.08
    mount.appendChild(renderer.domElement)

    const scene = new THREE.Scene()
    scene.fog = new THREE.FogExp2(0x050506, 0.07)

    const camera = new THREE.PerspectiveCamera(42, 1, 0.1, 100)
    camera.position.set(0.2, 0.15, 8.2)

    const group = new THREE.Group()
    group.rotation.x = -0.12
    group.rotation.y = -0.34
    scene.add(group)

    const metal = new THREE.MeshStandardMaterial({
      color: 0xc7c8c9,
      metalness: 0.88,
      roughness: 0.28,
    })
    const darkMetal = new THREE.MeshStandardMaterial({
      color: 0x303033,
      metalness: 0.7,
      roughness: 0.42,
    })
    const orange = new THREE.MeshStandardMaterial({
      color: 0xe2490e,
      metalness: 0.38,
      roughness: 0.3,
      emissive: 0x541300,
      emissiveIntensity: 0.34,
    })

    const cMesh = new THREE.Mesh(createCrivoGeometry(), metal)
    cMesh.castShadow = true
    cMesh.receiveShadow = true
    cMesh.rotation.z = -0.04
    group.add(cMesh)

    const fins = new THREE.Group()
    fins.position.set(1.15, -0.93, 0.12)
    fins.rotation.z = -0.04
    for (let i = 0; i < 4; i += 1) {
      const geo = new THREE.BoxGeometry(1.33 - i * 0.06, 0.32, 0.42)
      const fin = new THREE.Mesh(geo, orange)
      fin.position.set(i * 0.16, -i * 0.37, 0)
      fin.rotation.z = -0.1
      fin.castShadow = true
      fins.add(fin)
    }
    group.add(fins)

    const innerPlate = new THREE.Mesh(new THREE.BoxGeometry(1.2, 0.12, 0.32), darkMetal)
    innerPlate.position.set(0.98, -0.58, -0.08)
    innerPlate.rotation.z = -0.14
    group.add(innerPlate)

    const floor = new THREE.Mesh(
      new THREE.CircleGeometry(3.8, 64),
      new THREE.MeshStandardMaterial({ color: 0x070708, metalness: 0.2, roughness: 0.84, transparent: true, opacity: 0.92 }),
    )
    floor.rotation.x = -Math.PI / 2
    floor.position.y = -2.2
    floor.position.z = 0.4
    floor.receiveShadow = true
    scene.add(floor)

    const rings = new THREE.Group()
    for (let i = 0; i < 8; i += 1) {
      const curve = new THREE.EllipseCurve(0, 0, 2.5 + i * 0.18, 1.55 + i * 0.11, 0, Math.PI * 2, false, 0)
      const pts = curve.getPoints(90).map((p) => new THREE.Vector3(p.x, p.y, -0.5 - i * 0.12))
      const geo = new THREE.BufferGeometry().setFromPoints(pts)
      const line = new THREE.LineLoop(geo, new THREE.LineBasicMaterial({ color: 0x2b2b2e, transparent: true, opacity: 0.18 - i * 0.012 }))
      line.rotation.x = 0.14
      rings.add(line)
    }
    scene.add(rings)

    const key = new THREE.DirectionalLight(0xffffff, 4.2)
    key.position.set(3, 5, 6)
    scene.add(key)

    const rim = new THREE.PointLight(0xff4b13, 22, 9, 2)
    rim.position.set(3.5, -1.6, 3)
    scene.add(rim)

    const fill = new THREE.PointLight(0x6d7380, 12, 11, 2)
    fill.position.set(-4, 1.8, 2)
    scene.add(fill)

    const ambient = new THREE.HemisphereLight(0xdfe4ea, 0x080808, 1.3)
    scene.add(ambient)

    const pointer = new THREE.Vector2(0, 0)
    const target = new THREE.Vector2(0, 0)
    let scrollProgress = 0
    let frameCount = 0
    let raf = 0
    let last = performance.now()
    let isVisible = true

    const resize = () => {
      const { clientWidth, clientHeight } = mount
      if (!clientWidth || !clientHeight) return
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, clientWidth < 720 ? 1.25 : 1.7))
      renderer.setSize(clientWidth, clientHeight, false)
      camera.aspect = clientWidth / clientHeight
      camera.updateProjectionMatrix()
    }

    const onPointer = (event: PointerEvent) => {
      const rect = mount.getBoundingClientRect()
      target.x = ((event.clientX - rect.left) / rect.width - 0.5) * 2
      target.y = ((event.clientY - rect.top) / rect.height - 0.5) * 2
    }

    const onLeave = () => target.set(0, 0)
    const onScroll = () => {
      scrollProgress = Math.min(window.scrollY / Math.max(window.innerHeight, 1), 1.5)
    }

    resize()
    renderer.compile(scene, camera)

    const animate = (now: number) => {
      const dt = Math.min((now - last) / 1000, 0.04)
      last = now
      if (isVisible || frameCount < 4) {
        pointer.lerp(target, reducedMotion ? 0.03 : 0.055)

        if (!reducedMotion) {
          group.rotation.y += dt * 0.12
          group.rotation.x += (pointer.y * 0.1 - group.rotation.x - 0.12) * 0.025
          group.rotation.z += (-pointer.x * 0.045 - group.rotation.z) * 0.028
          rings.rotation.z -= dt * 0.025
        }
        group.position.y = -scrollProgress * 0.25
        group.rotation.y += (pointer.x * 0.16 - scrollProgress * 0.18) * 0.007
        renderer.render(scene, camera)
        frameCount += 1
      }
      if (!readyRef.current && frameCount >= 4) {
        readyRef.current = true
        onReady?.()
      }
      raf = requestAnimationFrame(animate)
    }

    raf = requestAnimationFrame(animate)
    const ro = new ResizeObserver(resize)
    ro.observe(mount)
    const visibilityObserver = new IntersectionObserver(([entry]) => {
      isVisible = entry.isIntersecting
    }, { rootMargin: '120px' })
    visibilityObserver.observe(mount)
    mount.addEventListener('pointermove', onPointer)
    mount.addEventListener('pointerleave', onLeave)
    window.addEventListener('scroll', onScroll, { passive: true })

    return () => {
      cancelAnimationFrame(raf)
      ro.disconnect()
      visibilityObserver.disconnect()
      mount.removeEventListener('pointermove', onPointer)
      mount.removeEventListener('pointerleave', onLeave)
      window.removeEventListener('scroll', onScroll)
      renderer.dispose()
      scene.traverse((object) => {
        if (object instanceof THREE.Mesh) {
          object.geometry?.dispose()
          if (Array.isArray(object.material)) object.material.forEach((m) => m.dispose())
          else object.material?.dispose()
        }
        if (object instanceof THREE.Line) {
          object.geometry.dispose()
          if (Array.isArray(object.material)) object.material.forEach((m) => m.dispose())
          else object.material.dispose()
        }
      })
      renderer.domElement.remove()
    }
  }, [onReady])

  return (
    <div className="crivo-scene" ref={mountRef} aria-hidden="true">
      {fallback && (
        <div className="crivo-scene__fallback">
          <span className="fallback-c">C</span>
          <span className="fallback-fins"><i /><i /><i /><i /></span>
        </div>
      )}
      <div className="crivo-scene__label">ARRASTE O CURSOR / 3D</div>
    </div>
  )
}
