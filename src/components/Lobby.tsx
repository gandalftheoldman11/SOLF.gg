import { useEffect, useState } from 'react'
import { Wordmark } from './Logo'
import golfBall from "@/imports/Golf_Ball_PNG_Clipart.png"

type TierState = 'default' | 'searching' | 'disabled'

const TIERS = [
  { stake: 0.01, win: 0.019 },
  { stake: 0.05, win: 0.095 },
  { stake: 0.1, win: 0.19 },
  { stake: 0.5, win: 0.95 },
  { stake: 1.0, win: 1.9 },
]

const BALANCE = 1.245

type Match = { result: 'won' | 'lost' | 'draw'; stake: number; delta: number }
const MATCHES: Match[] = [
  { result: 'won', stake: 0.1, delta: 0.086 },
  { result: 'lost', stake: 0.1, delta: -0.1 },
  { result: 'won', stake: 0.05, delta: 0.043 },
  { result: 'draw', stake: 0.05, delta: 0 },
  { result: 'won', stake: 0.5, delta: 0.43 },
  { result: 'lost', stake: 0.01, delta: -0.01 },
  { result: 'won', stake: 0.1, delta: 0.086 },
  { result: 'lost', stake: 0.5, delta: -0.5 },
]

function fmt(n: number, d = 4) {
  return n.toFixed(d)
}

export default function Lobby({
  onDisconnect,
  onDeposit,
  onWithdraw,
  onPractice,
  onTooPoor,
  onMatchFound,
}: {
  onDisconnect: () => void
  onDeposit: () => void
  onWithdraw: () => void
  onPractice: () => void
  onTooPoor: () => void
  onMatchFound: () => void
}) {
  const [searching, setSearching] = useState<number | null>(null)

  // Simulated matchmaking — once searching, pair the player after a short wait.
  useEffect(() => {
    if (searching === null) return
    const t = setTimeout(() => {
      setSearching(null)
      onMatchFound()
    }, 2200)
    return () => clearTimeout(t)
  }, [searching, onMatchFound])

  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* decorative golf balls */}
      <img
        src={golfBall}
        alt=""
        aria-hidden
        className="pointer-events-none select-none absolute -right-14 top-[16%] w-[440px] opacity-25"
        style={{ filter: 'brightness(0.9) drop-shadow(0 0 40px rgba(68,239,20,0.18))', transform: 'rotate(25deg)' }}
      />
      <img
        src={golfBall}
        alt=""
        aria-hidden
        className="pointer-events-none select-none absolute -bottom-16 -left-10 w-[280px] opacity-20"
        style={{ filter: 'brightness(0.85) drop-shadow(0 0 24px rgba(68,239,20,0.12))', transform: 'rotate(-8deg)' }}
      />
      {/* top bar */}
      <header className="sticky top-0 z-20 border-b border-line bg-bg/85 backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-6 py-3.5">
          <Wordmark />
          <div className="hidden items-center gap-5 font-mono text-[11px] uppercase tracking-[0.14em] text-dim md:flex">
            <Stat label="online" value="1,284" dot />
            <Stat label="live" value="37" />
            <Stat label="balance" value={`${fmt(BALANCE)} SOL`} highlight />
          </div>
          <button
            onClick={onDisconnect}
            className="rounded-lg border border-line bg-panel px-3 py-2 font-mono text-[11px] uppercase tracking-[0.14em] text-dim transition hover:border-red hover:text-red"
          >
            84jn…HkV8 · disconnect
          </button>
        </div>
      </header>

      <main className="mx-auto grid max-w-6xl items-stretch gap-6 px-6 py-8 lg:grid-cols-[1.4fr_1fr]">
        {/* LEFT: stake tiers */}
        <section>
          <SectionTitle>stake tiers</SectionTitle>
          <div className="overflow-hidden rounded-2xl surface">
            <div className="grid grid-cols-[1fr_1fr_auto] gap-4 border-b border-line px-5 py-2.5 font-mono text-[10px] uppercase tracking-[0.18em] text-dim">
              <span>stake</span>
              <span>win</span>
              <span className="text-right">action</span>
            </div>
            {TIERS.map((t) => {
              const affordable = t.stake <= BALANCE
              const state: TierState = !affordable ? 'disabled' : searching === t.stake ? 'searching' : 'default'
              return (
                <TierRow
                  key={t.stake}
                  stake={t.stake}
                  win={t.win}
                  state={state}
                  onClick={() => {
                    if (state === 'disabled') return onTooPoor()
                    setSearching((s) => (s === t.stake ? null : t.stake))
                  }}
                />
              )
            })}
          </div>

          <div className="mt-6">
            <SectionTitle>recent matches</SectionTitle>
            <div className="rounded-2xl surface">
              {MATCHES.length === 0 ? (
                <div className="px-5 py-10 text-center font-mono text-[12px] uppercase tracking-[0.16em] text-dim">
                  no matches yet
                </div>
              ) : (
                <ul className="divide-y divide-line/70">
                  {MATCHES.map((m, i) => (
                    <MatchRow key={i} m={m} />
                  ))}
                </ul>
              )}
            </div>
          </div>
        </section>

        {/* RIGHT: balance + practice */}
        <aside className="flex flex-col gap-6">
          <div className="rounded-2xl surface p-5">
            <SectionTitle>balance</SectionTitle>
            <div className="font-display text-[38px] font-bold leading-none tnum text-fg">
              {fmt(BALANCE)} <span className="text-[18px] text-dim">SOL</span>
            </div>
            <div className="mt-3 flex items-center justify-between rounded-lg border border-line bg-panel px-3 py-2">
              <span className="font-mono text-[11px] uppercase tracking-[0.14em] text-dim">locked in match</span>
              <span className="font-mono tnum text-[13px] text-gold">0.1000 SOL</span>
            </div>
            <div className="mt-3 grid grid-cols-2 gap-3">
              <button
                onClick={onDeposit}
                className="btn-brand rounded-xl py-3 font-display text-[13px] font-bold tracking-wide hover:btn-brand-hover active:scale-[0.99]"
              >
                DEPOSIT
              </button>
              <button
                onClick={onWithdraw}
                className="rounded-xl border border-line bg-panel py-3 font-display text-[13px] font-semibold tracking-wide text-fg transition hover:border-dim"
              >
                WITHDRAW
              </button>
            </div>
          </div>

          <div className="rounded-2xl surface p-5">
            <SectionTitle>record</SectionTitle>
            <div className="flex items-center gap-4 font-display text-[20px] font-bold tnum">
              <span className="text-brand">12W</span>
              <span className="text-dim">·</span>
              <span className="text-red">8L</span>
              <span className="text-dim">·</span>
              <span className="text-gold">1D</span>
            </div>
          </div>

          <div className="relative flex flex-1 flex-col overflow-hidden rounded-2xl surface p-5 field-grid">
            <SectionTitle>practice</SectionTitle>
            <p className="max-w-[26ch] text-[13px] leading-snug text-dim">
              Warm up on the same holes with no stake and no wallet.
            </p>
            <button
              onClick={onPractice}
              className="mt-auto w-full rounded-xl border border-brand/40 bg-brand/10 py-3 font-display text-[13px] font-bold tracking-wide text-brand transition hover:bg-brand/20"
            >
              START PRACTICE
            </button>
          </div>
        </aside>
      </main>
    </div>
  )
}

function Stat({ label, value, dot, highlight }: { label: string; value: string; dot?: boolean; highlight?: boolean }) {
  return (
    <span className="flex items-center gap-1.5">
      {dot && <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-brand" />}
      {label}
      <span className={`tnum ${highlight ? 'text-brand' : 'text-fg'}`}>{value}</span>
    </span>
  )
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <div className="mb-3 font-mono text-[11px] uppercase tracking-[0.2em] text-dim">{children}</div>
  )
}

function TierRow({
  stake,
  win,
  state,
  onClick,
}: {
  stake: number
  win: number
  state: TierState
  onClick: () => void
}) {
  const disabled = state === 'disabled'
  const searching = state === 'searching'
  return (
    <button
      onClick={onClick}
      className={`group grid w-full grid-cols-[1fr_1fr_auto] items-center gap-4 border-b border-line px-5 py-4 text-left transition last:border-b-0 ${
        disabled ? 'cursor-not-allowed opacity-55' : 'hover:bg-panel'
      } ${searching ? 'bg-brand/5' : ''}`}
    >
      <div className="flex items-center gap-3">
        <span
          className={`h-8 w-1 rounded-full ${
            disabled ? 'bg-line' : searching ? 'bg-brand animate-pulse' : 'bg-brand/40 group-hover:bg-brand'
          }`}
        />
        <span className="font-display text-[20px] font-bold tnum text-fg">{fmt(stake)}</span>
        <span className="font-mono text-[11px] text-dim">SOL</span>
      </div>
      <div className="font-mono text-[13px] tnum text-brand">
        {fmt(win)} <span className="text-[10px] text-dim">SOL</span>
      </div>
      <div className="justify-self-end">
        {disabled ? (
          <span className="flex items-center gap-1.5 rounded-lg border border-line px-3 py-2 font-mono text-[10px] uppercase tracking-[0.14em] text-dim">
            <span>◆</span> low balance
          </span>
        ) : searching ? (
          <span className="flex items-center gap-2 rounded-lg border border-brand/40 bg-brand/10 px-3 py-2 font-mono text-[10px] uppercase tracking-[0.14em] text-brand">
            <span className="h-1.5 w-1.5 animate-ping rounded-full bg-brand" />
            searching… (cancel)
          </span>
        ) : (
          <span className="btn-brand rounded-lg px-4 py-2 font-display text-[11px] font-bold uppercase tracking-[0.1em] group-hover:btn-brand-hover">
            play →
          </span>
        )}
      </div>
    </button>
  )
}

function MatchRow({ m }: { m: Match }) {
  const color = m.result === 'won' ? 'text-brand' : m.result === 'lost' ? 'text-red' : 'text-dim'
  const sign = m.delta > 0 ? `+${fmt(m.delta)}` : m.delta < 0 ? `−${fmt(Math.abs(m.delta))}` : '—'
  return (
    <li className="flex items-center justify-between px-5 py-3">
      <span className="flex items-center gap-3">
        <span className={`font-mono text-[11px] uppercase tracking-[0.14em] ${color}`}>{m.result}</span>
        <span className="font-mono text-[12px] text-dim">· {fmt(m.stake, 2)} SOL</span>
      </span>
      <span className={`font-mono tnum text-[13px] ${color}`}>{sign}</span>
    </li>
  )
}
