import { useState } from 'react'

function Shell({
  onClose,
  children,
  width = 'max-w-md',
}: {
  onClose: () => void
  children: React.ReactNode
  width?: string
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
      <div
        className={`surface relative w-full ${width} overflow-hidden rounded-2xl`}
      >
        {children}
      </div>
    </div>
  )
}

function Row({ label, value, strong }: { label: string; value: string; strong?: boolean }) {
  return (
    <div className="flex items-center justify-between py-2">
      <span className="font-mono text-[11px] uppercase tracking-[0.16em] text-dim">{label}</span>
      <span className={`font-mono tnum ${strong ? 'text-fg text-[15px] font-bold' : 'text-fg/90 text-[13px]'}`}>
        {value}
      </span>
    </div>
  )
}

/* ------------------------------------------------------------------ RESULT */

type ResultState = 'win' | 'lose' | 'draw'

const RESULT_COPY: Record<
  ResultState,
  { badge: string; accent: string; reason: string; delta: string }
> = {
  win: { badge: 'YOU WIN', accent: 'var(--color-brand)', reason: 'opponent ran out of strokes on hole 3', delta: '+0.0860 SOL' },
  lose: { badge: 'YOU LOSE', accent: 'var(--color-red)', reason: 'higher total across three holes', delta: '−0.1000 SOL' },
  draw: { badge: 'DRAW', accent: 'var(--color-gold)', reason: 'level after sudden death · stakes returned', delta: '— 0.0000 SOL' },
}

export function ResultModal({
  state,
  onClose,
  onRematch,
  onVerify,
}: {
  state: ResultState
  onClose: () => void
  onRematch: () => void
  onVerify: () => void
}) {
  const c = RESULT_COPY[state]
  return (
    <Shell onClose={onClose}>
      <div
        className="relative px-6 pb-5 pt-7 text-center"
        style={{ background: `radial-gradient(120% 80% at 50% 0%, color-mix(in srgb, ${c.accent} 18%, transparent), transparent 70%)` }}
      >
        <div className="font-mono text-[11px] uppercase tracking-[0.3em] text-dim">match complete</div>
        <div
          className="mt-2 font-display text-[46px] font-bold leading-none tracking-tight"
          style={{ color: c.accent, textShadow: `0 0 40px color-mix(in srgb, ${c.accent} 40%, transparent)` }}
        >
          {c.badge}
        </div>
        <div className="mt-2 text-[13px] text-dim">{c.reason}</div>
        <div className="mt-4 font-display text-[28px] font-bold tnum" style={{ color: c.accent }}>
          {c.delta}
        </div>
        <div className="mt-1 font-mono text-[11px] uppercase tracking-[0.2em] text-dim">
          final score · you 8 · opp {state === 'win' ? 11 : state === 'lose' ? 6 : 8}
        </div>
      </div>

      <div className="border-t border-line px-6 py-4">
        <Row label="stake" value="0.1000 SOL" />
        <Row label="pot" value="0.2000 SOL" />
        <Row label="rake (5%)" value="0.0100 SOL" />
        <div className="my-1 h-px bg-line" />
        <Row label="payout" value={c.delta} strong />
        <button
          onClick={onVerify}
          className="mt-3 inline-flex items-center gap-1.5 font-mono text-[11px] uppercase tracking-[0.16em] text-brand transition hover:underline"
        >
          verify this match ↗
        </button>
      </div>

      <div className="flex gap-3 border-t border-line p-4">
        <button onClick={onClose} className="flex-1 rounded-xl border border-line bg-panel py-3 font-display text-[13px] font-semibold tracking-wide text-fg transition hover:border-dim">
          LOBBY
        </button>
        <button onClick={onRematch} className="flex-1 btn-brand rounded-xl py-3 font-display text-[13px] font-bold tracking-wide hover:btn-brand-hover">
          REMATCH
        </button>
      </div>
    </Shell>
  )
}

/* ----------------------------------------------------------------- DEPOSIT */

export function DepositModal({ onClose, onCopy }: { onClose: () => void; onCopy: () => void }) {
  const address = '84jnKpZq7vT3mWx9RbYcH2sLfN6dQ8gUaEo1PkR5HkV8'
  const [copied, setCopied] = useState(false)
  const copy = async () => {
    try {
      await navigator.clipboard?.writeText(address)
    } catch {
      /* clipboard blocked in sandbox — still confirm to the user */
    }
    setCopied(true)
    onCopy()
    setTimeout(() => setCopied(false), 1800)
  }
  return (
    <Shell onClose={onClose}>
      <div className="border-b border-line px-6 py-4">
        <div className="font-display text-[18px] font-bold tracking-wide text-fg">DEPOSIT SOL</div>
        <div className="mt-1 text-[13px] text-dim">Send SOL to your personal game address.</div>
      </div>
      <div className="px-6 py-5">
        <div className="font-mono text-[11px] uppercase tracking-[0.16em] text-dim">your deposit address</div>
        <div className="mt-2 rounded-xl border border-line bg-bg p-3">
          <code className="block break-all font-mono text-[13px] leading-relaxed text-fg">{address}</code>
        </div>
        <button
          onClick={copy}
          className="mt-3 w-full btn-brand rounded-xl py-3 font-display text-[13px] font-bold tracking-wide hover:btn-brand-hover active:scale-[0.99]"
        >
          {copied ? 'COPIED ✓' : 'COPY ADDRESS'}
        </button>
        <p className="mt-3 font-mono text-[11px] leading-relaxed text-dim">
          minimum deposit 0.01 SOL · funds appear after 1 confirmation. sending any other token will be lost.
        </p>
      </div>
    </Shell>
  )
}

/* ---------------------------------------------------------------- WITHDRAW */

export function WithdrawModal({ onClose, onSuccess }: { onClose: () => void; onSuccess: () => void }) {
  const [addr, setAddr] = useState('')
  const [amount, setAmount] = useState('')
  const available = 1.245
  const addrErr = addr !== '' && addr.length < 32 ? 'address looks too short' : undefined
  const amountErr =
    amount !== '' && Number(amount) > available
      ? 'exceeds available balance'
      : amount !== '' && Number(amount) < 0.01
        ? 'below 0.01 minimum'
        : undefined
  const valid = addr.length >= 32 && !amountErr && amount !== ''

  return (
    <Shell onClose={onClose}>
      <div className="border-b border-line px-6 py-4">
        <div className="font-display text-[18px] font-bold tracking-wide text-fg">WITHDRAW SOL</div>
        <div className="mt-1 flex items-baseline gap-2 text-[13px] text-dim">
          available
          <span className="font-mono tnum text-fg">1.2450 SOL</span>
        </div>
      </div>
      <div className="space-y-4 px-6 py-5">
        <Field
          label="destination address"
          placeholder="paste a Solana address"
          value={addr}
          onChange={setAddr}
          error={addrErr}
          mono
        />
        <div>
          <Field
            label="amount"
            placeholder="0.0000"
            value={amount}
            onChange={setAmount}
            error={amountErr}
            suffix="SOL"
            mono
          />
          <button
            type="button"
            onClick={() => setAmount(available.toFixed(4))}
            className="mt-1.5 font-mono text-[10px] uppercase tracking-[0.16em] text-brand transition hover:underline"
          >
            max · {available.toFixed(4)} SOL
          </button>
        </div>
        <button
          disabled={!valid}
          onClick={onSuccess}
          className="w-full rounded-xl bg-brand py-3 font-display text-[13px] font-bold tracking-wide text-brand-ink transition enabled:hover:brightness-110 enabled:active:scale-[0.99] disabled:cursor-not-allowed disabled:bg-panel disabled:text-dim"
        >
          WITHDRAW
        </button>
        <p className="font-mono text-[11px] text-dim">network fee ~0.000005 SOL · minimum withdrawal 0.01 SOL</p>
      </div>
    </Shell>
  )
}

function Field({
  label,
  placeholder,
  value,
  onChange,
  error,
  suffix,
  mono,
}: {
  label: string
  placeholder: string
  value: string
  onChange: (v: string) => void
  error?: string
  suffix?: string
  mono?: boolean
}) {
  return (
    <label className="block">
      <span className="font-mono text-[11px] uppercase tracking-[0.16em] text-dim">{label}</span>
      <div
        className={`mt-1.5 flex items-center rounded-xl border bg-bg px-3 transition focus-within:border-brand ${
          error ? 'border-red' : 'border-line'
        }`}
      >
        <input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className={`w-full bg-transparent py-3 text-[14px] text-fg outline-none placeholder:text-dim/60 ${mono ? 'font-mono tnum' : ''}`}
        />
        {suffix && <span className="ml-2 font-mono text-[12px] text-dim">{suffix}</span>}
      </div>
      {error && <span className="mt-1 block font-mono text-[11px] text-red">{error}</span>}
    </label>
  )
}

/* -------------------------------------------------------------------- LEAVE */

export function LeaveModal({ onClose, onForfeit }: { onClose: () => void; onForfeit: () => void }) {
  return (
    <Shell onClose={onClose} width="max-w-sm">
      <div className="px-6 pb-2 pt-6 text-center">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-red/15 ring-1 ring-red/40">
          <span className="font-display text-[22px] font-bold text-red">!</span>
        </div>
        <div className="mt-4 font-display text-[20px] font-bold tracking-wide text-fg">LEAVE MATCH?</div>
        <p className="mt-2 text-[13px] leading-relaxed text-dim">
          Leaving now forfeits your <span className="text-fg">0.10 SOL</span> stake — the pot goes to your
          opponent. This can&apos;t be undone.
        </p>
      </div>
      <div className="flex flex-col gap-2.5 p-5">
        <button
          onClick={onClose}
          className="btn-brand w-full rounded-xl py-3 font-display text-[14px] font-bold tracking-wide hover:btn-brand-hover active:scale-[0.99]"
        >
          STAY IN MATCH
        </button>
        <button
          onClick={onForfeit}
          className="w-full rounded-xl border border-line py-2.5 font-mono text-[12px] uppercase tracking-[0.16em] text-dim transition hover:border-red hover:text-red"
        >
          forfeit &amp; leave
        </button>
      </div>
    </Shell>
  )
}
