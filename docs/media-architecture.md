# Media Architecture — Moments by LP

This document defines how authority imagery and short video should be stored, named, referenced, and rendered on the Hugo site.

It is intentionally additive. **Do not move existing legacy assets** unless a page owner is actively rewriting that surface.

---

## Audit summary (current state)

### Where files live today

| Location | Role | Notes |
|---|---|---|
| `static/images/` | Legacy site photography + OG/offer imagery | Flat JPG naming (`lauren-*.jpg`, `offer-*.jpg`) |
| `static/images/portfolio/` | Homepage portfolio preview stills | `preview-1.jpg` … `preview-6.jpg` |
| `static/video/hero.mp4` | Homepage hero loop | Single MP4, no poster |
| Content front matter | `ogImage` / `image` paths | Many OG paths reference files not yet present (`/images/og-*.jpg`, blog, shop) |

There is **no** Hugo `assets/` image pipeline in use. Images are served as static files. Most markup uses plain `<img>` tags with occasional `loading="lazy"` and fixed `width`/`height`. There is no shared `srcset`/`<picture>` convention yet. Homepage video autoplays muted/looping with no reduced-motion fallback.

### Rendering today

- Homepage hero: muted autoplay loop (`layouts/index.html`)
- About / Creative Journal: direct image paths in layouts and partials
- Reduced motion: respected for scroll animations, **not** for video
- No reusable shortcodes for editorial/BTS media patterns

### Decision

Keep legacy paths working. Put **new authority assets** under `static/media/authority/{category}/` and render them through the shared media partials/shortcodes below.

---

## Authority asset categories

Canonical folders (also listed in `data/media.yaml`):

```text
static/media/authority/
  directing/
  lighting/
  creative-direction/
  client-experience/
  commercial-production/
  teaching/
  community/
  speaking/
  south-florida/
  brand-portraits/
  final-work/
  bts-to-final/
static/media/posters/          # optional shared poster stills
```

Use the category that best matches the **story the asset proves**:

| Category | Use for |
|---|---|
| `directing` | Lauren directing talent, shaping poses/energy |
| `lighting` | Lighting demos, modifier setups, light-in-use |
| `creative-direction` | Direction decisions, references becoming reality |
| `client-experience` | Client interactions, fittings, collaborative trust |
| `commercial-production` | Crew, set builds, commercial day energy |
| `teaching` | Workshops, mentoring, educational demos |
| `community` | Creator events, Content & Coffee, gatherings |
| `speaking` | Stages, podcasts, panels |
| `south-florida` | Location/lifestyle atmosphere unique to the region |
| `brand-portraits` | Lauren portraits used as authority identity |
| `final-work` | Finished delivered frames |
| `bts-to-final` | Explicit pairs used in before/after comparisons |

Video posters may live next to the clip (preferred) or in `static/media/posters/`.

---

## Filename convention

```text
lauren-{category}-{subject}-{orientation}-{nn}.{ext}
```

Rules:

1. Lowercase only
2. Hyphen-separated words (no spaces, no underscores)
3. Include category even though the folder also encodes it (filenames stay meaningful if moved/exported)
4. `orientation` is `horizontal` or `vertical` (use `square` only when truly 1:1)
5. Two-digit sequence: `01`, `02`, …
6. Prefer `.webp` for stills, `.jpg` as fallback export, `.mp4` for video
7. Posters append `-poster` before the extension

### Examples

```text
lauren-directing-model-red-editorial-01.webp
lauren-lighting-luxury-apartment-horizontal-01.webp
lauren-teaching-studio-lighting-horizontal-01.mp4
lauren-teaching-studio-lighting-horizontal-01-poster.webp
lauren-bts-to-final-jewelry-campaign-bts-01.webp
lauren-bts-to-final-jewelry-campaign-final-01.webp
lauren-speaking-podcast-set-horizontal-01.mp4
lauren-south-florida-spanish-river-golden-hour-horizontal-01.webp
lauren-brand-portraits-garden-vertical-02.webp
```

Paired BTS/final stills should share the same subject slug and differ only by `bts` / `final` (and sequence if needed).

---

## Recommended dimensions

Export **master web files** at these sizes (long edge targets). Provide responsive derivatives when a frame will appear large on desktop.

### Stills

| Use | Aspect | Export size | Notes |
|---|---|---|---|
| Editorial vertical | 4:5 | 1600 × 2000 | Default authority still |
| Editorial horizontal | 3:2 | 2400 × 1600 | Essays, pull-quotes, wide inserts |
| Portrait / brand | 4:5 | 1600 × 2000 | Lauren identity portraits |
| Comparison pair | 4:5 | 1200 × 1500 each | Keep both frames matched |
| OG / social share | ~1.91:1 | 1200 × 630 | Separate from editorial crops |
| Video poster | match video | 1920 × 1080 or 1080 × 1920 | First readable still, not a random frame |

Responsive width set (optional derivatives): **640 / 960 / 1280 / 1600 / 2400**.

If exporting derivatives, mirror the master name with a width suffix:

```text
lauren-lighting-luxury-apartment-horizontal-01.webp
lauren-lighting-luxury-apartment-horizontal-01-960.webp
lauren-lighting-luxury-apartment-horizontal-01-1600.webp
```

Then pass a `srcset` into the shortcode/partial.

### Video

| Use | Aspect | Resolution | Length / weight |
|---|---|---|---|
| Muted BTS loop | 16:9 or 9:16 | 1920×1080 or 1080×1920 | **3–12 seconds**, target **≤ 3 MB** |
| Teaching / speaking with audio | 16:9 | 1920×1080 | Keep under ~25 MB; always provide captions when speech matters |
| Poster still | matches video | same frame size | Required for BTS loops |

Encoding guidance:

- **MP4 (H.264) + AAC** (AAC optional for muted BTS; still fine to include a silent track)
- No heavy player libraries
- Mute BTS clips in export when they will autoplay
- Prefer constant frame rate 24/30 fps
- Avoid 4K on-site unless there is a specific full-bleed need

---

## Horizontal vs vertical usage

| Orientation | Best surfaces |
|---|---|
| **Vertical (4:5 / 9:16)** | Mobile-first story blocks, portraits, directing/teaching close moments, social-native inserts |
| **Horizontal (3:2 / 16:9)** | Pull-quotes over imagery, speaking/podcast recaps, wide lifestyle establishing frames, desktop editorial breaks |
| **Pairs** | BTS→final comparisons should use the **same orientation** on both sides |

Do not force a horizontal master into a vertical component with aggressive cropping if the subject’s hands/lighting demo would be lost — export a dedicated crop instead.

---

## Where files should live

```text
Legacy (leave in place):
  /static/images/...
  /static/video/hero.mp4

New authority library:
  /static/media/authority/{category}/{filename}
  /static/media/posters/{filename}          # optional

Captions for spoken video (optional):
  /static/media/authority/{category}/{filename}.vtt
```

Public URL examples:

```text
/media/authority/directing/lauren-directing-model-red-editorial-01.webp
/media/authority/teaching/lauren-teaching-studio-lighting-horizontal-01.mp4
/media/authority/teaching/lauren-teaching-studio-lighting-horizontal-01-poster.webp
```

---

## How editors reference media from Hugo content

Use shortcodes (preferred in Markdown) or partials (preferred in layouts).

### Path shortcuts

In shortcodes/partials, `src` may be:

1. Absolute site path: `/media/authority/lighting/file.webp`
2. Category-relative: `lighting/file.webp` → resolves to `/media/authority/lighting/file.webp`
3. Legacy path still works: `/images/lauren-camera.jpg`

### 1) Responsive editorial image

```md
{{< media/editorial-image
  src="south-florida/lauren-south-florida-spanish-river-golden-hour-horizontal-01.webp"
  alt="Golden hour at Spanish River Park in Boca Raton"
  orientation="horizontal"
  width="2400"
  height="1600"
  caption="South Florida light does half the directing."
>}}
```

### 2) Image + educational caption

```md
{{< media/captioned-image
  src="lighting/lauren-lighting-luxury-apartment-horizontal-01.webp"
  alt="Lauren shaping soft window light in a luxury apartment"
  label="Lighting note"
  caption="One large soft source camera-left keeps skin luminous without flattening texture."
  orientation="horizontal"
  width="2400"
  height="1600"
>}}
```

### 3) Muted autoplay looping BTS video (with poster)

```md
{{< media/bts-video
  src="directing/lauren-directing-model-red-editorial-01.mp4"
  poster="directing/lauren-directing-model-red-editorial-01-poster.webp"
  alt="Lauren directing a model during a red editorial shoot"
  orientation="horizontal"
  caption="Direction happens between frames."
>}}
```

Behavior:

- Muted, plays inline, loops
- Lazy: plays only near viewport
- `prefers-reduced-motion: reduce` shows the poster instead of autoplay

### 4) Accessible video when audio matters

```md
{{< media/video
  src="speaking/lauren-speaking-podcast-set-horizontal-01.mp4"
  poster="speaking/lauren-speaking-podcast-set-horizontal-01-poster.webp"
  captions="speaking/lauren-speaking-podcast-set-horizontal-01.vtt"
  alt="Lauren discussing creative direction on a podcast set"
  caption="Podcast conversation on visual branding."
>}}
```

Uses native controls. No autoplay.

### 5) BTS → final comparison

```md
{{< media/bts-final
  heading="From set to final frame"
  btsSrc="bts-to-final/lauren-bts-to-final-jewelry-campaign-bts-01.webp"
  btsAlt="Behind the scenes on a jewelry campaign set"
  finalSrc="bts-to-final/lauren-bts-to-final-jewelry-campaign-final-01.webp"
  finalAlt="Final jewelry campaign image"
  caption="Same brief. Different moment of trust."
>}}
```

### 6) Pull-quote over supporting imagery

```md
{{< media/pull-quote
  src="brand-portraits/lauren-brand-portraits-garden-vertical-02.webp"
  alt=""
  orientation="vertical"
  cite="Lauren Huffman"
  quote="The best photos aren’t taken. They’re created through trust, ease, and making people forget there’s a camera in the room."
>}}
```

Pass the quote exclusively via the `quote` attribute (not inner Markdown).

### Layouts / partials

```go-html-template
{{ partial "media/editorial-image.html" (dict
  "src" "teaching/lauren-teaching-studio-lighting-horizontal-01.webp"
  "alt" "Lauren teaching studio lighting"
  "orientation" "horizontal"
  "width" 2400
  "height" 1600
) }}
```

Available partials:

- `partials/media/editorial-image.html`
- `partials/media/captioned-image.html`
- `partials/media/bts-video.html`
- `partials/media/video.html`
- `partials/media/bts-final.html`
- `partials/media/pull-quote.html`
- `partials/media/path.html` (path resolver)
- `partials/media/scripts.html` (already included globally from `baseof`)

---

## Performance & accessibility checklist

1. Always set meaningful `alt` text (or empty alt for decorative supporting backgrounds).
2. Always set intrinsic `width` and `height`.
3. Prefer `loading="lazy"` except LCP/hero images (`eager` + optional `fetchpriority="high"`).
4. Every autoplay BTS clip needs a **poster** fallback.
5. Spoken/teaching clips need **controls** and ideally **captions**.
6. Keep BTS loops short and light; do not ship a JS video framework.
7. Respect reduced motion (handled by `/js/media.js` + CSS for `media/bts-video`).
8. Do not replace legacy `/images/*` paths sitewide in unrelated page work.

---

## What not to do

- Do not dump new authority assets into `static/images/` root.
- Do not autoplay video with sound.
- Do not introduce Vimeo/YouTube embed libraries for short BTS loops.
- Do not rewrite homepage/about copy just to showcase media components — page owners will adopt shortcodes where the story needs them.
- Do not commit multi‑hundred‑MB originals; export web masters before adding to the repo.

---

## Ownership

Media architecture, naming, and reusable media components are owned by the media/authority-asset lane. Page agents should consume the shortcodes/partials rather than inventing one-off markup for the same patterns.
