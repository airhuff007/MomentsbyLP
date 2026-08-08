# Creative Journal — Author Guide

The Creative Journal is Moments by LP’s thought-leadership hub at `/creative-journal/`.

It positions Lauren as a commercial photographer, creative director, educator, creative-business thinker, South Florida community builder, and potential podcast guest / speaker.

Articles are Markdown content files — not hardcoded HTML.

---

## Create a new article

From the project root:

```bash
hugo new creative-journal/your-article-slug.md
```

Or copy `archetypes/creative-journal.md` / an existing file in `content/creative-journal/`.

### Front matter fields

| Field | Purpose |
| --- | --- |
| `title` | Essay title |
| `description` | Short summary used on cards + SEO |
| `date` | Publish / intended date (`YYYY-MM-DD`) |
| `comingSoon` | `true` shows a “Coming Soon” teaser on the hub without a full read link |
| `draft` | `true` hides the file from normal Hugo builds entirely |
| `category` | One of the official categories below |
| `featured` | `true` promotes the essay into the large Featured Ideas slot |
| `image` / `imageAlt` | Card + article hero image |
| `author` | Defaults to Lauren Huffman in the template if omitted |
| `readingTime` | Display string such as `6 min` |
| `noindex` | Set `true` while an essay is still a stub |
| `keywords` | Optional SEO keywords |

### Official categories

Use these exact `category` values:

- `Creative Direction`
- `Photography`
- `Creative Business`
- `Community`
- `Behind the Work`

Defined in `data/creative-journal.yaml` under `categories`.

### Draft vs Coming Soon

- **Coming Soon teaser (recommended while writing):**  
  `comingSoon: true`, omit `draft` (or set `draft: false`), optionally `noindex: true`.  
  The essay appears on the hub as a teaser card.
- **Hidden from the site:**  
  `draft: true`. Hugo will not output the page unless you build with `-D`.

### Publish a finished essay

1. Write the full Markdown body.
2. Set `comingSoon: false`.
3. Set `draft: false` (or remove `draft`).
4. Remove `noindex` (or set `noindex: false`).
5. Confirm category, image, description, and reading time.
6. Build locally: `hugo --gc --minify`
7. Commit and deploy.

### Content standards

- Do not fabricate Lauren’s experiences, clients, credentials, or results.
- Prefer grounded creative-direction, photography, business, and community insights.
- Keep the voice editorial and practical — not a generic photography blog.

---

## How featured posts work

The hub layout (`layouts/creative-journal/list.html`) loads all Creative Journal pages and splits them:

1. **Featured slot** — first page with `featured: true` (newest-first among matches).
2. **Supporting grid** — every other article.

Rules of thumb:

- Keep **only one** article with `featured: true` at a time.
- Featured essays still respect `comingSoon` (teaser vs full read link).
- Category filter buttons on the hub filter featured + supporting cards client-side.
- Hub category labels / expertise / speaking topics / case studies live in `data/creative-journal.yaml` so Clay/Lauren can update copy without editing layouts.

To feature a different essay:

```yaml
featured: true
```

…on that article’s front matter, and set `featured: false` on the previous one.

---

## Hub sections (owned by layouts + data)

| Section | Source |
| --- | --- |
| Editorial hero | `layouts/creative-journal/list.html` |
| Featured Ideas | Markdown files in `content/creative-journal/` |
| What Lauren Explores | `data/creative-journal.yaml` → `expertise` |
| Behind the Work | `data/creative-journal.yaml` → `caseStudies` |
| Community Over Competition | layout + `communityPillars` |
| Creative Coffee Calls waitlist | layout + waitlist partial |
| Speaking & Conversations | layout + `speakingTopics` + speaking form |
| Newsletter CTA | newsletter form partial |
| SEO / structured data | `layouts/partials/head.html` + `schema.html` |

Form endpoints are configured in `hugo.yaml` under `params.creativeJournal.forms`.

---

## Local preview

```bash
hugo server -D
```

`-D` includes Hugo drafts. For production-like output (Coming Soon teasers only if `draft` is false):

```bash
hugo --gc --minify
```

Open `http://localhost:1313/creative-journal/`.
