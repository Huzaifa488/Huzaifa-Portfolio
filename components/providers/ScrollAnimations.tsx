'use client'

import { useEffect } from 'react'

/**
 * Mounts a single IntersectionObserver that adds 'is-revealed' to any
 * element carrying the class 'reveal', 'reveal-left', or 'reveal-right'.
 * Place once in the root layout — no render output.
 */
export function ScrollAnimations() {
  useEffect(() => {
    const targets = document.querySelectorAll<HTMLElement>(
      '.reveal, .reveal-left, .reveal-right'
    )

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-revealed')
            // once revealed, stop watching
            observer.unobserve(entry.target)
          }
        })
      },
      { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
    )

    targets.forEach((el) => observer.observe(el))

    return () => observer.disconnect()
  }, [])

  return null
}
