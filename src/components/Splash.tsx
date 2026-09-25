type Props = { onDone: () => void }

export function Splash({ onDone }: Props) {
  return (
    <div
      className="fixed inset-0 flex items-center justify-center bg-night animate-splash"
      onAnimationEnd={onDone}
    >
      <span className="font-title text-3xl font-semibold tracking-[0.3em] uppercase">
        Bannishcard
      </span>
    </div>
  )
}
