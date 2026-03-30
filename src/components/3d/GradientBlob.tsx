interface GradientBlobProps {
  className?: string
}

const keyframes = `
  @keyframes blob-morph {
    0%, 100% {
      border-radius: 60% 40% 30% 70% / 60% 30% 70% 40%;
    }
    25% {
      border-radius: 30% 60% 70% 40% / 50% 60% 30% 60%;
    }
    50% {
      border-radius: 50% 60% 30% 60% / 30% 70% 60% 40%;
    }
    75% {
      border-radius: 60% 30% 60% 40% / 70% 40% 50% 60%;
    }
  }
`

export default function GradientBlob({ className = '' }: GradientBlobProps) {
  return (
    <>
      <style>{keyframes}</style>
      <div
        className={`absolute pointer-events-none ${className}`}
        style={{
          width: '600px',
          height: '600px',
          background: 'linear-gradient(135deg, #f3f4f6, #e5e7eb)',
          filter: 'blur(80px)',
          opacity: 0.6,
          animation: 'blob-morph 12s ease-in-out infinite',
          borderRadius: '60% 40% 30% 70% / 60% 30% 70% 40%',
        }}
        aria-hidden="true"
      />
    </>
  )
}
