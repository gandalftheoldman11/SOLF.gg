import { useCallback, useEffect, useRef, useState } from 'react'
import CourseViewport from './CourseViewport'

type Result = 'win' | 'lose' | 'draw'
type Msg = { id: number; title: string; sub?: string }

// The power window that drops the ball in the cup. Miss it and you take another stroke.
const HOLE_LOW = 52
const HOLE_HIGH = 74

function scrim(extra = '') {
  return `glass ${extra}`
}

export default function Hud({
  onLeave,
  onWater,
  onFinish,
}: {
  onLeave: () => void
  onWater: () => void
  onFinish: (result: Result) => void
}) {
  const [clock, setClock] = useState(30)
  const [power, setPower] = useState(0)
  const [dragging, setDragging] = useState(false)
  const [msg, setMsg] = useState<Msg | null>({ id: 1, title: 'MATCH FOUND', sub: 'stake locked · 0.10 SOL' })

  const [hole, setHole] = useState(1)
  const [youTotal, setYouTotal] = useState(0)
  const [oppTotal, setOppTotal] = useState(0)
  const [youStrokes, setYouStrokes] = useState(0)
  const [finished, setFinished] = useState(false)

  const meterRef = useRef<HTMLDivElement>(null)
  const msgTimer = useRef<number | undefined>(undefined)

  const flash = useCallback((title: string, sub?: string) => {
    setMsg({ id: Date.now(), title, sub })
    window.clearTimeout(msgTimer.current)
    msgTimer.current = window.setTimeout(() => setMsg(null), 2200)
  }, [])

  // Shot clock — counts down, resets each stroke.
  useEffect(() => {
    if (finished) return
    const t = setInterval(() => setClock((c) => (c <= 0 ? 0 : c - 1)), 1000)
    return () => clearInterval(t)
  }, [finished])

  useEffect(() => () => window.clearTimeout(msgTimer.current), [])

  const putt = useCallback(
    (p: number) => {
      if (finished || p < 6) return
      setClock(30)
      const strokes = youStrokes + 1
      const holed = p >= HOLE_LOW && p <= HOLE_HIGH

      if (!holed) {
        setYouStrokes(strokes)
        if (p > HOLE_HIGH) {
          // Overhit into the hazard now and then, to exercise the toast.
          if (p > 90) onWater()
          flash('OVERHIT', `too hot · stroke ${strokes}`)
        } else {
          flash('SHORT', `left it short · stroke ${strokes}`)
        }
        return
      }

      // Holed out. Resolve the opponent for this hole and advance.
      const opp = 2 + Math.floor(Math.random() * 3)
      const newYou = youTotal + strokes
      const newOpp = oppTotal + opp
      setYouTotal(newYou)
      setOppTotal(newOpp)
      setYouStrokes(0)
      flash(strokes === 1 ? 'HOLE IN ONE' : 'HOLED', `you ${strokes} · opp ${opp}`)

      if (hole >= 3) {
        setFinished(true)
        const result: Result = newYou < newOpp ? 'win' : newYou > newOpp ? 'lose' : 'draw'
        window.setTimeout(() => onFinish(result), 1500)
      } else {
        window.setTimeout(() => setHole((h) => h + 1), 1200)
      }
    },
    [finished, youStrokes, youTotal, oppTotal, hole, flash, onFinish, onWater],
  )

  const clockState = clock <= 5 ? 'critical' : clock <= 10 ? 'warning' : 'normal'
  const clockColor =
    clockState === 'critical' ? 'text-red' : clockState === 'warning' ? 'text-gold' : 'text-fg'

  const pctFromEvent = (clientX: number) => {
    const rect = meterRef.current!.getBoundingClientRect()
    return Math.min(100, Math.max(0, ((clientX - rect.left) / rect.width) * 100))
  }

  return (
    <div
      className="relative h-full w-full select-none"
      onPointerMove={(e) => dragging && setPower(Math.round(pctFromEvent(e.clientX)))}
      onPointerUp={() => {
        if (!dragging) return
        setDragging(false)
        putt(power)
        setTimeout(() => setPower(0), 220)
      }}
      onPointerLeave={() => setDragging(false)}
    >
      <CourseViewport hole={hole as 1 | 2 | 3} />

      {/* HOLE INFO — top-left */}
      <div className={`absolute left-3 top-3 rounded-xl px-3 py-2 sm:left-5 sm:top-5 sm:px-4 sm:py-3 ${scrim()}`}>
        <div className="font-display text-[13px] font-bold tracking-wide text-fg sm:text-[15px]">
          {hole === 3 ? 'THE GAUNTLET' : hole === 2 ? 'ISLAND GREEN' : 'STRAIGHT SHOT'}
        </div>
        <div className="mt-0.5 font-mono text-[9px] uppercase tracking-[0.16em] text-dim sm:mt-1 sm:text-[11px] sm:tracking-[0.18em]">
          hole {hole} of 3 · par 3
        </div>
      </div>

      {/* SCOREBAR — top-center on desktop; drops below the corner row on mobile */}
      <div className={`absolute left-1/2 top-[68px] -translate-x-1/2 rounded-xl p-1 sm:top-5 sm:p-1.5 ${scrim()}`}>
        <div className="flex items-stretch gap-0.5 sm:gap-1">
          <ScoreCell label="YOU" score={youTotal} accent="var(--color-ball-you)" note={`+${youStrokes} this hole`} />
          <div className="flex flex-col items-center justify-center px-2 sm:px-3">
            <div className="font-mono text-[9px] uppercase tracking-[0.2em] text-dim sm:text-[10px]">hole</div>
            <div className="font-display text-[14px] font-bold text-brand tnum sm:text-[15px]">{hole}/3</div>
          </div>
          <ScoreCell label="OPP" score={oppTotal} accent="var(--color-ball-opp)" note="waiting" right />
        </div>
      </div>

      {/* SHOT CLOCK — top-right */}
      <div
        className={`absolute right-3 top-3 rounded-xl px-3 py-2 text-center sm:right-5 sm:top-5 sm:px-4 sm:py-3 ${scrim(
          clockState === 'critical' ? 'ring-red/60' : clockState === 'warning' ? 'ring-gold/50' : '',
        )}`}
        style={clockState === 'critical' ? { animation: 'pulse-crit 0.7s ease-in-out infinite' } : undefined}
      >
        <div className="font-mono text-[8px] uppercase tracking-[0.18em] text-dim sm:text-[10px] sm:tracking-[0.2em]">
          shot clock
        </div>
        <div className={`font-display text-[24px] font-bold leading-none tnum sm:text-[30px] ${clockColor}`}>
          {String(clock).padStart(2, '0')}
        </div>
      </div>

      {/* TRANSIENT MESSAGE — center */}
      {msg && (
        <div
          key={msg.id}
          className="pointer-events-none absolute left-1/2 top-[36%] z-10 -translate-x-1/2 -translate-y-1/2 text-center"
          style={{ animation: 'hud-pop 2.2s ease-out forwards' }}
        >
          <div
            className="font-display text-[clamp(38px,7vw,58px)] font-bold leading-none tracking-tight text-fg"
            style={{ textShadow: '0 4px 30px rgba(0,0,0,0.9), 0 0 46px rgba(124,255,107,0.28)' }}
          >
            {msg.title}
          </div>
          {msg.sub && (
            <div className="mt-2 font-mono text-[13px] uppercase tracking-[0.28em] text-brand/90">
              {msg.sub}
            </div>
          )}
        </div>
      )}

      {/* FORFEIT — bottom-left; lifts above the meter on mobile so they never overlap */}
      <button
        onClick={onLeave}
        className={`group absolute bottom-[104px] left-3 rounded-xl px-3 py-2 text-left transition sm:bottom-6 sm:left-6 sm:px-4 sm:py-3 ${scrim(
          'hover:ring-red/70',
        )}`}
      >
        <div className="hidden font-mono text-[10px] uppercase tracking-[0.2em] text-dim group-hover:text-red sm:block">
          give up the pot
        </div>
        <div className="font-display text-[13px] font-bold tracking-wide text-fg group-hover:text-red sm:text-[14px]">
          FORFEIT
        </div>
      </button>

      {/* POWER METER — bottom-center */}
      <div className="absolute bottom-4 left-1/2 w-[460px] max-w-[92vw] -translate-x-1/2 sm:bottom-6 sm:max-w-[84vw]">
        <div className="mb-2 flex items-center justify-between px-1">
          <span
            className="font-mono text-[10.5px] uppercase tracking-[0.18em] text-fg/75"
            style={{ textShadow: '0 2px 8px rgba(0,0,0,0.9)' }}
          >
            drag back from the ball · release to putt
          </span>
          <span
            className="font-display text-[13px] font-bold tnum"
            style={{
              color: power < 45 ? 'var(--color-brand)' : power < 72 ? 'var(--color-gold)' : 'var(--color-red)',
              textShadow: '0 2px 8px rgba(0,0,0,0.9)',
            }}
          >
            {power}%
          </span>
        </div>
        <div
          ref={meterRef}
          onPointerDown={(e) => {
            if (finished) return
            setDragging(true)
            setPower(Math.round(pctFromEvent(e.clientX)))
          }}
          className={`glass relative h-8 cursor-ew-resize overflow-hidden rounded-full p-[3px] ${
            finished ? 'opacity-50' : ''
          }`}
        >
          {/* inset track */}
          <div className="relative h-full w-full overflow-hidden rounded-full bg-black/45 shadow-[inset_0_2px_6px_rgba(0,0,0,0.6)]">
            {/* tick marks */}
            <div
              className="absolute inset-0 opacity-50"
              style={{
                backgroundImage:
                  'repeating-linear-gradient(90deg, transparent 0 calc(10% - 1px), rgba(255,255,255,0.14) calc(10% - 1px) 10%)',
              }}
            />
            {/* sweet-spot window */}
            <div
              className="absolute inset-y-0 z-10 bg-white/10 shadow-[inset_0_0_0_1px_rgba(255,255,255,0.35)]"
              style={{ left: `${HOLE_LOW}%`, width: `${HOLE_HIGH - HOLE_LOW}%` }}
            >
              <div className="absolute -top-[3px] left-1/2 h-1.5 w-1.5 -translate-x-1/2 rotate-45 bg-white/70" />
            </div>
            {/* fill */}
            <div
              className="absolute inset-y-0 left-0 rounded-full transition-[width,background,box-shadow] duration-75"
              style={{
                width: `${power}%`,
                background:
                  power < 45
                    ? '#7cff6b'
                    : power < 72
                      ? 'linear-gradient(90deg, #7cff6b 0%, #ffcc55 100%)'
                      : 'linear-gradient(90deg, #7cff6b 0%, #ffcc55 45%, #ff5f57 100%)',
                boxShadow: `0 0 18px ${power < 45 ? 'rgba(124,255,107,0.6)' : power < 72 ? 'rgba(255,204,85,0.55)' : 'rgba(255,95,87,0.6)'}`,
              }}
            >
              <div
                className="absolute inset-0 rounded-full opacity-60"
                style={{ background: 'linear-gradient(180deg, rgba(255,255,255,0.45), transparent 55%)' }}
              />
            </div>
            {/* knob riding the fill edge */}
            {power > 1 && (
              <div
                className="absolute top-1/2 z-20 h-6 w-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white shadow-[0_0_10px_rgba(255,255,255,0.8)]"
                style={{ left: `${power}%` }}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

function ScoreCell({
  label,
  score,
  accent,
  note,
  right,
}: {
  label: string
  score: number
  accent: string
  note: string
  right?: boolean
}) {
  return (
    <div
      className={`relative flex min-w-[80px] flex-col overflow-hidden rounded-lg px-2.5 py-1 sm:min-w-[110px] sm:px-3 sm:py-1.5 ${right ? 'items-end' : 'items-start'}`}
      style={{
        background: `linear-gradient(180deg, color-mix(in srgb, ${accent} 20%, transparent), color-mix(in srgb, ${accent} 6%, transparent))`,
        boxShadow: `inset 0 0 0 1px color-mix(in srgb, ${accent} 22%, transparent)`,
      }}
    >
      {/* team accent rule echoing the ball color */}
      <span
        className="absolute inset-x-0 top-0 h-[2px]"
        style={{ background: accent, boxShadow: `0 0 10px ${accent}` }}
      />
      <div className="flex items-center gap-1.5">
        <span className="h-2 w-2 rounded-full" style={{ background: accent, boxShadow: `0 0 8px ${accent}` }} />
        <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-dim">{label}</span>
      </div>
      <div
        className="font-display text-[21px] font-bold leading-none tnum sm:text-[26px]"
        style={{ color: accent, textShadow: `0 0 18px color-mix(in srgb, ${accent} 45%, transparent)` }}
      >
        {score}
      </div>
      <div className="truncate font-mono text-[8px] uppercase tracking-[0.1em] text-dim sm:text-[9px] sm:tracking-[0.12em]">
        {note}
      </div>
    </div>
  )
}
