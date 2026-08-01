import { useCallback, useState } from 'react'
import Landing from './components/Landing'
import Lobby from './components/Lobby'
import Hud from './components/Hud'
import { DepositModal, LeaveModal, ResultModal, WithdrawModal } from './components/Modals'

type Screen = 'landing' | 'lobby' | 'hud'
type Modal =
  | { kind: 'result'; state: 'win' | 'lose' | 'draw' }
  | { kind: 'deposit' }
  | { kind: 'withdraw' }
  | { kind: 'leave' }
  | null
type Toast = { id: number; variant: 'info' | 'warning' | 'error'; text: string }

const TOAST_STYLES = {
  info: { ring: 'ring-line', accent: 'bg-brand', label: 'text-brand' },
  warning: { ring: 'ring-gold/50', accent: 'bg-gold', label: 'text-gold' },
  error: { ring: 'ring-red/60', accent: 'bg-red', label: 'text-red' },
} as const

export default function App() {
  const [screen, setScreen] = useState<Screen>('landing')
  const [modal, setModal] = useState<Modal>(null)
  const [toasts, setToasts] = useState<Toast[]>([])
  const [navOpen, setNavOpen] = useState(true)

  const toast = useCallback((variant: Toast['variant'], text: string) => {
    const id = Date.now() + Math.random()
    setToasts((t) => [...t.slice(-3), { id, variant, text }])
    setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 4000)
  }, [])

  const dismissToast = (id: number) => setToasts((t) => t.filter((x) => x.id !== id))

  return (
    <div className="relative min-h-screen bg-bg text-fg">
      {/* ── demo chrome: collapsible left-edge rail (kept clear of HUD elements) ── */}
      <div className="fixed left-3 top-1/2 z-[80] flex -translate-y-1/2 flex-col items-start gap-2">
        <button
          onClick={() => setNavOpen((o) => !o)}
          aria-label="toggle preview navigator"
          className="flex h-8 w-8 items-center justify-center rounded-lg border border-line bg-bg2/90 font-mono text-[13px] text-dim backdrop-blur-md transition hover:text-brand"
        >
          {navOpen ? '‹' : '›'}
        </button>
        {navOpen && (
          <nav className="flex flex-col gap-1 rounded-xl border border-line bg-bg2/90 p-1.5 shadow-[0_12px_40px_rgba(0,0,0,0.6)] backdrop-blur-md">
            <span className="px-2 pb-1 pt-0.5 font-mono text-[8px] uppercase tracking-[0.22em] text-dim/60">
              screens
            </span>
            {(['landing', 'lobby', 'hud'] as Screen[]).map((s) => (
              <button
                key={s}
                onClick={() => setScreen(s)}
                className={`rounded-lg px-3 py-1.5 text-left font-mono text-[10px] uppercase tracking-[0.14em] transition ${
                  screen === s ? 'bg-brand text-brand-ink' : 'text-dim hover:bg-panel hover:text-fg'
                }`}
              >
                {s}
              </button>
            ))}
            <span className="mt-1 border-t border-line px-2 pb-1 pt-2 font-mono text-[8px] uppercase tracking-[0.22em] text-dim/60">
              modals
            </span>
            {(
              [
                ['win', () => setModal({ kind: 'result', state: 'win' })],
                ['lose', () => setModal({ kind: 'result', state: 'lose' })],
                ['draw', () => setModal({ kind: 'result', state: 'draw' })],
                ['deposit', () => setModal({ kind: 'deposit' })],
                ['withdraw', () => setModal({ kind: 'withdraw' })],
                ['leave', () => setModal({ kind: 'leave' })],
              ] as [string, () => void][]
            ).map(([label, fn]) => (
              <button
                key={label}
                onClick={fn}
                className="rounded-lg px-3 py-1.5 text-left font-mono text-[10px] uppercase tracking-[0.14em] text-dim transition hover:bg-panel hover:text-fg"
              >
                {label}
              </button>
            ))}
          </nav>
        )}
      </div>

      {screen === 'landing' && (
        <Landing onConnect={() => setScreen('lobby')} onPractice={() => setScreen('hud')} />
      )}

      {screen === 'lobby' && (
        <Lobby
          onDisconnect={() => setScreen('landing')}
          onDeposit={() => setModal({ kind: 'deposit' })}
          onWithdraw={() => setModal({ kind: 'withdraw' })}
          onPractice={() => setScreen('hud')}
          onTooPoor={() => toast('error', 'not enough balance for this tier')}
          onMatchFound={() => {
            toast('info', 'match found — 0.10 SOL staked')
            setScreen('hud')
          }}
        />
      )}

      {screen === 'hud' && (
        <div className="fixed inset-0">
          <Hud
            onLeave={() => setModal({ kind: 'leave' })}
            onWater={() => toast('warning', 'water — back to where you hit it')}
            onFinish={(state) => setModal({ kind: 'result', state })}
          />
        </div>
      )}

      {/* ── MODALS ── */}
      {modal?.kind === 'result' && (
        <ResultModal
          state={modal.state}
          onClose={() => {
            setModal(null)
            setScreen('lobby')
          }}
          onRematch={() => {
            setModal(null)
            setScreen('hud')
          }}
          onVerify={() => toast('info', 'opening match proof on solscan')}
        />
      )}
      {modal?.kind === 'deposit' && (
        <DepositModal onClose={() => setModal(null)} onCopy={() => toast('info', 'address copied')} />
      )}
      {modal?.kind === 'withdraw' && (
        <WithdrawModal
          onClose={() => setModal(null)}
          onSuccess={() => {
            setModal(null)
            toast('info', 'withdrawal submitted')
          }}
        />
      )}
      {modal?.kind === 'leave' && (
        <LeaveModal
          onClose={() => setModal(null)}
          onForfeit={() => {
            setModal(null)
            setScreen('lobby')
            toast('warning', 'you forfeited the match')
          }}
        />
      )}

      {/* ── TOASTS — bottom-right ── */}
      <div className="fixed bottom-4 right-4 z-[90] flex w-[320px] max-w-[86vw] flex-col gap-2">
        {toasts.map((t) => {
          const s = TOAST_STYLES[t.variant]
          return (
            <button
              key={t.id}
              onClick={() => dismissToast(t.id)}
              className={`flex w-full items-center gap-3 overflow-hidden rounded-xl border border-line bg-bg2/95 py-3 pl-1 pr-4 text-left shadow-[0_16px_40px_rgba(0,0,0,0.55)] ring-1 backdrop-blur-md transition hover:brightness-110 ${s.ring}`}
              style={{ animation: 'toast-in 0.22s cubic-bezier(0.2,0.8,0.2,1)' }}
            >
              <span className={`h-9 w-1 shrink-0 rounded-full ${s.accent}`} />
              <div className="min-w-0">
                <div className={`font-mono text-[10px] uppercase tracking-[0.18em] ${s.label}`}>
                  {t.variant}
                </div>
                <div className="truncate text-[13px] text-fg">{t.text}</div>
              </div>
            </button>
          )
        })}
      </div>
    </div>
  )
}
