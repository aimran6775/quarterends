import { motion, type Variants } from 'framer-motion'
import { useMemo, type ElementType } from 'react'

interface AnimatedTextProps {
  text: string
  className?: string
  delay?: number
  as?: ElementType
  mode?: 'char' | 'word'
}

const containerVariants: Variants = {
  hidden: {},
  visible: (delay: number) => ({
    transition: {
      staggerChildren: 0.03,
      delayChildren: delay,
    },
  }),
}

const charVariants: Variants = {
  hidden: {
    opacity: 0,
    y: 20,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.4,
      ease: [0.25, 0.1, 0.25, 1],
    },
  },
}

const wordContainerVariants: Variants = {
  hidden: {},
  visible: (delay: number) => ({
    transition: {
      staggerChildren: 0.08,
      delayChildren: delay,
    },
  }),
}

const wordVariants: Variants = {
  hidden: {
    opacity: 0,
    y: 20,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: [0.25, 0.1, 0.25, 1],
    },
  },
}

export default function AnimatedText({
  text,
  className = '',
  delay = 0,
  as: Tag = 'p',
  mode = 'char',
}: AnimatedTextProps) {
  const MotionTag = motion.create(Tag as keyof HTMLElementTagNameMap)

  const elements = useMemo(() => {
    if (mode === 'word') {
      return text.split(' ')
    }
    return text.split('')
  }, [text, mode])

  if (mode === 'word') {
    return (
      <MotionTag
        className={`${className}`}
        variants={wordContainerVariants}
        initial="hidden"
        animate="visible"
        custom={delay}
        style={{ display: 'flex', flexWrap: 'wrap', gap: '0.25em' }}
      >
        {elements.map((word, i) => (
          <motion.span key={`${word}-${i}`} variants={wordVariants} style={{ display: 'inline-block' }}>
            {word}
          </motion.span>
        ))}
      </MotionTag>
    )
  }

  return (
    <MotionTag
      className={`${className}`}
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      custom={delay}
      aria-label={text}
    >
      {elements.map((char, i) => (
        <motion.span
          key={`${char}-${i}`}
          variants={charVariants}
          style={{ display: 'inline-block', whiteSpace: char === ' ' ? 'pre' : 'normal' }}
          aria-hidden="true"
        >
          {char}
        </motion.span>
      ))}
    </MotionTag>
  )
}
