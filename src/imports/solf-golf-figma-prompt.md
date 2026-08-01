Design the complete UI for "solf.golf" — a 1v1 Solana minigolf betting game. This is a website with a 3D game viewport embedded in it, not a game-first UI. Landing page, lobby, modals, and HUD are all standard web design (dark theme, crypto/gaming aesthetic). The 3D course itself is just recolored geometry — no custom art needed.

CRITICAL RULE — 3 colors carry gameplay meaning, get these right:
1. Your ball vs. opponent's ball — must be two clearly distinct hues (not two shades of one color). Currently white (#ffffff) vs. blue (#6bb6ff).
2. Water — must instantly read as water (locked at #2a6fb0). Landing in it costs a stroke.
3. Bumpers vs. fairway — bumpers (currently #7cff6b) must pop hard against the grass so they read as an obstacle, not decoration.
Everything else in the palette is fully open to redesign.

PALETTE TO DEFINE (22 colors total, replace all placeholders below, keep the same functional role for each):

Interface (11):
- brand #7cff6b
- brand-dim #3d7a35
- brand-ink #06210b
- bg #080b09
- bg2 (cards) #0e1310
- panel #121a15
- line #1f2c24
- fg (text) #d7e6dc
- dim (labels) #6d8578
- gold (warn) #ffcc55
- red (loss) #ff5f57

3D course (11):
- sky/fog #070b08
- fairway #2f6b3a
- rough #24512c
- wall #3d4c43
- wall top #536358
- cup #0a0f0c
- slope #3f7d4d
- sand #c8b070
- bumper #7cff6b (gameplay-critical, see rule #3)
- your ball #ffffff (gameplay-critical, see rule #1)
- their ball #6bb6ff (gameplay-critical, see rule #1)
- water #2a6fb0 — LOCKED, do not recolor, only reposition/restyle around it

Design both a dark and light theme, or commit fully to dark (current build is dark-only).

TYPOGRAPHY: one display face + one body face. Must be self-hostable as files (no Google Fonts / font CDN links — the site blocks external font requests).

---

SCREEN 1 — Landing & Connect (highest priority, design pixel-for-pixel at 1440×900 desktop and 390×844 mobile)
This is the marketing page at solf.golf and the screenshot people judge the game by in 3 seconds.
- Wordmark: "SOLF.GOLF"
- Tagline: "solana golf · 1v1 duels · winner takes the pot"
- Primary CTA: "CONNECT PHANTOM"
- Secondary CTA (equal visual weight, don't bury it): "PRACTICE — FREE / no wallet needed"
- "How it works" — 5 short lines:
  1. Both players stake the same amount and play the same 3 holes at once
  2. Lowest total strokes takes the pot · level scores go to sudden death
  3. Every hole comes from a seed committed before you play, revealed after
  4. Physics runs on the server — your client only sends aim and power
  5. Disconnecting mid-match forfeits after a grace period

SCREEN 2 — Lobby (where the money lives; two columns desktop, stacked mobile)
Top bar: wordmark, online count (1,284), live matches count (37), balance (1.245 SOL), DISCONNECT button.
Stake tiers table — 5 rows, each shows stake amount, win amount, and status. Design 4 interactive states per row:
- default: affordable & clickable, this is the main action on the screen
- hover
- queued/searching: "SEARCHING… (click to cancel)"
- disabled: balance too low, must read as "locked by funds" not "broken"
Recent matches list — up to 12 rows, right-aligned figures, format: "won · 0.10 SOL  +0.0860" / "lost · 0.10 SOL  −0.1000" / "draw · 0.05 SOL  —". Include an empty state: "no matches yet".
Balance panel: total balance, amount locked in active match, DEPOSIT + WITHDRAW buttons.
Practice panel: START PRACTICE button.
Record: "12W · 8L · 1D"

SCREEN 3 — In-Match HUD (overlay on fullscreen live 3D, center of screen must stay completely clear for aiming)
6 floating elements, all hugging edges:
- Hole info (top-left): hole name (max 13 chars, e.g. "STRAIGHT SHOT"), "hole 2 of 3 · par 3", sudden-death variant reads "SUDDEN DEATH"
- Scorebar (top-center): "YOU 3 | HOLE 2/3 | OPP 5", running totals below. Your side vs. their side need visually distinct treatment, ideally echoing the ball colors.
- Shot clock (top-right): counts 30→0, three states — normal / warning ≤10s / critical ≤5s (pulsing)
- Big transient message (center, appears ~2s then fades): variants include "MATCH FOUND", "HOLE IN ONE", "HOLED", "OPPONENT HOLED", "SUDDEN DEATH", "STROKE LIMIT", "YOU WIN THE HOLE", "HOLE TIED" — each with an optional smaller subtitle
- Power meter (bottom-center): fills 0–100% on drag, green→gold→red gradient so overhitting feels risky, includes hint text "drag back from the ball to aim · release to putt"
- Forfeit button (bottom-left): destructive, gives away the pot — should look reachable but not inviting/easy to misclick

All HUD text needs a scrim/panel/shadow treatment since it sits over bright fairway and dark walls interchangeably.

---

MODALS (4):
1. Match Result — 3 distinct states (WIN / LOSE / DRAW). Shows reason, amount won/lost, final score, stake, pot, rake, payout, a "verify this match" link, REMATCH + LOBBY buttons. This is the most emotional, most-screenshotted moment — give it as much polish as the landing page.
2. Deposit — shows personal deposit address (44-char Solana address, must wrap/scroll cleanly without breaking the layout), copy button, minimum deposit note.
3. Withdraw — available balance, destination address input, amount input, minimum note. Design label, default, focus, and error states for both fields.
4. Leave Match? — warns that leaving forfeits the stake. FORFEIT + STAY buttons — the destructive option (FORFEIT) must not be the visually easier/default click.

TOASTS: bottom-right, ~4s duration, 3 variants — info ("address copied"), warning ("water — back to where you hit it"), error ("not enough balance for this tier").

---

PRACTICAL CONSTRAINTS (design around these, don't let them break the layout):
- Numeric values change length: balances range 0.0100–1234.5678, scores are 1–2 digits, clock is 2 digits — none of this should reflow as numbers tick up/down.
- Wallet addresses are 44 characters, shown truncated as "84jn…HkV8" everywhere except the deposit modal (full string, readable, copyable).
- Mobile-first consideration: many players arrive via a phone link. Lobby stacks to a single column; the 3D game canvas is fullscreen on mobile.

DELIVERABLES TO PRODUCE:
- 22-color palette (named, hex values)
- Wordmark/logo: SVG, horizontal (top bar) + square (favicon/avatar)
- Type system: display + body, self-hostable files
- Landing page: 1440×900 desktop + 390×844 mobile, fully polished
- Match Result modal: all 3 states
- Full HUD: all 6 elements styled (positions are fixed, styling is open)
- Favicon: 32×32 and 180×180
- Social preview card: 1200×630
- X/social banner: 1500×500
