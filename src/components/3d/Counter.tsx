import { useEffect, useRef } from 'react'
import { useInView, useMotionValue, useSpring, motion } from 'framer-motion'

interface CounterProps {
  value: number
  duration?: number
  suffix?: string
  prefix?: string
  className?: string
}

function formatNumber(n: number): string {
  return Math.round(n).toLocaleString('en-US')
}

export default function Counter({
  value,
  duration = 2,
  suffix = '',
  prefix = '',
  className = '',
}: CounterProps) {
  const ref = useRef<HTMLSpanElement>(null)
  const isInView = useInView(ref, { once: true, amount: 0.5 })

  const motionValue = useMotionValue(0)
  const spring = useSpring(motionValue, {
    duration: duration * 1000,
    bounce: 0,
  })

  useEffect(() => {
    if (isInView) {
      motionValue.set(value)
    }
  }, [isInView, value, motionValue])

  useEffect(() => {
    const unsubscribe = spring.on('change', (latest) => {
      if (ref.current) {
        ref.current.textContent = `${prefix}${formatNumber(latest)}${suffix}`
      }
    })
    return unsubscribe
  }, [spring, prefix, suffix])

  return (
    <motion.span ref={ref} className={className}>
      {prefix}0{suffix}
    </motion.span>
  )
}
