# Moments by LP — Master Integration TODO

Integration branch: `cursor/site-integration-qa-9a9e`  
Merged workstreams: Luxury Property (PR #2), Creative Journal (PR #3), Creator Community (PR #4), Authority Media (PR #5). PR #1 superseded by #2.

Customer journey wired as:

```
Instagram / Google / Referral → Moments by LP
  → Commercial (Property Services / Case Studies → Inquiry)
  → Authority (Creative Journal / Education / BTS → Events)
  → Community (Join Form → CRM/GHL → Community)
  → Relationship → Client / Attendee / Collaborator / Referral
```

DAT Media remains the supporting production/technology partner (footer + property page).

---

## CRITICAL BEFORE DEPLOY

- [ ] Merge/close agent PRs into this integration branch (or merge this PR and close #1–#5).
- [ ] Replace all Luxury Property placeholder images before any paid traffic or client outreach to that page (`static/images/property/PLACEHOLDERS.md`).
- [ ] Set Netlify env vars for community form: `GHL_API_KEY`, `GHL_LOCATION_ID` (see `docs/ghl-community-form.md`).
- [ ] Set `params.creativeJournal.forms.communityJoinAction` to `/.netlify/functions/community-join` in `hugo.yaml` after GHL fields/tags exist.
- [ ] Confirm `/.netlify/functions/community-join` is reachable in a Netlify deploy preview (catch-all 404 redirect must not block functions).
- [ ] Add a real `static/favicon.ico` (currently referenced sitewide, file missing).
- [ ] Smoke-test on production domain: nav, mobile menu, `/luxury-property-photography/`, `/creative-journal/`, `/creator-community/#join-creative-community`, `/content-and-coffee/`, `/book-a-brand-call/`.
- [ ] Confirm no secrets in repo or client JS (GHL key server-only; Shopify admin tokens never committed).
- [ ] Decide ticket URL for Content & Coffee — mailto fallback works, but a live ticket link is needed once sales open.
- [ ] Visual QA after real property images land (placeholders intentionally labeled today).

---

## CONTENT NEEDED FROM LAUREN

- [ ] Approve/edit Luxury Property page copy (positioning, packages, FAQ, DAT Media language).
- [ ] Provide a real property/hospitality case study (client-approved name, story, results — no fabricated testimonials).
- [ ] Finish Creative Journal essays currently marked Coming Soon / `noindex`:
  - Why Beautiful Photography Is No Longer Enough
  - Every Brand Needs a Visual Language
  - Community Over Competition
  - Why One Color Can Transform a Campaign
- [ ] Confirm speaking topics list in `data/creative-journal.yaml`.
- [ ] Community welcome/onboarding email copy for GHL workflow.
- [ ] Confirm Content & Coffee date, location detail, pricing, VIP inclusions, and ticket sales channel.
- [ ] Confirm Personal Brands vs Headshots vs Portraits naming in nav dropdown.
- [ ] Decide whether magazine SEO pages remain public or get de-emphasized vs Journal/Community.

---

## IMAGES/VIDEO NEEDED FROM CLAY

- [ ] Luxury property hero + gallery assets (see `static/images/property/PLACEHOLDERS.md`).
- [ ] Property OG image (`static/images/og-luxury-property.jpg`) from real campaign frame.
- [ ] DAT Media / production support image (replace placeholder).
- [ ] Creative Journal article images / OG images per essay.
- [ ] Authority media library drops into `static/media/authority/{category}/` using `docs/media-architecture.md` naming.
- [ ] BTS clips + posters for Journal “Behind the Work” and future property process sections.
- [ ] Favicon / app icon set.
- [ ] Optional: hero video reduced-motion still/poster (homepage hero still autoplays without reduced-motion fallback).

---

## GHL/AUTOMATION CONFIGURATION

- [ ] Create GHL custom fields: Instagram, city, primary role, community source, community interests (mapping in `docs/ghl-community-form.md`).
- [ ] Create tags from `data/creator-community.yaml` (`community-member` + role/interest tags).
- [ ] Private Integration with Contacts write access; store key only in Netlify env.
- [ ] Enable `communityJoinAction` in `hugo.yaml`.
- [ ] Workflow: new community member → welcome email / next-event nudge.
- [ ] Optional: wire Creative Journal waitlist + speaking inquiry actions (still empty on purpose).
- [ ] Optional: MailerLite `accountId` / `formId` for newsletter embed.
- [ ] Property inquiry attribution: confirm `/book-a-brand-call/` GHL/AgentBoost form captures “Luxury Property” source (UTM or hidden field).
- [ ] Event registration: ticket platform or GHL event pipeline for Content & Coffee.

---

## SEO

- [ ] Keep Coming Soon journal posts `noindex` until published; remove `noindex` + `comingSoon` when live.
- [ ] After property images ship, refresh LPP meta description/OG with real visual.
- [ ] Review sitewide Service + WebPage JSON-LD added for `serviceType` pages (from LPP PR) — confirm titles/areaServed are acceptable for all service pages.
- [ ] Add internal links from location SEO pages to Commercial / Property where relevant (not spammy).
- [ ] Submit updated sitemap after deploy; verify `/luxury-property-photography/` and `/creative-journal/` indexed.
- [ ] Canonical/baseURL already `https://moments-by-lp.com/` — confirm DNS + Netlify domain match.
- [ ] Avoid duplicate authority content between Magazine and Creative Journal; Journal is the thought-leadership hub.
- [ ] Consider consolidating or clearly labeling thin magazine section stubs vs Journal.

---

## NICE TO HAVE LATER

- [ ] Fully data-driven reusable events system (outcomes/schedule/includes still Content & Coffee–specific in `event-landing.html`).
- [ ] Adopt authority media shortcodes in Journal essays and property BTS sections once assets exist.
- [ ] Gate `/js/media.js` to pages that use media components (currently deferred sitewide, ~2KB).
- [ ] Homepage hero reduced-motion / poster fallback.
- [ ] Property gallery lightbox or case-study pages instead of raw JPEG links.
- [ ] Implement or remove unused `lpp-gallery__item--tall` class.
- [ ] Dual-form clarity on Journal (coffee-call waitlist vs community join) — copy pass.
- [ ] Shopify placeholders still present — hide shop UI (`params.shopify.enabled: false`) until store is ready.
- [ ] Add Inquire secondary path for portrait booking (`/book/`) in nav dropdown if portrait volume grows.
- [ ] Accessibility polish: `aria-describedby` on form errors; `aria-controls` on journal category filters.
- [ ] Migrate `.Site.Data` → `hugo.Data` to clear Hugo deprecation warning.

---

## Integration commits on this branch (reference)

1. Merge media architecture, Creative Journal, Luxury Property, Creator Community.
2. Align primary navigation and footer with the customer journey (+ mobile menu).
3. Wire Commercial, Journal, Community, and Property journey links + event front-matter titles.
4. This MASTER TODO.
