import { useRef, type CSSProperties } from 'react'

interface MarqueeProps {
  text: string
  speed?: number
  className?: string
}

export default function Marquee({ text, speed = 50, className = '' }: MarqueeProps) {
  const containerRef = useRef<HTMLDivElement>(null)

  const duration = text.length * (100 / speed)

  const keyframesStyle = `
    @keyframes marquee-scroll {
      0% { transform: translateX(0%); }
      100% { transform: translateX(-50%); }
    }
  `

  const trackStyle: CSSProperties = {
    display: 'inline-flex',
    whiteSpace: 'nowrap',
    animation: `marquee-scroll ${duration}s linear infinite`,
  }

  const separator = (
    <span className="mx-4 opacity-40" aria-hidden="true">
      •
    </span>
  )

  return (
    <div
      ref={containerRef}
      className={`overflow-hidden ${className}`}
      style={{ width: '100%' }}
      onMouseEnter={() => {
        if (containerRef.current) {
          const track = containerRef.current.querySelector<HTMLElement>('[data-marquee-track]')
          if (track) track.style.animationPlayState = 'paused'
        }
      }}
      onMouseLeave={() => {
        if (containerRef.current) {
          const track = containerRef.current.querySelector<HTMLElement>('[data-marquee-track]')
          if (track) track.style.animationPlayState = 'running'
        }
      }}
    >
      <style>{keyframesStyle}</style>
      <div data-marquee-track style={trackStyle}>
        <span>{text}</span>
        {separator}
        <span>{text}</span>
        {separator}
        <span>{text}</span>
        {separator}
        <span>{text}</span>
        {separator}
      </div>
    </div>
  )
}
