import React from 'react'

export interface UseLockScrollOptions {
  mainId?: string
  inertIds?: string[]
}

const DEFAULT_MAIN_ID = 'main-content'
const DEFAULT_INERT_IDS = ['theme-toggle']

const useLockScroll = (
  isLocked: boolean,
  {
    mainId = DEFAULT_MAIN_ID,
    inertIds = DEFAULT_INERT_IDS,
  }: UseLockScrollOptions = {}
) => {
  const bodyStyleRef = React.useRef({
    overflow: '',
    paddingRight: '',
    touchAction: '',
  })
  const rootStyleRef = React.useRef({
    overscrollBehavior: '',
  })

  React.useEffect(() => {
    const body = document.body
    const root = document.documentElement
    const scrollbarWidth = window.innerWidth - root.clientWidth
    const main = mainId && document.getElementById(mainId)
    const inertTargets = inertIds
      .map(id => id && document.getElementById(id))
      .filter((element): element is HTMLElement => Boolean(element))

    const toggleInert = (active: boolean) => {
      active && main && main.setAttribute('inert', '')
      active && main && main.setAttribute('aria-hidden', 'true')
      !active && main && main.removeAttribute('inert')
      !active && main && main.removeAttribute('aria-hidden')

      inertTargets.forEach(target => {
        active && target && target.setAttribute('inert', '')
        active && target && target.setAttribute('aria-hidden', 'true')
        !active && target && target.removeAttribute('inert')
        !active && target && target.removeAttribute('aria-hidden')
      })
    }

    const restoreScroll = () => {
      body.style.overflow = bodyStyleRef.current.overflow
      body.style.paddingRight = bodyStyleRef.current.paddingRight
      body.style.touchAction = bodyStyleRef.current.touchAction
      root.style.overscrollBehavior = rootStyleRef.current.overscrollBehavior
      toggleInert(false)
    }

    isLocked &&
      (() => {
        bodyStyleRef.current = {
          overflow: body.style.overflow,
          paddingRight: body.style.paddingRight,
          touchAction: body.style.touchAction,
        }
        rootStyleRef.current = {
          overscrollBehavior: root.style.overscrollBehavior,
        }
        body.style.overflow = 'hidden'
        body.style.touchAction = 'none'
        root.style.overscrollBehavior = 'none'
        scrollbarWidth > 0 && (body.style.paddingRight = `${scrollbarWidth}px`)
        toggleInert(true)
      })()

    !isLocked && restoreScroll()

    return () => {
      restoreScroll()
    }
  }, [inertIds, isLocked, mainId])
}

export default useLockScroll
