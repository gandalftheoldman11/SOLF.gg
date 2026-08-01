// Stylized stand-in for the live 3D minigolf course. Pure CSS: low-poly, flat-shaded
// facets laid into a perspective-tilted field, driven entirely by the locked gameplay
// palette. Three holes matching the course brief — Straight Shot, Island Green, The
// Gauntlet — each keeping the three gameplay signals unambiguous: your ball (white) vs
// theirs (blue), water reads instantly as water, and bumpers pop hard off the grass.

type Hole = 1 | 2 | 3

// Every color the geometry draws with is sourced from the theme tokens (index.css) —
// hand over the eight environment hex codes there and the whole course recolors. The
// *Lit / *Dark tones are just tints derived from those same tokens, not new hexes.
const C = {
  sky: 'var(--color-sky)',
  fairway: 'var(--color-fairway)',
  fairwayLit: 'color-mix(in srgb, var(--color-fairway) 82%, white)',
  rough: 'var(--color-rough)',
  wall: 'var(--color-wall)',
  wallTop: 'var(--color-walltop)',
  cup: 'var(--color-cup)',
  slope: 'var(--color-slope)',
  sand: 'var(--color-sand)',
  bumper: 'var(--color-bumper)',
  water: 'var(--color-water)',
  waterLit: 'color-mix(in srgb, var(--color-water) 72%, white)',
  waterDark: 'color-mix(in srgb, var(--color-water) 78%, black)',
  ballYou: 'var(--color-ball-you)',
  ballOpp: 'var(--color-ball-opp)',
} as const

// A flat-shaded facet: a clip-path polygon filled with one color, with an optional
// darker inner edge to fake a beveled low-poly face.
function Facet({
  clip,
  fill,
  className = '',
  style,
  children,
}: {
  clip: string
  fill: string
  className?: string
  style?: React.CSSProperties
  children?: React.ReactNode
}) {
  return (
    <div
      className={`absolute inset-0 ${className}`}
      style={{ clipPath: clip, background: fill, ...style }}
    >
      {children}
    </div>
  )
}

// A boundary wall: a dark side face with a lighter top strip so it reads with depth.
function Wall({ style }: { style: React.CSSProperties }) {
  return (
    <div className="absolute" style={style}>
      <div className="absolute inset-0" style={{ background: C.wall }} />
      <div className="absolute inset-x-0 top-0 h-[3px]" style={{ background: C.wallTop }} />
    </div>
  )
}

function Bumper({ style, rot = 0 }: { style: React.CSSProperties; rot?: number }) {
  return (
    <div
      className="absolute rounded-full"
      style={{
        background: C.bumper,
        transform: `rotate(${rot}deg)`,
        boxShadow: `0 0 18px rgba(124,255,107,0.75), inset 0 -3px 0 rgba(0,0,0,0.28)`,
        ...style,
      }}
    />
  )
}

function Water({ style }: { style: React.CSSProperties }) {
  return (
    <div
      className="absolute"
      style={{
        background: `linear-gradient(150deg, ${C.waterLit}, ${C.water} 55%, ${C.waterDark})`,
        boxShadow: `inset 0 0 40px rgba(0,0,0,0.45), 0 0 30px rgba(42,111,176,0.4)`,
        ...style,
      }}
    >
      <div
        className="absolute inset-0 opacity-40"
        style={{
          background:
            'repeating-linear-gradient(112deg, transparent 0 9px, rgba(255,255,255,0.16) 9px 11px)',
        }}
      />
    </div>
  )
}

function Cup({ style }: { style: React.CSSProperties }) {
  return (
    <div className="absolute" style={style}>
      {/* flag */}
      <div className="absolute bottom-[70%] left-1/2 h-14 w-[2px] -translate-x-1/2 bg-fg/80">
        <div
          className="absolute left-[2px] top-0 h-3 w-5"
          style={{ background: C.bumper, clipPath: 'polygon(0 0, 100% 50%, 0 100%)' }}
        />
      </div>
      {/* cup void */}
      <div
        className="h-full w-full rounded-full"
        style={{ background: C.cup, boxShadow: 'inset 0 3px 5px rgba(0,0,0,0.8), 0 0 0 2px rgba(0,0,0,0.5)' }}
      />
    </div>
  )
}

function Ball({ style, color }: { style: React.CSSProperties; color: string }) {
  return (
    <div
      className="absolute rounded-full"
      style={{
        background: `radial-gradient(circle at 32% 28%, #fff, ${color} 70%)`,
        boxShadow: `0 0 14px color-mix(in srgb, ${color} 60%, transparent), 0 3px 4px rgba(0,0,0,0.5)`,
        ...style,
      }}
    />
  )
}

// ── HOLE 1 · STRAIGHT SHOT — a direct linear fairway, one gentle slope, a small trap ──
function StraightShot() {
  return (
    <>
      <Facet clip="polygon(30% 100%, 70% 100%, 62% 0, 38% 0)" fill={C.rough} />
      <Facet clip="polygon(34% 100%, 66% 100%, 60% 4%, 40% 4%)" fill={C.fairway}>
        <div
          className="absolute inset-0 opacity-30"
          style={{
            backgroundImage:
              'repeating-linear-gradient(0deg, transparent 0 34px, rgba(255,255,255,0.05) 34px 68px)',
          }}
        />
      </Facet>
      {/* gentle slope facet mid-fairway */}
      <Facet clip="polygon(40% 58%, 60% 58%, 58% 40%, 42% 40%)" fill={C.slope} />
      {/* small sand trap */}
      <div
        className="absolute left-[56%] top-[52%] h-[8%] w-[11%] rounded-[50%]"
        style={{ background: C.sand, boxShadow: 'inset 0 0 16px rgba(0,0,0,0.3)' }}
      />
      <Wall style={{ left: '34%', top: '4%', width: '5px', height: '96%', transform: 'skewX(6deg)' }} />
      <Wall style={{ right: '34%', top: '4%', width: '5px', height: '96%', transform: 'skewX(-6deg)' }} />
      <Cup style={{ left: '50%', top: '9%', width: '30px', height: '30px', marginLeft: '-15px' }} />
      <Ball style={{ left: '46%', top: '82%', width: '18px', height: '18px' }} color={C.ballYou} />
      <Ball style={{ left: '55%', top: '74%', width: '16px', height: '16px' }} color={C.ballOpp} />
    </>
  )
}

// ── HOLE 2 · ISLAND GREEN — a green ringed by water, demanding a committed shot ──
function IslandGreen() {
  return (
    <>
      <Facet clip="polygon(24% 100%, 76% 100%, 68% 0, 32% 0)" fill={C.rough} />
      {/* teeing fairway strip up to the water gap */}
      <Facet clip="polygon(40% 100%, 60% 100%, 57% 62%, 43% 62%)" fill={C.fairway} />
      {/* the moat of water flanking the approach */}
      <Water style={{ left: '26%', top: '10%', width: '48%', height: '52%', borderRadius: '14% 14% 40% 40%' }} />
      {/* the island green itself, floating in the water */}
      <div
        className="absolute left-1/2 top-[14%] h-[34%] w-[30%] -translate-x-1/2 rounded-[46%]"
        style={{ background: C.fairwayLit, boxShadow: `0 0 0 5px ${C.rough}, 0 8px 20px rgba(0,0,0,0.5)` }}
      >
        <div className="absolute inset-0 rounded-[46%]" style={{ boxShadow: `inset 0 0 24px rgba(0,0,0,0.25)` }} />
      </div>
      <Cup style={{ left: '50%', top: '20%', width: '28px', height: '28px', marginLeft: '-14px' }} />
      <Ball style={{ left: '48%', top: '86%', width: '18px', height: '18px' }} color={C.ballYou} />
      <Ball style={{ left: '52%', top: '25%', width: '16px', height: '16px' }} color={C.ballOpp} />
    </>
  )
}

// ── HOLE 3 · THE GAUNTLET — a corridor lined with bumpers to thread ──
function Gauntlet() {
  return (
    <>
      <Facet clip="polygon(28% 100%, 72% 100%, 64% 0, 36% 0)" fill={C.rough} />
      <Facet clip="polygon(37% 100%, 63% 100%, 58% 3%, 42% 3%)" fill={C.fairway}>
        <div
          className="absolute inset-0 opacity-30"
          style={{
            backgroundImage:
              'repeating-linear-gradient(0deg, transparent 0 30px, rgba(255,255,255,0.05) 30px 60px)',
          }}
        />
      </Facet>
      <Wall style={{ left: '37%', top: '3%', width: '5px', height: '97%', transform: 'skewX(5deg)' }} />
      <Wall style={{ right: '37%', top: '3%', width: '5px', height: '97%', transform: 'skewX(-5deg)' }} />
      {/* staggered gauntlet of bumpers */}
      <Bumper style={{ left: '42%', top: '72%', width: '80px', height: '15px' }} rot={-18} />
      <Bumper style={{ right: '42%', top: '58%', width: '76px', height: '14px' }} rot={22} />
      <Bumper style={{ left: '43%', top: '44%', width: '64px', height: '13px' }} rot={-26} />
      <Bumper style={{ right: '44%', top: '30%', width: '58px', height: '12px' }} rot={30} />
      <Cup style={{ left: '50%', top: '12%', width: '28px', height: '28px', marginLeft: '-14px' }} />
      <Ball style={{ left: '47%', top: '84%', width: '18px', height: '18px' }} color={C.ballYou} />
      <Ball style={{ left: '53%', top: '78%', width: '16px', height: '16px' }} color={C.ballOpp} />
    </>
  )
}

export default function CourseViewport({ hole = 1 }: { hole?: Hole }) {
  return (
    <div className="absolute inset-0 overflow-hidden" style={{ background: C.sky }}>
      {/* sky / fog — moody low-key ambient with a single dominant glow */}
      <div
        className="absolute inset-0"
        style={{
          background: `radial-gradient(120% 90% at 50% 4%, #133a20 0%, #0a1a11 44%, ${C.sky} 80%)`,
        }}
      />

      {/* the field, raked into perspective — enlarged and centered so the course fills
          the viewport, then the hole geometry is scaled up around its center */}
      <div
        className="absolute left-1/2 bottom-[-14%] h-[118%] w-[172%]"
        style={{
          transform: 'translateX(-50%) perspective(1150px) rotateX(56deg)',
          transformOrigin: 'bottom center',
        }}
      >
        <div
          className="absolute inset-0"
          style={{ transform: 'scale(1.3)', transformOrigin: '50% 46%' }}
        >
          {hole === 2 ? <IslandGreen /> : hole === 3 ? <Gauntlet /> : <StraightShot />}
        </div>
      </div>

      {/* aim-line ghost trailing from the player ball */}
      <div className="absolute left-1/2 top-[64%] h-[2px] w-44 -translate-x-1/2 rotate-[-6deg]">
        <div
          className="h-full w-full"
          style={{ background: 'linear-gradient(90deg, rgba(255,255,255,0.75), transparent)' }}
        />
      </div>

      {/* vignette to seat the HUD chrome */}
      <div
        className="absolute inset-0"
        style={{
          background: 'radial-gradient(120% 100% at 50% 42%, transparent 52%, rgba(3,6,4,0.74) 100%)',
        }}
      />
    </div>
  )
}
