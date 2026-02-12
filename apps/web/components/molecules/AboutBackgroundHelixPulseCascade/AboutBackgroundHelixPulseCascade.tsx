'use client'

import React, { useEffect, useMemo, useRef } from 'react'
import * as THREE from 'three'

import { cn } from '@/utils/cn'
import {
  isMobileViewport,
  prefersReducedMotion,
  resolveRingColor,
} from '@/utils/three-helpers'

interface AboutBackgroundHelixPulseCascadeProps {
  className?: string
  speed?: number
  ringCount?: number
  pixelRatioCap?: number
}

type HelixRing = THREE.Mesh<THREE.RingGeometry, THREE.MeshBasicMaterial> & {
  userData: {
    initialRadius: number
    angle: number
    helix: 1 | 2
    index: number
  }
}

const AboutBackgroundHelixPulseCascade = ({
  className,
  speed,
  ringCount,
  pixelRatioCap,
}: AboutBackgroundHelixPulseCascadeProps) => {
  const containerRef = useRef<HTMLDivElement>(null)

  const settings = useMemo(() => {
    const isMobile = isMobileViewport()
    const baseSpeed = speed ?? (isMobile ? 0.002 : 0.01)
    return {
      ringCount: ringCount ?? (isMobile ? 18 : 30),
      pixelRatioCap: pixelRatioCap ?? (isMobile ? 1.5 : 2),
      speed: baseSpeed,
      rotationSpeed: baseSpeed * 0.5,
      ringSpacing: 2.5,
      radius: 3,
      pulseSpeed: 1.5,
      pulseAmount: 0.35,
    }
  }, [ringCount, pixelRatioCap, speed])

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

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

    const geometry = new THREE.RingGeometry(1.2, 1.35, 6)
    const rings: HelixRing[] = []
    const ringColor = resolveRingColor('--color-foreground')

    for (let i = 0; i < settings.ringCount; i += 1) {
      const angle = (i / settings.ringCount) * Math.PI * 4

      const material1 = new THREE.MeshBasicMaterial({
        color: ringColor,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.12,
      })
      const ring1 = new THREE.Mesh(geometry, material1) as HelixRing
      ring1.position.x = Math.cos(angle) * settings.radius
      ring1.position.y = Math.sin(angle) * settings.radius
      ring1.position.z = -i * settings.ringSpacing
      ring1.rotation.z = angle
      ring1.userData = {
        initialRadius: settings.radius,
        angle,
        helix: 1,
        index: i,
      }
      scene.add(ring1)
      rings.push(ring1)

      const material2 = new THREE.MeshBasicMaterial({
        color: ringColor,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.12,
      })
      const ring2 = new THREE.Mesh(geometry, material2) as HelixRing
      ring2.position.x = -Math.cos(angle) * settings.radius
      ring2.position.y = -Math.sin(angle) * settings.radius
      ring2.position.z = -i * settings.ringSpacing
      ring2.rotation.z = -angle
      ring2.userData = {
        initialRadius: settings.radius,
        angle,
        helix: 2,
        index: i,
      }
      scene.add(ring2)
      rings.push(ring2)
    }

    const updateRingColor = () => {
      const nextColor = resolveRingColor('--color-foreground')
      rings.forEach(ring => ring.material.color.setHex(nextColor))
    }

    let frameId: number | null = null
    let lastTime = 0
    let isVisible = true
    const reduceMotion = prefersReducedMotion()

    const renderFrame = () => {
      renderer.render(scene, camera)
    }

    const animate = (time: number) => {
      if (!isVisible) return
      frameId = window.requestAnimationFrame(animate)
      const delta = lastTime ? (time - lastTime) / 16.67 : 1
      lastTime = time

      const pulseTime = time * 0.001

      rings.forEach(ring => {
        ring.position.z += settings.speed * delta
        if (ring.position.z > 10) {
          ring.position.z = -settings.ringCount * settings.ringSpacing
        }

        const cascadeDelay = ring.userData.index * 0.25
        const pulse =
          Math.sin(pulseTime * settings.pulseSpeed + cascadeDelay) *
            settings.pulseAmount +
          1

        const currentRadius = ring.userData.initialRadius * pulse
        const currentAngle =
          ring.userData.angle + pulseTime * settings.rotationSpeed

        if (ring.userData.helix === 1) {
          ring.position.x = Math.cos(currentAngle) * currentRadius
          ring.position.y = Math.sin(currentAngle) * currentRadius
        } else {
          ring.position.x = -Math.cos(currentAngle) * currentRadius
          ring.position.y = -Math.sin(currentAngle) * currentRadius
        }

        ring.scale.set(pulse, pulse, 1)

        const distance = Math.abs(ring.position.z)
        ring.material.opacity = Math.max(0, 0.22 - distance * 0.012)
      })

      renderFrame()
    }

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

export default AboutBackgroundHelixPulseCascade
