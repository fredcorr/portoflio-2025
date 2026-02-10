'use client'

import React, { useEffect, useMemo, useRef } from 'react'
import * as THREE from 'three'

import { cn } from '@/utils/cn'

interface ThreeBackgroundTunnelProps {
  className?: string
  speed?: number
  ringCount?: number
  pixelRatioCap?: number
}

const prefersReducedMotion = () =>
  typeof window !== 'undefined' &&
  window.matchMedia &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches

const isMobileViewport = () =>
  typeof window !== 'undefined' && window.matchMedia
    ? window.matchMedia('(max-width: 768px)').matches
    : false

const parseColor = (raw: string): [number, number, number] | null => {
  const value = raw.trim()
  if (!value) return null

  if (value.startsWith('#')) {
    const hex = value.replace('#', '')
    const normalized =
      hex.length === 3
        ? hex
            .split('')
            .map(ch => ch + ch)
            .join('')
        : hex
    if (normalized.length !== 6) return null
    const r = Number.parseInt(normalized.slice(0, 2), 16)
    const g = Number.parseInt(normalized.slice(2, 4), 16)
    const b = Number.parseInt(normalized.slice(4, 6), 16)
    return [r, g, b]
  }

  const match = value.match(/rgba?\(([^)]+)\)/i)
  if (match) {
    const parts = match[1].split(',').map(part => Number.parseFloat(part))
    if (parts.length >= 3) {
      return [parts[0], parts[1], parts[2]]
    }
  }

  return null
}

const resolveRingColor = () => {
  if (typeof window === 'undefined') return 0xffffff
  const computed = window
    .getComputedStyle(document.documentElement)
    .getPropertyValue('--color-foreground')
  const rgb = parseColor(computed)
  if (!rgb) return 0xffffff
  const [r, g, b] = rgb
  const luminance = (0.2126 * r + 0.7152 * g + 0.0722 * b) / 255
  return luminance > 0.5 ? 0x000000 : 0xffffff
}

const ThreeBackgroundTunnel = ({
  className,
  speed,
  ringCount,
  pixelRatioCap,
}: ThreeBackgroundTunnelProps) => {
  const containerRef = useRef<HTMLDivElement>(null)

  const settings = useMemo(() => {
    // Compute runtime settings once per render, with a lighter profile on mobile.
    const isMobile = isMobileViewport()
    return {
      isMobile,
      ringCount: ringCount ?? (isMobile ? 18 : 30),
      pixelRatioCap: pixelRatioCap ?? (isMobile ? 1.5 : 2),
      speed: speed ?? (isMobile ? 0.02 : 0.03),
      rotationSpeed: (speed ?? (isMobile ? 0.02 : 0.03)) * 0.07,
      ringSpacing: 3,
    }
  }, [ringCount, pixelRatioCap, speed])

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    // Scene + camera + renderer setup (renderer attaches to the container).
    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(75, 1, 0.1, 1000)
    camera.position.z = 10

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true })
    renderer.setPixelRatio(
      Math.min(window.devicePixelRatio || 1, settings.pixelRatioCap)
    )
    renderer.setSize(container.clientWidth, container.clientHeight, false)
    renderer.domElement.style.width = '100%'
    renderer.domElement.style.height = '100%'
    container.appendChild(renderer.domElement)

    // Build a shared ring geometry and individual materials for opacity control.
    const geometry = new THREE.RingGeometry(2, 2.2, 6)
    const rings: THREE.Mesh<THREE.RingGeometry, THREE.MeshBasicMaterial>[] = []
    const ringColor = resolveRingColor()

    for (let i = 0; i < settings.ringCount; i += 1) {
      const material = new THREE.MeshBasicMaterial({
        color: ringColor,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.15,
      })
      const ring = new THREE.Mesh(geometry, material)
      ring.position.z = -i * settings.ringSpacing
      ring.rotation.z = (i * Math.PI) / 6
      scene.add(ring)
      rings.push(ring)
    }

    // Update ring color when theme changes (based on CSS variable).
    const updateRingColor = () => {
      const nextColor = resolveRingColor()
      rings.forEach(ring => ring.material.color.setHex(nextColor))
    }

    let frameId: number | null = null
    let lastTime = 0
    let isVisible = true
    const reduceMotion = prefersReducedMotion()

    const renderFrame = () => {
      renderer.render(scene, camera)
    }

    // Animation loop: move rings forward, recycle them, and fade by distance.
    const animate = (time: number) => {
      if (!isVisible) return
      frameId = window.requestAnimationFrame(animate)
      const delta = lastTime ? (time - lastTime) / 16.67 : 1
      lastTime = time

      rings.forEach(ring => {
        ring.position.z += settings.speed * delta
        ring.rotation.z += settings.rotationSpeed * delta
        if (ring.position.z > 10) {
          ring.position.z = -settings.ringCount * settings.ringSpacing
        }
        const distance = Math.abs(ring.position.z)
        ring.material.opacity = Math.max(0, 0.25 - distance * 0.01)
      })

      renderFrame()
    }

    // Keep renderer/camera sized to the container (not the window).
    const resize = () => {
      const { width, height } = container.getBoundingClientRect()
      if (!width || !height) return
      camera.aspect = width / height
      camera.updateProjectionMatrix()
      renderer.setPixelRatio(
        Math.min(window.devicePixelRatio || 1, settings.pixelRatioCap)
      )
      renderer.setSize(width, height, false)
    }

    const resizeObserver = new ResizeObserver(resize)
    resizeObserver.observe(container)

    // Pause animation when off-screen to save GPU/CPU.
    const intersectionObserver = new IntersectionObserver(
      entries => {
        const entry = entries[0]
        isVisible = Boolean(entry?.isIntersecting)
        if (!isVisible && frameId !== null) {
          cancelAnimationFrame(frameId)
          frameId = null
        }
        if (isVisible) {
          if (reduceMotion) {
            renderFrame()
          } else if (frameId === null) {
            lastTime = 0
            frameId = requestAnimationFrame(animate)
          }
        }
      },
      { threshold: 0.1 }
    )
    intersectionObserver.observe(container)

    // React to theme toggles (dark/light) by swapping ring color.
    const mutationObserver = new MutationObserver(updateRingColor)
    mutationObserver.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class'],
    })

    if (!reduceMotion) {
      frameId = requestAnimationFrame(animate)
    } else {
      renderFrame()
    }

    // Cleanup: stop RAF, disconnect observers, dispose GPU resources.
    return () => {
      if (frameId !== null) {
        cancelAnimationFrame(frameId)
      }
      intersectionObserver.disconnect()
      resizeObserver.disconnect()
      mutationObserver.disconnect()
      container.removeChild(renderer.domElement)
      geometry.dispose()
      rings.forEach(ring => ring.material.dispose())
      renderer.dispose()
    }
  }, [settings])

  return (
    <div
      ref={containerRef}
      className={cn('absolute inset-0 pointer-events-none', className)}
      aria-hidden
    />
  )
}

export default ThreeBackgroundTunnel
