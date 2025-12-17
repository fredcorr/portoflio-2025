'use client'

import React from 'react'

import { cn } from '@/utils/cn'

// Figma annotations:
// - Stats component (node-id: 3595:2418)
// - Note: "Ideally we want to animate this numbers"

export interface AnimatedStatValueProps {
  value: string
  className?: string
  durationMs?: number
}

interface ParsedStatValue {
  prefix: string
  suffix: string
  target: number
  fractionDigits: number
  useGrouping: boolean
}

const parseStatValue = (value: string): ParsedStatValue | null => {
  const trimmed = value.trim()
  if (!trimmed) return null

  const match = trimmed.match(
    /^([^0-9+-]*)([+-]?(?:\d{1,3}(?:,\d{3})+|\d+)(?:\.\d+)?)(.*)$/
  )
  if (!match) return null

  const prefix = match[1] || ''
  const rawNumber = match[2] || ''
  const suffix = match[3] || ''
  const sanitized = rawNumber.replace(/,/g, '')
  const target = Number.parseFloat(sanitized)

  if (!Number.isFinite(target)) return null

  const fractionDigits = (sanitized.split('.')[1] || '').length
  const useGrouping = rawNumber.includes(',')

  return { prefix, suffix, target, fractionDigits, useGrouping }
}

const formatAnimatedNumber = ({
  value,
  fractionDigits,
  useGrouping,
}: {
  value: number
  fractionDigits: number
  useGrouping: boolean
}) => {
  const formatter = new Intl.NumberFormat(undefined, {
    useGrouping,
    minimumFractionDigits: fractionDigits,
    maximumFractionDigits: fractionDigits,
  })

  return formatter.format(value)
}

const prefersReducedMotion = (): boolean => {
  if (typeof window === 'undefined') return false
  return Boolean(
    window.matchMedia &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches
  )
}

const AnimatedStatValue = ({
  value,
  className,
  durationMs = 1200,
}: AnimatedStatValueProps) => {
  const parsed = React.useMemo(() => parseStatValue(value), [value])
  const [displayValue, setDisplayValue] = React.useState(value)
  const containerRef = React.useRef<HTMLSpanElement | null>(null)
  const hasAnimatedRef = React.useRef(false)

  React.useEffect(() => {
    setDisplayValue(value)
    hasAnimatedRef.current = false
  }, [value])

  React.useEffect(() => {
    if (!parsed) return
    if (hasAnimatedRef.current) return
    if (prefersReducedMotion()) return

    const element = containerRef.current
    if (!element) return

    let rafId: number | undefined

    const animate = () => {
      hasAnimatedRef.current = true
      const start = performance.now()

      const tick = (now: number) => {
        const elapsed = now - start
        const progress = Math.min(1, elapsed / durationMs)
        const eased = 1 - Math.pow(1 - progress, 3)
        const current = parsed.target * eased
        const formatted = formatAnimatedNumber({
          value: current,
          fractionDigits: parsed.fractionDigits,
          useGrouping: parsed.useGrouping,
        })

        setDisplayValue(`${parsed.prefix}${formatted}${parsed.suffix}`)

        if (progress < 1) {
          rafId = window.requestAnimationFrame(tick)
        } else {
          const finalFormatted = formatAnimatedNumber({
            value: parsed.target,
            fractionDigits: parsed.fractionDigits,
            useGrouping: parsed.useGrouping,
          })
          setDisplayValue(`${parsed.prefix}${finalFormatted}${parsed.suffix}`)
        }
      }

      setDisplayValue(
        `${parsed.prefix}${formatAnimatedNumber({
          value: 0,
          fractionDigits: parsed.fractionDigits,
          useGrouping: parsed.useGrouping,
        })}${parsed.suffix}`
      )

      rafId = window.requestAnimationFrame(tick)
    }

    if (typeof IntersectionObserver === 'undefined') {
      animate()
      return () => {
        rafId && window.cancelAnimationFrame(rafId)
      }
    }

    const observer = new IntersectionObserver(
      entries => {
        const entry = entries[0]
        entry && entry.isIntersecting && animate()
      },
      { threshold: 0.5 }
    )

    observer.observe(element)

    return () => {
      rafId && window.cancelAnimationFrame(rafId)
      observer.disconnect()
    }
  }, [durationMs, parsed])

  return (
    <span ref={containerRef} className={cn('inline-grid', className)}>
      <span className="sr-only">{value}</span>
      <span aria-hidden="true" className="invisible col-start-1 row-start-1">
        {value}
      </span>
      <span aria-hidden="true" className="col-start-1 row-start-1">
        {displayValue}
      </span>
    </span>
  )
}

export default AnimatedStatValue
export { AnimatedStatValue }
