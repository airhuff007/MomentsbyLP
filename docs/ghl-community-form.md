# Creator Community → GoHighLevel Integration

Lead-capture for the Moments by LP Creator Community. Extends the existing Creative Journal `.cj-form` architecture (no second form system).

## Data flow

```
Browser (join form)
  → client validation + honeypot
  → POST FormData to communityJoinAction
      → Netlify Function: /.netlify/functions/community-join
          → GoHighLevel Contacts Upsert API (server-side API key)
          → tags + custom fields applied
  ← JSON { ok: true } / error
  → success / error UI state
```

Until `params.creativeJournal.forms.communityJoinAction` is set, the form validates client-side and shows a local success state (same pattern as waitlist / speaking / newsletter forms).

**Secrets never ship to the browser.** Only the public form action URL is in Hugo config. `GHL_API_KEY` and `GHL_LOCATION_ID` live in Netlify environment variables and are read only by the function.

## Reusable front-end

| Piece | Path |
|-------|------|
| Form partial | `layouts/partials/join-creative-community-form.html` |
| Panel wrapper | `layouts/partials/join-creative-community-panel.html` |
| Shortcode | `{{</* join-creative-community */>}}` |
| Roles / interests data | `data/creator-community.yaml` |
| Shared validation / loading / honeypot | `layouts/partials/creative-journal-scripts.html` |
| Backend function | `netlify/functions/community-join.js` |

### Placement

| Surface | How |
|---------|-----|
| Creator Community page | Custom layout embeds the panel |
| Creative Journal | Community section CTA → `/creator-community/#join-creative-community` (form not duplicated in CJ) |
| Homepage | Community CTA band → community page form |
| Event pages | Shortcode or link to `#join-creative-community` |
| Anywhere in Markdown | `{{</* join-creative-community idPrefix="events" */>}}` |

## Form fields → GHL contact mapping

| Form field (`name`) | GHL target | Notes |
|---------------------|------------|-------|
| `first_name` | `firstName` | Required |
| `last_name` | `lastName` | Required |
| `email` | `email` | Required; upsert key |
| `phone` | `phone` | Optional |
| `instagram` | Custom field `instagram` | Required in UI |
| `city` | Custom field `city` | Required |
| `primary_role` | Custom field `primary_role` + role tag | Select value = tag slug |
| `interests` | Custom field `community_interests` + interest tags | Multi checkbox |
| `consent` | Gate only (`yes` required) | Not stored as marketing copy |
| `source` | Custom field `community_source` | Always `join-creative-community` |
| `tags` | Base tag seed | `community-member` |
| `website` | Honeypot | Discarded; never sent to GHL |

Create these **custom fields** in the GHL location (or map keys to your existing field IDs and update the function):

- `instagram` (text)
- `city` (text)
- `primary_role` (text)
- `community_source` (text)
- `community_interests` (text / textarea)

If your location uses field IDs instead of keys, change `customFields` in `community-join.js` to `{ id: '<fieldId>', field_value: '...' }`.

## Tag mapping

Always applied:

- `community-member`

### Role tags (`primary_role` value)

| UI label | Tag |
|----------|-----|
| Photographer | `role-photographer` |
| Model | `role-model` |
| Content Creator | `role-content-creator` |
| Videographer | `role-videographer` |
| Makeup Artist | `role-makeup-artist` |
| Stylist | `role-stylist` |
| Brand/Business Owner | `role-brand-owner` |
| Other | `role-other` |

### Interest tags (checkbox values)

| UI label | Tag |
|----------|-----|
| Collaborations | `interest-collaboration` |
| Educational events | `interest-education` |
| Styled shoots | `interest-styled-shoots` |
| Portfolio building | `interest-portfolio` |
| Creative Coffee | `interest-creative-coffee` |
| Casting opportunities | `interest-casting` |
| Photography education | `interest-photography-education` |
| Community calls | `interest-community-calls` |

Create these tags in GHL before go-live (or allow the API to create them if your plan supports it).

## Required environment variables

Set in **Netlify → Site settings → Environment variables** (never commit real values):

| Variable | Where used | Purpose |
|----------|------------|---------|
| `GHL_API_KEY` | Netlify Function only | Private Integration / API token |
| `GHL_LOCATION_ID` | Netlify Function only | Location ID for contact upsert |
| `GHL_API_BASE` | Optional | Default `https://services.leadconnectorhq.com` |
| `GHL_API_VERSION` | Optional | Default `2021-07-28` |

Hugo / public config (`hugo.yaml`):

```yaml
params:
  creativeJournal:
    forms:
      communityJoinAction: "/.netlify/functions/community-join"
```

Leave `communityJoinAction` empty in local/dev builds until the function + GHL credentials are ready. The UI still validates and shows a pending-CRM success state.

Also documented in `.env.example` for operator reference (Hugo does not read `.env`).

## Remaining configuration checklist

1. Create GHL custom fields listed above (or remap IDs in the function).
2. Create GHL tags listed above.
3. Create a GHL Private Integration with Contacts write access; copy the token.
4. Copy the Location ID.
5. Set `GHL_API_KEY` and `GHL_LOCATION_ID` in Netlify (Production + Deploy Previews as needed).
6. Set `params.creativeJournal.forms.communityJoinAction` to `/.netlify/functions/community-join`.
7. Deploy and submit a test lead; confirm contact + tags in GHL.
8. Optional: attach a GHL workflow on tag `community-member` for welcome email / pipeline stage.

## Spam mitigation

- Honeypot field `website` (hidden; bots that fill it get a fake success; server also no-ops).
- Required consent checkbox.
- Server-side allowlists for role and interest tag values.
- No API keys in client HTML/JS.

Captcha/Turnstile is not in the repo today; add later in the function + form if abuse appears.

## Files changed (this feature)

- `data/creator-community.yaml`
- `layouts/partials/join-creative-community-form.html`
- `layouts/partials/join-creative-community-panel.html`
- `layouts/shortcodes/join-creative-community.html`
- `layouts/creator-community/list.html`
- `layouts/partials/creative-journal-scripts.html` (loading, async POST, honeypot)
- `layouts/creative-journal/list.html` (CTA target only)
- `layouts/index.html` (homepage community CTA)
- `layouts/_default/event-landing.html` (optional community CTA band)
- `content/creator-community/_index.md`
- `content/magazine/events/_index.md` (short CTA link)
- `static/css/main.css`
- `hugo.yaml`
- `.env.example`
- `netlify/functions/community-join.js`
- `docs/ghl-community-form.md`
