Design the 3D minigolf course environment for "solf.golf" — a competitive 1v1 Solana-betting minigolf game rendered live in-browser. Style: low-poly, flat-shaded, stylized — not photorealistic. It needs to render cheaply in a browser and read instantly at a glance mid-match, since players are aiming and reacting under a shot clock.

CRITICAL — 3 elements are gameplay signals, not decoration. Get these unambiguous before anything else:
1. Your ball vs. opponent's ball: two clearly distinct hues, never two shades of the same color.
2. Water: must read as water instantly. It's a hazard — landing in it costs a stroke and can lose the match. If it reads as "just another decorative shape," the game feels broken to the player.
3. Bumpers vs. fairway: bumpers must visually pop hard against the grass. They're the core obstacle the hole is designed around — spotting them at a glance is the actual skill of the game. If they blend in, the game feels random instead of skill-based.

COURSE PALETTE (11 colors — replace all placeholders, keep each one's functional role):
- sky / fog: #070b08 — ambient background, sets overall mood/depth fade
- fairway: #2f6b3a — main playable grass surface
- rough: #24512c — slower/harder terrain bordering fairway
- wall: #3d4c43 — course boundary walls, side faces
- wall top: #536358 — top surface of boundary walls (needs to read as distinct from wall sides for depth)
- cup: #0a0f0c — the hole itself, should read as a clear void/target
- slope: #3f7d4d — angled terrain, a shade that still reads as "fairway family" but signals elevation change
- sand: #c8b070 — bunker/trap terrain, slows the ball
- bumper: #7cff6b — GAMEPLAY-CRITICAL, must pop against fairway (see rule 3)
- your ball: #ffffff — GAMEPLAY-CRITICAL, must be distinct from opponent ball (see rule 1)
- their ball: #6bb6ff — GAMEPLAY-CRITICAL, must be distinct from your ball (see rule 1)
- water: #2a6fb0 — LOCKED, do not recolor. GAMEPLAY-CRITICAL (see rule 2)

Lighting: single dominant light source consistent with the dark sky/fog tone — moody, low-key, not flat/overcast. Ball and cup should stay readable in both bright, sunlit fairway zones and shadowed wall zones — the game overlays HUD text on top of this scene, so avoid extreme blown-out highlights.

Camera: third-person following the ball / high-angle over-the-shoulder, or top-down orbit — whichever best keeps the ball, aim line, and cup simultaneously visible, since players drag directly on-screen to aim and putt.

THREE HOLES TO DESIGN (all par 3, all playable in under a shot clock):

1. STRAIGHT SHOT
Concept: an intro-difficulty hole. A direct, mostly linear fairway from tee to cup with minor rough at the edges, maybe one gentle slope or a single small sand trap for texture — but no hard obstacles. Should feel readable and confidence-building; this is likely the first hole a new player sees.

2. ISLAND GREEN
Concept: a green (the cup's landing area) surrounded or bordered by water, demanding a precise, committed shot rather than a safe rolling one. Fairway leads to a narrower approach with water flanking one or both sides of the final stretch — water must be unmistakable at the distance a player commits to their shot from.

3. THE GAUNTLET
Concept: the bumper-heavy hole — a corridor or winding path lined with bumpers the ball must be threaded between or bounced off deliberately. This is where the "spotting bumpers vs. fairway is the skill" rule matters most; bumper placement should reward reading the layout, not punish random bounces.

(Confirm these three concepts against actual hole geometry/collision design before finalizing — the source brief specifies names, par, and the color system, not full layouts.)

TECHNICAL NOTES:
- No custom modeling or hand-painted textures needed — the course is built from simple geometric primitives (planes, boxes, ramps) driven entirely by this color palette. Focus effort on color, lighting, and layout, not asset detail.
- Everything must stay legible under time pressure — avoid busy textures, noisy gradients, or low-contrast material choices anywhere near the ball, cup, water, or bumpers.
- Design for both a top-down concept/orthographic view (for internal review) and an in-game camera angle (for the actual HUD screenshot use case).
