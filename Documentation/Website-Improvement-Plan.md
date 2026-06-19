# UkraïnaFest Castellón 2026 — Website Improvement Plan

**Document version:** 1.0
**Date:** 2026-06-11
**Author:** Valentyn Pidlypnyi
**Scope:** `public/` static site (7 pages: Home, About, Program, Location, Partners, Registration, Contacts)

---

## 1. Current State Summary

The site is a static HTML/CSS/JS implementation of the technical specification
("Тех Завдання сайт Ucrainafest"). It already includes:

- All 7 pages with shared header, navigation, and footer
- Bilingual UA / ES support with browser-language detection (`assets/js/i18n.js`)
- All 7 home page modules (Hero, About, Stats, Program cards, Zones, Location, Partners)
- Responsive layout, scroll-reveal animations, animated counters
- Registration form (client-side only, no backend)

The technical specification requires **WordPress** as the final CMS — the current
static site serves as the design/markup reference.

---

## 2. Improvement Areas

### Phase 1 — Content & Assets (High priority)

| # | Task | Details | Effort |
|---|------|---------|--------|
| 1.1 | Replace placeholder photos | The About collage uses Unsplash stock images. Replace with real photos: «Барвінок» ensemble performance, Ukrainian food, craft goods, festival visitors (per spec: "4 сочних фото") | S |
| 1.2 | Replace location photo placeholder | The blue gradient block should become a real photo of Ribalta Park / Castellón in a branded frame | S |
| 1.3 | Real partner logos | Replace "PARTNER 1–12" placeholders with actual partner logos (SVG/PNG, grayscale with color on hover) | S |
| 1.4 | 3D zones map | Module 5 is a placeholder banner. Integrate the designers' 3D map of festival zones when ready (image or interactive SVG) | M |
| 1.5 | Custom icons | Spec says all icons are drawn by designers. Replace emoji icons (🎵 🏺 🍔 🎤 🎨 🥟 🧸) with branded SVG icons | M |
| 1.6 | Favicon & social preview | Add full favicon set (16/32/180/512) and Open Graph / Twitter Card images for link sharing | S |

### Phase 2 — Functionality (High priority)

| # | Task | Details | Effort |
|---|------|---------|--------|
| 2.1 | Registration form backend | Form currently only shows a success message. Connect to a real endpoint: email service (e.g. Formspree / EmailJS) or the WordPress backend with spam protection (honeypot + reCAPTCHA) | M |
| 2.2 | Form validation UX | Add inline field-level error messages in both languages (currently relies on browser defaults) | S |
| 2.3 | Real social links | Footer/contact social icons point to `#`. Add real Instagram, Facebook, YouTube, TikTok URLs | XS |
| 2.4 | Real contact email | Confirm `hello@ukrainafest.es` or replace with the actual address everywhere | XS |
| 2.5 | Language in URL | Optionally reflect language as `?lang=ua` / `?lang=es` so links can be shared in a specific language | S |
| 2.6 | Cookie/consent banner | Required by GDPR for Google Maps embed and any future analytics (site operates in Spain/EU) | M |

### Phase 3 — SEO & Performance (Medium priority)

| # | Task | Details | Effort |
|---|------|---------|--------|
| 3.1 | Meta descriptions per page | Only Home has one; add unique localized descriptions to all 7 pages | S |
| 3.2 | `hreflang` annotations | Add `hreflang="uk"` / `hreflang="es"` alternates for the bilingual content | S |
| 3.3 | Structured data | Add JSON-LD `Event` schema (name, date 2026-10-24, location Ribalta Park, free admission) — enables rich results in Google | S |
| 3.4 | Sitemap + robots.txt | Generate `sitemap.xml` and `robots.txt` | XS |
| 3.5 | Self-host fonts | Manrope/Unbounded load from Google Fonts; self-hosting removes third-party requests and GDPR concerns | S |
| 3.6 | Image optimization | Serve WebP/AVIF with `srcset`; lazy-load below-the-fold images (partially done) | M |
| 3.7 | Lighthouse audit | Target ≥ 90 in Performance / Accessibility / Best Practices / SEO; fix findings | M |

### Phase 4 — Accessibility (Medium priority)

| # | Task | Details | Effort |
|---|------|---------|--------|
| 4.1 | Keyboard navigation | Verify focus states on nav, language switcher, mobile menu; add `:focus-visible` styles | S |
| 4.2 | Skip-to-content link | Add for screen reader / keyboard users | XS |
| 4.3 | Color contrast | Check yellow-on-white and muted text against WCAG AA; adjust where needed | S |
| 4.4 | Reduced motion | Respect `prefers-reduced-motion` — disable reveal animations and counters for those users | XS |
| 4.5 | ARIA for mobile menu | Add `aria-expanded` / `aria-controls` to the hamburger button | XS |

### Phase 5 — WordPress Migration (Per technical specification)

| # | Task | Details | Effort |
|---|------|---------|--------|
| 5.1 | Custom theme scaffold | Convert static pages into a WP theme in `clickandbuilds/ucrainafest/wp-content/themes/ukrainafest/` (`header.php`, `footer.php`, `front-page.php`, page templates) | L |
| 5.2 | Bilingual plugin | Polylang (free) or WPML; migrate the i18n dictionary into translations | M |
| 5.3 | Editable content | Move texts, stats, program timeline, and partner logos into WP options/ACF fields so organizers can edit without code | L |
| 5.4 | Contact Form 7 / WPForms | Replace static registration form with a WP form plugin (submissions stored + emailed) | M |
| 5.5 | Menus & widgets | Register WP nav menus and footer widget areas | S |
| 5.6 | Deployment checklist | SSL, caching plugin, backups, security hardening (the WP install already exists on the host) | M |

### Phase 6 — Nice-to-have Enhancements (Low priority)

| # | Task | Details | Effort |
|---|------|---------|--------|
| 6.1 | Countdown timer | Hero countdown to 24.10.2026 — builds anticipation | S |
| 6.2 | Photo gallery page | Galleries from previous events / artist photos with lightbox | M |
| 6.3 | Artist line-up section | Cards with photos and bios of performers as they are confirmed | M |
| 6.4 | News/announcements | Simple blog (native in WP) for festival updates | M |
| 6.5 | Newsletter signup | Email capture (Mailchimp/Brevo) in footer | S |
| 6.6 | Add-to-calendar button | `.ics` download / Google Calendar link in Hero and Location | S |
| 6.7 | Dark mode | Optional `prefers-color-scheme` support | M |

---

## 3. Suggested Execution Order

1. **Phase 2.3 / 2.4** — real links and email (minutes, high impact)
2. **Phase 1** — real content and assets as designers deliver them
3. **Phase 2.1 / 2.2 / 2.6** — working registration form + GDPR consent
4. **Phase 3 & 4** — SEO, performance, accessibility pass before launch
5. **Phase 5** — WordPress migration (required by the technical specification)
6. **Phase 6** — enhancements after launch

Effort legend: **XS** < 1 h · **S** 1–4 h · **M** 0.5–2 days · **L** 3+ days

---

## 4. Definition of Done (Launch Checklist)

- [ ] All placeholder images/logos replaced with real assets
- [ ] Registration form delivers submissions to organizers
- [ ] All social and email links are real
- [ ] UA and ES content reviewed by native speakers
- [ ] Lighthouse ≥ 90 on all four categories
- [ ] GDPR consent banner live
- [ ] JSON-LD Event schema validates in Google Rich Results Test
- [ ] Site migrated to WordPress and editable by organizers
- [ ] Tested on Chrome, Firefox, Safari, Edge + iOS/Android phones
