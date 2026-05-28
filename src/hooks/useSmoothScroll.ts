import { useEffect } from 'react'

/**
 * Scroll-driven parallax system.
 *
 * data-speed="0.5"   — element scrolls at 0.5× speed relative to viewport center
 * data-speed="auto"  — auto-calculates for overflow:hidden containers
 * data-lag="0.3"     — element lags behind scroll (rubber-band effect)
 *
 * Uses native scroll. No fake scrollbars.
 * Stores base offset per element so transforms don't accumulate.
 */

interface ElementState {
  baseTop: number
  lagY: number
}

export function useSmoothScroll() {
  useEffect(() => {
    const stateMap = new WeakMap<Element, ElementState>()

    function getState(el: HTMLElement): ElementState {
      if (!stateMap.has(el)) {
        const rect = el.getBoundingClientRect()
        stateMap.set(el, {
          baseTop: rect.top + window.scrollY,
          lagY: window.scrollY,
        })
      }
      return stateMap.get(el)!
    }

    let rafId: number

    function tick() {
      const scrollY = window.scrollY
      const viewH = window.innerHeight

      // --- data-speed ---
      document.querySelectorAll<HTMLElement>('[data-speed]').forEach(el => {
        const speedAttr = el.getAttribute('data-speed')
        const state = getState(el)
        const elH = el.offsetHeight
        const elCenterBase = state.baseTop + elH / 2
        const viewCenter = scrollY + viewH / 2
        const dist = viewCenter - elCenterBase

        if (speedAttr === 'auto') {
          const parent = el.parentElement
          if (!parent) return
          const maxMove = el.offsetHeight - parent.offsetHeight
          if (maxMove <= 0) return
          const parentCenterBase = (parent.getBoundingClientRect().top + scrollY) + parent.offsetHeight / 2
          const parentDist = viewCenter - parentCenterBase
          const travelRange = viewH / 2 + parent.offsetHeight / 2
          const ratio = Math.max(-1, Math.min(1, parentDist / travelRange))
          el.style.transform = `translateY(${ratio * maxMove * 0.5}px)`
        } else {
          const speed = parseFloat(speedAttr ?? '1')
          const offset = dist * (1 - speed)
          el.style.transform = `translateY(${offset}px)`
        }
        el.style.willChange = 'transform'
      })

      // --- data-lag ---
      document.querySelectorAll<HTMLElement>('[data-lag]').forEach(el => {
        const lag = parseFloat(el.getAttribute('data-lag') ?? '0')
        const state = getState(el)
        // lerp toward current scroll
        const factor = Math.max(0.02, Math.min(0.98, 1 - lag * 5))
        state.lagY += (scrollY - state.lagY) * factor
        const diff = scrollY - state.lagY
        el.style.transform = `translateY(${diff * 0.12}px)`
        el.style.willChange = 'transform'
      })

      rafId = requestAnimationFrame(tick)
    }

    rafId = requestAnimationFrame(tick)

    // Recalculate base positions on resize
    const onResize = () => {
      document.querySelectorAll<HTMLElement>('[data-speed],[data-lag]').forEach(el => {
        stateMap.delete(el)
      })
    }
    window.addEventListener('resize', onResize)

    return () => {
      cancelAnimationFrame(rafId)
      window.removeEventListener('resize', onResize)
      document.querySelectorAll<HTMLElement>('[data-speed],[data-lag]').forEach(el => {
        el.style.transform = ''
        el.style.willChange = ''
      })
    }
  }, [])
}
