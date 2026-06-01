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
  lagVelocity?: number
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
          lagVelocity: 0,
        })
      }
      return stateMap.get(el)!
    }

    let rafId: number

    function tick() {
      const scrollY = window.scrollY
      const viewH = window.innerHeight

      // Process both speed and lag together on matching elements to prevent transform overwrites
      document.querySelectorAll<HTMLElement>('[data-speed],[data-lag]').forEach(el => {
        const speedAttr = el.getAttribute('data-speed')
        const lagAttr = el.getAttribute('data-lag')
        const state = getState(el)

        let speedOffset = 0
        if (speedAttr !== null) {
          const elH = el.offsetHeight
          const elCenterBase = state.baseTop + elH / 2
          const viewCenter = scrollY + viewH / 2
          const dist = viewCenter - elCenterBase

          if (speedAttr === 'auto') {
            const parent = el.parentElement
            if (parent) {
              const maxMove = el.offsetHeight - parent.offsetHeight
              if (maxMove > 0) {
                const parentCenterBase = (parent.getBoundingClientRect().top + scrollY) + parent.offsetHeight / 2
                const parentDist = viewCenter - parentCenterBase
                const travelRange = viewH / 2 + parent.offsetHeight / 2
                const ratio = Math.max(-1, Math.min(1, parentDist / travelRange))
                speedOffset = ratio * maxMove * 0.5
              }
            }
          } else {
            const speed = parseFloat(speedAttr ?? '1')
            speedOffset = dist * (1 - speed)
          }
        }

        let lagOffset = 0
        if (lagAttr !== null) {
          const lag = parseFloat(lagAttr ?? '0')
          
          // Enhanced Spring-Damper physics:
          // Slower spring (lower stiffness) & higher multiplier for higher lag value to preserve synchronization.
          // Card 1 (lag=0.08) -> stiffness ~0.186, damping ~0.81, multiplier ~0.42
          // Card 2 (lag=0.14) -> stiffness ~0.138, damping ~0.78, multiplier ~0.51
          // Card 3 (lag=0.20) -> stiffness ~0.090, damping ~0.75, multiplier ~0.60
          const stiffness = Math.max(0.04, 0.25 - lag * 0.8)
          const damping = Math.max(0.6, 0.85 - lag * 0.5)
          const multiplier = 0.3 + lag * 1.5

          if (state.lagVelocity === undefined) {
            state.lagVelocity = 0
          }

          const force = (scrollY - state.lagY) * stiffness
          state.lagVelocity = (state.lagVelocity + force) * damping
          state.lagY += state.lagVelocity

          const diff = scrollY - state.lagY
          lagOffset = diff * multiplier
        }

        el.style.transform = `translateY(${speedOffset + lagOffset}px)`
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
