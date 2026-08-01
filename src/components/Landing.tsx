import { Wordmark } from './Logo'
import solfTitle from "@/imports/solftitle.png"
import golfBall from "@/imports/Golf_Ball_PNG_Clipart.png"

const STEPS = [
  'Both players stake the same amount and play the same 3 holes at once',
  'Lowest total strokes takes the pot · level scores go to sudden death',
  'Every hole comes from a seed committed before you play, revealed after',
  'Physics runs on the server — your client only sends aim and power',
  'Disconnecting mid-match forfeits after a grace period',
]

export default function Landing({
  onConnect,
  onPractice,
}: {
  onConnect: () => void
  onPractice: () => void
}) {
  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* ground glow */}
      <div
        className="pointer-events-none absolute inset-0 field-grid"
        style={{ maskImage: 'radial-gradient(120% 80% at 50% 40%, #000 40%, transparent 85%)' }}
      />
      <div
        className="pointer-events-none absolute left-1/2 top-[-20%] h-[70vh] w-[70vh] -translate-x-1/2 rounded-full opacity-40 blur-[120px]"
        style={{ background: 'radial-gradient(circle, #1a5c2a, transparent 70%)' }}
      />

      {/* decorative golf balls */}
      <img
        src={golfBall}
        alt=""
        aria-hidden
        className="pointer-events-none select-none absolute -bottom-20 -right-10 w-[500px] opacity-30"
        style={{ filter: 'brightness(0.9) drop-shadow(0 0 40px rgba(68,239,20,0.18))', transform: 'rotate(18deg)' }}
      />
      <img
        src={golfBall}
        alt=""
        aria-hidden
        className="pointer-events-none select-none absolute -left-10 top-[26%] w-[240px] opacity-20"
        style={{ filter: 'brightness(0.85) drop-shadow(0 0 24px rgba(68,239,20,0.12))', transform: 'rotate(-12deg)' }}
      />

      <header className="relative mx-auto flex max-w-6xl items-center justify-between px-6 py-6">
        <Wordmark />
        <div className="hidden items-center gap-2 rounded-full border border-line bg-bg2/60 px-3 py-1.5 sm:flex">
          <span className="h-2 w-2 animate-pulse rounded-full bg-brand" />
          <span className="font-mono text-[11px] uppercase tracking-[0.16em] text-dim">
            1,284 online
          </span>
        </div>
      </header>

      <main className="relative mx-auto max-w-6xl px-6 pb-24 pt-10 md:pt-20">
        <div className="grid items-center gap-14 md:grid-cols-[1.1fr_0.9fr]">
          {/* left: hero */}
          <div>
            <div className="flex justify-center md:justify-start"><div className="inline-flex items-center gap-2 rounded-full border border-brand/25 bg-brand/5 px-3 py-1">
              <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-brand">
                provably-fair · on-chain
              </span>
            </div></div>
            <h1 className="mt-5 flex justify-center md:justify-start">
              <img
                src={solfTitle}
                alt="SOLF.GG"
                className="h-[72px] w-auto object-contain md:h-[100px]"
              />
            </h1>
            <p className="mt-4 max-w-md text-center font-mono text-[13px] uppercase tracking-[0.22em] text-dim md:text-left md:text-[14px]">
              solana golf · 1v1 duels · winner takes the pot
            </p>

            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <button
                onClick={onConnect}
                className="btn-brand group relative flex-1 overflow-hidden rounded-xl px-6 py-4 font-display text-[15px] font-bold tracking-wide hover:btn-brand-hover active:scale-[0.99]"
              >
                <span className="relative z-10">CONNECT PHANTOM</span>
                <span className="absolute inset-y-0 -left-1/3 w-1/3 skew-x-[-20deg] bg-white/30 group-hover:[animation:sheen_0.8s_ease]" />
              </button>
              <button
                onClick={onPractice}
                className="flex-1 rounded-xl border border-line bg-bg2 px-6 py-4 text-left font-display transition hover:border-brand/50"
              >
                <span className="block text-[15px] font-bold tracking-wide text-fg">PRACTICE</span>
                <span className="block font-mono text-[10px] uppercase tracking-[0.16em] text-dim">
                  free / no wallet needed
                </span>
              </button>
            </div>

            <div className="mt-6 flex items-center gap-6 font-mono text-[11px] uppercase tracking-[0.16em] text-dim">
              <span><span className="text-fg">37</span> live matches</span>
              <span className="h-3 w-px bg-line" />
              <span><span className="text-fg">5%</span> rake</span>
              <span className="h-3 w-px bg-line" />
              <span><span className="text-fg">3</span> holes / duel</span>
            </div>
          </div>

          {/* right: how it works */}
          <div className="surface rounded-2xl p-6">
            <div className="font-mono text-[11px] uppercase tracking-[0.2em] text-dim">
              how it works
            </div>
            <ol className="mt-4 space-y-4">
              {STEPS.map((s, i) => (
                <li key={i} className="flex gap-3">
                  <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-md border border-line bg-panel font-mono text-[12px] font-bold text-brand">
                    {i + 1}
                  </span>
                  <span className="font-body text-[13px] leading-snug tracking-[0.01em] text-fg/80">{s}</span>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </main>

      <footer className="relative mx-auto max-w-6xl px-6 pb-8 font-mono text-[11px] uppercase tracking-[0.16em] text-dim">
        solf.golf · duels settle on solana · play responsibly
      </footer>
    </div>
  )
}
