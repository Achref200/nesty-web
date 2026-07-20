# Nesty — Design System & Brand Brief

A one-stop reference for building the landing page, the agency workspace, and
the mobile app, plus ready-to-paste prompts for AI image generators
(Midjourney, DALL·E, Imagen, Firefly, Stable Diffusion) when producing
flyers, posters, affiches, logo variants, and marketing assets.

All tokens on this page are lifted verbatim from
[tailwind.config.ts](tailwind.config.ts) and
[src/app/globals.css](src/app/globals.css) — they are the real, shipped values,
not fabricated.

---

## 1. Brand at a glance

- **Product** — A calm rental platform for Tunisia. Nightly stays, monthly
  rentals, yearly leases. Every home is **verified by a partner agency** and
  **tourable in 3D** before you visit.
- **Audiences** — Renters (mobile app) · real-estate agencies (web workspace).
- **Personality** — Minimal, editorial, quiet. Confident, not loud. Grown-up.
  Feels like *The Row* or *Aesop* met a Tunisian riad.
- **Not** — Colourful startup, playful gradients, cartoon icons, emoji copy,
  palm-tree clip art, tourist-brochure Tunisia, "hey there 👋".
- **Voice cadence** — *"Six cities. A thousand doors to knock on."* ·
  *"Not case studies. Three people who'd let us call them."* ·
  *"Every stay verified. Every home tourable in 3D."*

---

## 2. Colour palette

| Role                       | Token                | Hex        | Where it lives |
| -------------------------- | -------------------- | ---------- | -------------- |
| Deep base (landing)        | **Ink**              | `#141414`  | Landing / dark surfaces |
| Deep base (grid)           | Ink Deep             | `#0B0B0B`  | `.dark-grid` background only |
| Secondary ink              | Ink Soft             | `#3C3C3B`  | Secondary text on paper |
| Paper                      | **Paper**            | `#FCFCFB`  | App + workspace primary background |
| Card                       | Card                 | `#FFFFFF`  | Elevated surfaces on paper |
| Fill                       | Fill                 | `#F1F1F0`  | Chip / neutral field |
| Separator                  | Separator            | `#E6E6E4`  | 1 px hairlines |
| Muted                      | Muted                | `#7A7A78`  | Body-copy grey |
| Muted soft                 | Muted Soft           | `#B4B4B1`  | Tertiary labels |
| **Accent** (the only one)  | **Ink**              | `#141414`  | Ink IS the accent — buttons, active states, everywhere |
| Accent wash                | Fill                 | `#F1F1F0`  | Neutral grey wash behind emphasis |
| Accent pressed             | Ink Deep             | `#0B0B0B`  | Pressed / hover on ink buttons |
| Alert                      | Danger               | `#B23A34`  | Muted brick red — genuine errors only |

**Rules of use**

- **Strict black, white & grey — everywhere.** Landing, agency workspace and
  mobile app all share one monochrome system. Ink base, paper text, greys carry
  all hierarchy. **No accent colour.**
- **Ink is the only accent.** Primary buttons, "verified" ribbon, "confirm"
  chip, active nav pill, favourite hearts and price highlights are all rendered
  in ink `#141414` on paper (or paper on ink), never a colour.
- Whitespace is a colour. Aim for ~40 % empty area per screen.
- Danger `#B23A34` is the only non-neutral hue, reserved for genuine errors.

---

## 3. Typography

- **Display** — **Outfit** (500 / 600 / 700 / 800). Headlines, wordmark,
  section titles, prices, big numbers. Tight tracking (`-0.02em`), heavy
  leading control (`leading-[1.02]` on the hero).
- **Body** — **Plus Jakarta Sans** (400 / 500 / 600 / 700). Everything that
  is not a headline.
- **Micro copy** — Uppercase, 10–12 px, tracking `0.14em`–`0.22em`,
  muted-grey. Signature Nesty rhythm; used for eyebrows and status pills.
- **Numbers rule** — Real estate is a numbers game. `180 TND/night`,
  `1 200+ verified stays`, `4.9 ★` — always render in Outfit.

---

## 4. Logo & mark

- **Symbol** — A stylised **little house with a rounded window** in the
  middle. The window reads as both an "o" and a nest (the "nesty" idea in one
  glyph). Silhouette-first, no line-art.
- **Container** — Rounded square, radius 8–12 px, symbol filled inside.
  - On paper: black square, paper-white house inside.
  - On ink surfaces: paper-white square, ink house inside.
- **Wordmark** — "Nesty" in Outfit ExtraBold, tight tracking, sits to the
  right of the mark with ~10 px gap.
- **Clear space** — Minimum 1 × the mark's height on every side.
- **Do NOT** — Outline the mark, add drop shadow, gradient the house, tilt
  it, place it directly on busy photography without a solid tinted plate.

---

## 5. Textures, radii and motifs (verified in globals.css)

| Motif                    | Spec                                                                                                    |
| ------------------------ | ------------------------------------------------------------------------------------------------------- |
| `.dark-grid`             | 56 × 56 px lines · `rgba(255,255,255,0.045)` · radial mask fades to centre. Landing dark canvas only.   |
| `.aurora-glow`           | White radial blob, 90 px blur, ~18 % opacity, 14 s drift loop. Signature light on the dark canvas.      |
| `.grain::after`          | SVG turbulence noise, 5 % opacity, overlay blend. Breaks OLED banding on ink surfaces.                  |
| `.headline-shimmer`      | Horizontal white gradient sweep, 7 s loop, on one line of the hero headline.                            |
| `.hairline`              | 1 px separator, centre-drawn animation on reveal.                                                       |
| `.surface-aura`          | Paper background + two faint radial gradients (`rgba(20,20,20,0.05)`). Agency workspace background.     |
| `.aura-brand`            | Deeper ink radial glow, `rgba(20,20,20,0.16)`. Used behind app CTAs.                                    |
| **Radii**                | `12`, `16`, `20` (`2xl`), `24` (`3xl`), `999px` (`pill`). Pills used heavily — chips, buttons, tags.    |
| **Shadow — soft**        | `0 30px 60px -30px rgba(0,0,0,0.18)` — cards on paper.                                                  |
| **Shadow — float**       | `0 24px 50px -24px rgba(20,20,20,0.28)` — hovering elements.                                            |
| **Shadow — lift**        | `0 40px 80px -40px rgba(20,20,20,0.35)` — modal / phone mock.                                           |
| **Shadow — glow**        | `0 18px 40px -16px rgba(20,20,20,0.30)` — ink CTA lift.                                                 |

Motion respects `prefers-reduced-motion` everywhere.

---

## 6. Photography direction

- **Setting** — North-African architecture: Sidi Bou Saïd blue-and-white
  doors, La Marsa sea-view lofts, Djerba arched interiors, Carthage stone,
  Hammamet whitewash. Never Eiffel-Tower-of-Tunis clichés.
- **Light** — Warm daylight (10 h–16 h), late-afternoon golden preferred.
  Never night, never harsh flash.
- **People** — None or silhouettes only. Nesty is about the *place*, not the
  person renting it.
- **Framing** — Editorial. Half-shadow, half-light compositions. Wide crops
  with generous headroom for headline overlays.
- **Colour treatment** — Warm neutrals: bone white, ochre, terracotta,
  cobalt-blue accents only where they occur naturally (Sidi Bou doors).

---

## 7. Landing page look (dark)

- Pure ink background, paper text, greys for hierarchy.
- Hero headline in Outfit 3.4–5.25 rem, `.headline-shimmer` on the 2nd line.
- **Search bar** — Horizontal pill, four fields (Where / Check-in / Check-out
  / Guests) separated by 1 px hairlines, paper-white "Explore" pill at the
  right end.
- **Category rail** — Monochrome icons + one-word labels, active item
  underlined with a paper 2 px border-bottom.
- **Destination cards** — 4:5 aspect image, dark scrim from bottom, region
  chip top-left, heart top-right, city name in Outfit 26–30 px, price row
  `from X TND/night · from Y TND/month`.
- **Parallax** — Subtle vertical drift on `.aurora-glow` and floating listing
  chips.

## 8. Agency workspace look (light, monochrome)

- Paper background with `.surface-aura` (two faint radial gradients at the
  top corners, both under 5 % opacity).
- Left sidebar in card white with pill active states in ink.
- Data-dense but calm — 1 px separators, row height 56–64 px, tabular
  numbers.
- **Emphasis is ink** — primary buttons, "verified" ribbon, "confirm" chip on
  today's stay requests and the active nav pill are all solid ink on paper.
- Status pills — Rounded pill, uppercase 10 px, tracking 0.12 em, greyscale;
  "verified" is solid ink, "booked" is muted grey.

## 9. Mobile app look (light, monochrome)

- Paper background, ink text — inverse of the landing.
- Ink on Book / Confirm CTAs, favourite hearts and price pills over hero
  images — the app shares the landing's strict monochrome palette.
- Bottom tab bar in near-white with 1 px hairline top border.
- Hero listing card — 16:11 image, "3D tour" chip top-left over dark scrim,
  "verified" chip next to it, heart top-right, city + title over bottom
  gradient, price pill (e.g. `180 TND / night`) bottom-right.

---

## 10. Voice & tone (for marketing copy under any image)

- Short. Confident. Specific. Slightly wry.
- Vocabulary: **stays**, **rentals**, **check-in**, **check-out**, **lease**,
  **night**, **month**, **book stay**, **verified**. Never "property
  listings" or "book now!".
- Punctuation: en-dashes over hyphens, no exclamation marks, no emoji.
- Numbers get their own line whenever possible.

Example lines that already live in the product:

- "Find your next place in Tunisia."
- "Six cities. A thousand doors to knock on."
- "Every stay verified. Every home tourable in 3D."
- "No phantom flats, no bait pricing."
- "Rentals in 9 tunisian cities · short & long-term."

---

# AI Image-Generator Prompts

Copy-paste ready. Add your engine's flags (`--ar 3:4 --v 6.1 --style raw` etc.)
at the end. Every prompt embeds the palette hexes so the model doesn't drift.

## Logo — primary (paper)

```
Minimalist real-estate brand logo for "Nesty". A rounded black square
(#141414, radius 12px) containing a stylised silhouette of a small house
with a single rounded window in the middle — the window reads as both an "O"
and a nest. To the right of the square, the wordmark "Nesty" in a geometric
humanist sans-serif (Outfit ExtraBold), tight tracking, ink black #141414 on
off-white paper #FCFCFB background. Editorial, timeless, flat vector,
generous negative space, no gradient, no drop shadow. Aspect 3:2.
Negative: line-art, outlines, 3D bevel, isometric, colourful, cartoon, glow,
lens flare, watermark.
```

## Logo — reverse (dark canvas)

```
Same Nesty logo — a rounded square containing a stylised silhouette of a
small house with a single rounded window — but as paper-white #FCFCFB on an
ink black #141414 background. Ultra-minimal, flat vector, editorial, no
gradient. Aspect 3:2.
```

## Logo — monogram only (favicon / social avatar)

```
Single-glyph brand mark: a rounded square, radius 12px, ink black #141414,
containing a stylised silhouette of a small house with one rounded central
window in paper-white #FCFCFB. No wordmark. Flat vector, centred, generous
inner padding. Aspect 1:1, PNG-ready.
```

## Poster — B2C hero campaign (renter-facing)

```
Editorial B2C rental campaign poster for "Nesty", a Tunisian home-rental
platform. Composition: full-bleed warm-daylight photograph of a Sidi Bou
Saïd whitewashed villa with a cobalt-blue arched door and bougainvillea
climbing the wall, half of the frame in crisp architectural shadow. Bottom
two thirds overlaid with an ink black #141414 gradient (from 70% opacity
bottom to transparent top-third). Large headline set in Outfit ExtraBold,
paper white #FCFCFB, tight tracking, aligned bottom-left:
"Find your next place in Tunisia."
Micro-eyebrow above the headline, uppercase, letter-spacing 0.22em, 60%
white:
"RENTALS · SHORT & LONG-TERM · 9 CITIES"
A single rounded-pill button bottom-left: "Explore stays" (paper white pill,
ink text). Small Nesty wordmark (paper white) bottom-right corner. Fine
grain overlay 5%. Aspect ratio 2:3, print poster A2, editorial magazine
quality.
Negative: bright saturated colours, palm-tree clip art, tourist brochure
vibe, sunset filter, emoji, watermark, stock text, lens flare, people.
```

## Poster — City of the month (rotate the city name)

```
Editorial "City of the month" poster for Nesty. One-word city title in
Outfit ExtraBold, huge, paper white #FCFCFB on ink black #141414
background, aligned bottom-left, taking up the bottom third of the frame:
"LA MARSA" (or "SIDI BOU SAÏD" / "DJERBA" / "HAMMAMET" / "SOUSSE" /
"CARTHAGE").
Above the title: a warm-daylight architectural photograph of that city
(sea-view loft for La Marsa; blue-and-white cobbled alley for Sidi Bou;
domed medina rooftops for Djerba; whitewashed corniche for Hammamet), 4:5
aspect, warm shadow-heavy composition, no people. A hairline paper-white
1px border framing the photo. Micro-eyebrow top-left, uppercase 0.22em
tracking: "STAYS OF THE MONTH · NESTY.TN". Bottom-right, small paper-white
row: "from 120 TND / night · from 3 200 TND / month".
Aspect 2:3, print poster A2, editorial minimalism.
Negative: gradients, cliché monuments, tourist icons, emoji, drop shadow on
type, curved text.
```

## Flyer — bilingual (Arabic / English)

```
A5 rental flyer for Nesty. Split composition: top 60% is a warm-daylight
photograph of an arched Tunisian riad interior — bone-white walls, terracotta
floor tile, one narrow strip of cobalt-blue detail. Bottom 40% is a solid
paper white #FCFCFB block with editorial typography. Headline in Outfit
ExtraBold, ink black #141414: "Rent your next place / in Tunisia." (line
break as shown). Below, an Arabic translation set in a modern Arabic
sans-serif (Cairo Bold), right-aligned, same ink black:
"استأجر منزلك القادم في تونس".
Bottom-left: three short bullets in Plus Jakarta Sans 12px muted grey
#7A7A78: "· Every stay verified · Every home in 3D · Nightly or monthly".
Bottom-right: a terracotta #EC5E2A rounded pill, ink-black text: "nesty.tn".
Fine 5% grain overlay. Aspect 148:210 (A5 portrait), editorial.
Negative: emoji, cartoon icons, lens flare, watermark, colourful logos.
```

## Instagram square — new-listing announcement

```
1:1 Instagram post for Nesty, a Tunisian rental platform. Layout: left half
is a 4:5 warm-daylight photograph of a Mediterranean sea-view balcony at
golden hour (no people, warm neutrals only). Right half is a solid ink
black #141414 panel. On the black panel, aligned top-left with 40px inset:
uppercase eyebrow paper-white 0.22em tracking: "NEW ON NESTY".
Below it, big headline in Outfit ExtraBold, paper white #FCFCFB:
"Sea-view loft. / La Marsa."
Middle of the panel: a hairline 1px paper-white separator, 40% opacity, 40px
wide.
Below: price row in Outfit SemiBold, paper white: "180 TND / night · 2 bd ·
118 m²".
Bottom-right corner of the black panel: a paper-white rounded pill with ink
text: "Book stay". Grain overlay 5%. Aspect 1:1.
Negative: neon colours, palm-tree emoji, cartoon icons, tourist-brochure
sunset.
```

## Instagram story — verified stays trust ad

```
9:16 Instagram story for Nesty. Full-bleed ink black #141414 background
with an .aurora-glow effect: a soft paper-white radial blob (blur 90px,
18% opacity) drifting off-centre top. Centred vertically, big Outfit
ExtraBold headline in paper white #FCFCFB, three lines, tight leading:
"1 200 stays. / 40 agencies. / Zero phantom flats."
Below it, a 1px paper-white hairline 80px wide, centred, 40% opacity.
Under the hairline, uppercase 0.22em tracked micro-copy in 55% paper:
"EVERY STAY VERIFIED BY A TUNISIAN AGENCY · NESTY.TN".
Bottom 20% of the frame: a single paper-white pill CTA, ink text: "See
stays". Fine grain overlay 5%. Aspect 9:16.
Negative: colourful gradients, emoji, cartoon avatars.
```

## Facebook / LinkedIn banner (B2B agency-facing)

```
Editorial LinkedIn banner for Nesty, a Tunisian rental operating system for
real-estate agencies. Composition split: left two thirds is a paper white
#FCFCFB surface with a very faint radial aura tinted ink (rgba 20,20,20,
0.05) top-right. Editorial typography on the paper side: Outfit ExtraBold
headline, ink black #141414, tight tracking, two lines:
"Every rental, request and stay. / On one calm board."
Below, a 1px separator ink #E6E6E4, then a Plus Jakarta Sans 14px muted grey
tagline: "The workspace Tunisian agencies open first."
Right one third: a warm-daylight photograph of an agency office window
looking onto a Mediterranean street, blurred, warm neutrals only. A single
terracotta #EC5E2A rounded pill CTA sits at the seam between the two panels,
ink text: "List your inventory". Aspect 1584:396 (LinkedIn banner).
Negative: colourful diagrams, cartoon dashboards, stock people, emoji.
```

## App-store screenshot frame (mobile)

```
Marketing screenshot mock for the Nesty mobile app. A single phone frame
(dark ink #141414 bezel, 24px radius) sits centred on a paper white
#FCFCFB background with a very soft terracotta aura (radial gradient rgba
236,94,42,0.1) glowing behind the phone. Inside the phone: a mobile app
screen with paper background, a hero rental card at the top (16:11 photo of
a Sidi Bou Saïd villa with a cobalt door; "3D tour" chip top-left, "verified"
chip next to it, heart top-right; bottom overlay reads "Blue & White Garden
Villa · Sidi Bou Saïd"; a terracotta price pill "180 TND / night" bottom-
right). Below the hero, a 2-column grid of smaller listing thumbs. Bottom
tab bar in near-white with 4 minimal ink icons.
Above the phone, editorial headline in Outfit ExtraBold ink black:
"Tour it in 3D. Book by the night."
Aspect 3:4, print poster A3.
Negative: bright neon colours, cartoon UI, gradients, chat bubbles.
```

---

## Coming-soon launch — Hannibal centrepiece (Tunisian touch)

Three formats built around a monochrome 3D-rendered bust of **Hannibal
Barca**, the Carthaginian general (247–183 BC). Paper-cream base to feel
editorial and museum-grade; the Nesty landing's ink black is deliberately
NOT the background here — a launch teaser reads more luxurious on paper.
The 3D statue does the visual heavy lifting, so type stays quiet.

**Historical cues for the statue prompt (keep in every variant)**

- Carthaginian, not Roman or Greek — specify it explicitly.
- Curly short hair, strong jawline, calm gaze slightly down.
- Bare shoulders and torso; a draped stone-carved cloak over one shoulder.
- Numidian-style helmet OR no helmet with a bare head (choose one per
  render — do not mix).
- Marble-to-concrete grey monochrome, matte finish, no gold, no colour, no
  jewellery.

### Instagram square 1:1 — Hannibal coming-soon

```
Editorial "coming soon" Instagram post for Nesty, a Tunisian home-rental
brand. Paper-cream #FCFCFB background, faint 5% grain overlay.

Centre-right of the frame: a photoreal 3D-rendered bust of Hannibal Barca,
Carthaginian general (247–183 BC) — curly short hair, strong jawline, calm
gaze slightly down, bare shoulders with a stone-carved draped cloak over
one shoulder, no helmet, no jewellery. Marble-to-concrete matte grey
monochrome (#3C3C3B highlights, #7A7A78 midtones, #B4B4B1 lights), soft
north-light rim on one side, deep matte shadow on the other. The bust is
cropped from mid-chest up and reaches from the middle to the right edge of
the frame, generous negative space on the left.

Behind the bust, a hairline arch — 1px ink black #141414 outline, half-
circle, radius roughly one-third of the frame — framing the head like a
museum niche.

Left of the bust, editorial typography column, ink black #141414, aligned
left, top-anchored 15% from the top:

  Line 1 — micro-eyebrow, uppercase Plus Jakarta Sans 11px, tracking
  0.22em, muted grey #7A7A78:
  "COMING SOON · TUNISIA · 2026"

  Line 2 — main mark, Outfit ExtraBold, huge, ink black, tight tracking,
  two lines:
  "nesty."
  Below it, a 1px separator, ink black, 40px wide.

  Line 3 — Plus Jakarta Sans 13px muted grey, two lines:
  "Rent your next place in Tunisia. / Verified. Tourable. Quiet."

Bottom-left corner, a small rounded-rectangle info chip: ink black
#141414 fill, paper text, Plus Jakarta Sans 10px uppercase tracking 0.14em:
"NESTY.TN".

Bottom-right corner, three dot-separated micro-labels in ink black,
uppercase 0.14em: "STAYS · RENTALS · LEASES".

Between the text column and the bust, a delicate hairline dotted rule —
tiny ink dots repeating vertically — to echo the reference flyer's dot
dividers.

Style: editorial magazine, high-fashion museum catalogue, Nesty aesthetic,
zero saturation except the paper's warm off-white. Aspect 1:1, 1080×1080.

Negative: colour, gradients, gold, bronze, emoji, tourist icons, palm
trees, mosques as icons, Roman armour, cartoon, glossy plastic, lens
flare, watermark, stock text.
```

### Instagram story 9:16 — Hannibal coming-soon

```
Editorial "coming soon" Instagram story for Nesty, a Tunisian home-rental
brand. Paper-cream #FCFCFB background, faint 5% grain overlay, 9:16
vertical.

Vertically centred: a photoreal 3D-rendered full bust of Hannibal Barca,
Carthaginian general (247–183 BC) — curly short hair, strong jawline, calm
gaze straight ahead, bare shoulders with a stone-carved draped cloak
falling from one shoulder, no helmet. Marble-to-concrete matte grey
monochrome (#3C3C3B highlights, #7A7A78 midtones, #B4B4B1 lights), soft
north-light rim, deep matte shadow opposite. The bust occupies the middle
40% of the frame vertically, centred horizontally.

Behind the bust, a hairline half-arch — 1px ink black #141414 outline —
frames the head like a niche in a Carthage museum wall.

Top of the frame (top 20%):
  Micro-eyebrow, Plus Jakarta Sans 12px uppercase, tracking 0.22em, muted
  grey #7A7A78, centred:
  "TUNIS · CARTHAGE · SIDI BOU SAÏD · LA MARSA · DJERBA"
  Below it, Outfit ExtraBold ink black #141414, huge, three lines, tight
  leading, centred:
  "COMING /
  SOON /
  TO TUNISIA."
  A 1px ink black separator, 60px wide, centred, below the headline.

Bottom of the frame (bottom 20%):
  A rounded pill, ink black #141414 fill, paper white text, Outfit
  SemiBold 14px, centred: "n e s t y . t n".
  Below the pill, Plus Jakarta Sans 11px muted grey, centred, tracking
  0.22em uppercase: "REGISTER YOUR AGENCY · INFO.NESTY@PROTON.ME".

Small decorative dot-cluster ornaments (echoing the reference flyer's
lower dots): a 3×3 grid of tiny ink black dots in each of the bottom
corners, subtle, low-key.

Style: editorial museum catalogue, minimal, luxurious, Nesty aesthetic.
Aspect 9:16, 1080×1920.

Negative: colour, gradients, gold, bronze, sepia, emoji, cartoon,
watermark, Roman armour, halo, laurel wreath, tourist typography, lens
flare.
```

### A4 print flyer / launch affiche — Hannibal centrepiece

```
Editorial A4 print flyer announcing the launch of Nesty, a Tunisian
home-rental platform. 210 × 297 mm portrait, print-ready, 300 DPI,
paper-cream #FCFCFB background with 5% grain overlay.

Composition (top → bottom):

TOP 8% — a thin ink black #141414 wordmark row: on the left, the Nesty
mark (a small rounded ink black square, radius 10px, containing a paper-
white silhouette of a house with a rounded central window). On the right,
in Plus Jakarta Sans 10px uppercase tracking 0.22em muted grey #7A7A78:
"A4 · 300 DPI · TUNIS 2026".

HEADLINE BAND (from ~8% to ~28%) — Outfit ExtraBold, ink black #141414,
tight tracking, two lines, aligned right, huge (matching the reference
flyer's "FRIDAY" scale):
"Nesty."
Under it, a rounded-rectangle pill, ink black #141414 fill, paper text,
Plus Jakarta Sans 10px uppercase tracking 0.16em:
"COMING SOON"

HERO IMAGE BAND (from ~28% to ~72%) — a photoreal 3D-rendered bust of
Hannibal Barca, Carthaginian general (247–183 BC): curly short hair,
strong jawline, calm gaze slightly down, bare shoulders with a stone-
carved draped cloak falling over one shoulder, no helmet. Marble-to-
concrete matte grey monochrome (#3C3C3B highlights, #7A7A78 midtones,
#B4B4B1 lights). Soft north-light rim on one side, deep matte shadow on
the other. The bust is centred, mid-chest up, cropped by a hairline arch
(1px ink outline, half-circle, radius half the frame width) — the arch
frames the head like a museum niche. To the left of the bust, a small
decorative motif: a 5×5 grid of tiny ink black dots + one filled ink
square, echoing the reference flyer's dotted grid ornament.

INFO STACK (~72% to ~86%) — three horizontal info blocks, stacked
vertically, left-aligned, matching the reference flyer's style:

  Block 1 (small rounded-rectangle, ink black #141414 fill, paper text):
    Label — Plus Jakarta Sans 9px uppercase tracking 0.14em:
    "LAUNCH DATE"
    Value under, Outfit SemiBold 14px paper text:
    "SEPT 2026"

  Block 2 (paper background, ink text, 1px ink outline, radius 6px):
    Label left, "SEPT" — Outfit ExtraBold ink, big.
    Value right, three lines, Plus Jakarta Sans 11px muted grey:
    "TUNISIA — 9 CITIES / Tunis · La Marsa · Sidi Bou / Djerba · Sousse
    · Hammamet"

  Bottom row — four dot-separated micro-labels, Plus Jakarta Sans 10px
  ink, tracking 0.14em uppercase, inside a paper rounded-rectangle with
  a 1px ink outline:
  "STAYS   ·   RENTALS   ·   3D TOURS   ·   VERIFIED"

FOOTER BAND (bottom 10%) — a hairline 1px ink separator across the frame,
then a small centred paragraph, Plus Jakarta Sans 9px muted grey, three
lines, generous line-height:
"Rent your next place in Tunisia. Every stay verified by a partner
agency, every home tourable in 3D, priced by the night or by the month.
info.nesty@proton.me · nesty.tn"

On either side of the footer paragraph, a tiny ornamental checkerboard
(3×3 mini-square pattern in ink black) — echoing the reference flyer's
lower ornaments exactly.

Style: editorial museum catalogue meets luxury real-estate brochure,
minimal, calm, print-quality, magazine art direction. Aspect 210:297.

Negative: colour, saturated tones, gold, bronze, sepia, watermarks,
emoji, tourist iconography, palm trees, cartoon icons, Roman armour,
laurel wreath, halo, lens flare, gradient backgrounds, drop shadows on
text.
```

**Variant tips**

- Swap "COMING SOON" for **"BIENTÔT · قريبًا"** in the A4 for a
  trilingual affiche — set the Arabic in Cairo Bold, right-to-left, same
  ink black.
- To emphasise the Carthaginian heritage on a second-in-series poster,
  swap the bust for a full-body statue of Hannibal on horseback (rear
  three-quarter view) framed by the same 1px arch — keep all other
  elements identical.
- For an ink-based night version (matching the Nesty landing), invert:
  background becomes ink black #141414, all type becomes paper white
  #FCFCFB, the statue is lit by a single paper-white rim light against
  the ink background, and the arch outline becomes paper-white 1px.

---

## Trade-show booth / affiche (large-format)```
Large-format trade-show affiche for Nesty. 3:4 vertical, ink black #141414
background full bleed with an .aurora-glow effect (paper-white radial blob,
blur 90px, 18% opacity) drifting behind the type from the top. Centred
composition. Big Outfit ExtraBold headline in paper white #FCFCFB, tight
tracking, three lines with careful leading:
"Rent your / next place / in Tunisia."
Middle line "next place" is styled with a horizontal shimmer sweep (subtle
gradient from #FCFCFB to 55% white and back — mimic the .headline-shimmer
utility).
Below the headline: a 1px paper-white hairline separator, 120px wide,
centred, 40% opacity.
Under it, uppercase micro-copy 0.22em tracking, 55% paper:
"NIGHTLY STAYS · MONTHLY RENTALS · YEARLY LEASES".
Bottom of the frame: paper-white rounded pill CTA with ink text "Explore
stays" and a smaller ghost pill next to it "For agencies →". Fine 5% grain
overlay across the whole frame. Aspect 3:4, print-ready A1.
Negative: colourful gradients, emoji, cartoon icons, sunset filters, tourist
imagery.
```

## Brand pattern (repeatable, for packaging / merch)

```
A seamless repeatable brand pattern for Nesty. On a paper white #FCFCFB
background, a sparse grid (56x56 pixels per unit) of the Nesty house glyph
— rounded square, 12px radius, ink black #141414, containing a paper-white
silhouette of a small house with a rounded central window. Every 5th glyph
is replaced with the same silhouette in terracotta #EC5E2A. Every 12th
glyph is empty (a paper-white square with a 1px separator #E6E6E4 outline)
to keep the density calm. No gradients, no shadows, editorial print quality,
vector. Aspect 1:1, tileable.
Negative: colourful confetti, gradient icons, playful shapes.
```

## Founder / team portrait direction (if ever needed)

```
Editorial founder portrait for a Tunisian PropTech brand. Half-body, warm
daylight through a north-facing window, subject in soft-focused neutral
linen against a paper-white wall. Warm shadow half-lights one side of the
face. No smile, calm-confident expression. Muted colour grade: bone,
ochre, faint cobalt in the background only. Shot on a 50mm-equivalent lens
at f/2.8, editorial magazine quality. Aspect 4:5.
Negative: harsh flash, stock-photo grin, colourful backgrounds, corporate
suit-and-tie clichés.
```

---

## 11. Do / Don't checklist

**Do**

- Keep every surface pure black-and-white — landing, workspace and app share
  one monochrome system.
- Use Outfit for anything with weight, Plus Jakarta Sans for anything to
  read.
- Give every composition breathing room — at least a third of the canvas
  should be a single quiet colour.
- Say what the thing costs. Prices are copy.
- Let one hairline do the work of ten decorations.

**Don't**

- Don't add an accent colour "for balance" or "to convert". Ink carries every
  emphasis on purpose.
- Don't tilt, gradient, or outline the logo.
- Don't render palm trees, camels, mosques as icons, or emoji-style flags.
- Don't use words like "unlock", "seamless", "revolutionise", "empower".
- Don't put people in the photography unless they're a silhouette in the
  distance.

---

*Last verified against the shipped tokens on
[tailwind.config.ts](tailwind.config.ts) and
[globals.css](src/app/globals.css).*
