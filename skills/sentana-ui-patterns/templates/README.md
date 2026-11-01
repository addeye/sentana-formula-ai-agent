# Sentana UI Patterns - Web Templates

Minimal runnable HTML previews demonstrating standard Sentana layout proportions for authentication and admin workspaces using Tailwind CSS and Bootstrap 5.

## Structure

```text
templates/
├── README.md              # Template documentation, references, and integration guide
├── check-templates.js     # Standard library Node.js verification script
├── demo.css               # Shared layout and accessibility baseline styles
├── demo.js                # Local in-memory state, search, and form demo logic
├── tailwind/
│   ├── login.html         # Centered authentication card (max-w-md, 44px inputs)
│   └── admin.html         # Admin shell (sidebar, search, table states, create/edit form)
└── bootstrap5/
    ├── login.html         # Centered authentication card using Bootstrap utility & card
    └── admin.html         # Admin shell using Bootstrap grid, forms, and responsive table
```

## Visual Direction and Themes

Modern, restrained business admin: navy establishes workspace identity and teal marks primary actions and the current navigation destination. ENERGY 1 / RHYTHM 1 / MOTION 1. System fonts keep dense inventory labels readable without another network dependency. Spacing separates page heading, filters, and table; a bounded 440px login keeps form scanning short. Panels group actual forms and data, not decorative metrics. The sidebar indicator identifies the current page; hover is the only motion, disabled for reduced-motion users.

All four pages have a labeled, 44px System / Light / Dark selector. `theme.js` runs synchronously in the head before framework assets, applies `data-theme`, Bootstrap's `data-bs-theme`, and native `color-scheme`, then binds the selector. System is the default and follows OS changes. Manual modes ignore OS changes. Only the validated `sentana-theme` preference is stored in localStorage, with read/write exceptions handled; inventory and credentials remain unpersisted. Serve the previews on the same origin to share the preference reliably (file URL storage behavior varies by browser).

`demo.css` owns semantic surface, text, boundary, and accent variables. Tailwind v4 `@theme inline` maps those to utility tokens; Bootstrap uses its native color-mode attribute and component variables. Input borders remain `#64748b` in both modes, with readable muted text and visible keyboard focus. No theme dependency or generated stylesheet is added.

## Preview Usage

Open any of the HTML files directly in a modern web browser:
- `tailwind/login.html`: Tailwind CSS login card preview
- `tailwind/admin.html`: Tailwind CSS admin shell and product inventory workspace
- `bootstrap5/login.html`: Bootstrap 5 login card preview
- `bootstrap5/admin.html`: Bootstrap 5 admin shell and product inventory workspace

> **Important Caveat:** These previews use remote CDN resources and require an active internet connection to render framework styles. These CDN links are strictly for rapid local prototyping and are **not suitable for production environments**.

## Demo Boundaries (No Fake Production)

- **Authentication:** Demo sign-in clears the password field and displays a notice. No credentials are stored in cookies, localStorage, or sent across any network.
- **Data Persistence:** Inventory lists, search filters, and create/edit forms operate purely in browser memory via `demo.js`. Reloading the page resets all records to initial defaults.
- **State Simulations:** The state dropdown in the admin shells allows inspecting Normal, Loading (skeleton), Empty (call-to-action), and Error states locally without network mocks.
- **Component Stack:** Plain semantic HTML5 and vanilla JavaScript. These templates do **not** use React, Vue, or shadcn/ui components.

## Official Framework References & Licenses

| Framework | Version | Official Source | License |
|---|---|---|---|
| Tailwind CSS | v4.x (Play CDN `@tailwindcss/browser@4`) | [tailwindcss.com](https://tailwindcss.com/) | MIT License (Tailwind Labs Inc.) |
| Bootstrap | v5.3.8 | [getbootstrap.com](https://getbootstrap.com/) | Code: MIT License, Docs: CC BY 3.0 |

Official installation sources checked during implementation:
- [Tailwind Play CDN](https://tailwindcss.com/docs/installation/play-cdn): documents the exact `@tailwindcss/browser@4` URL and development-only restriction. This is a floating major version, not a reproducible pinned build.
- [Bootstrap introduction](https://getbootstrap.com/docs/5.3/getting-started/introduction/): documents the 5.3.8 CSS URL and matching integrity hash used here. Bootstrap JavaScript is unnecessary: mobile navigation uses a native modal `<dialog>` rather than a plugin.
- License texts: [Tailwind MIT](https://github.com/tailwindlabs/tailwindcss/blob/main/LICENSE), [Bootstrap MIT](https://github.com/twbs/bootstrap/blob/main/LICENSE). Preserve upstream notices when redistributing. Framework licenses do not automatically license this repository's own templates; check repository terms separately. No paid theme assets are included.

Below 768px the topbar Menu button opens a native modal drawer with a dark backdrop. Native modal behavior supplies Escape dismissal, focus containment and background inertness; Close/backdrop dismissal restores the Menu button. The same navigation node moves back to the desktop sidebar at 768px, without duplicate links. Without JavaScript or native dialog support, an initially open in-flow disclosure keeps navigation usable at every width. This disclosure is a resilience fallback, not the enhanced mobile baseline. No backend, remember-me, password recovery, deletion, or pagination is simulated. Use only invented test values: third-party CDN scripts execute in the page, and browsers/password managers may ignore `autocomplete="off"`.

## Production Integration Requirements

To adapt these templates for production web applications:
1. **Asset Bundling:** Remove remote CDN script/link tags. Install dependencies via npm/yarn/pnpm and configure a build pipeline (Vite, Next.js, Laravel Vite, or Tailwind CLI / PostCSS).
2. **Backend Authentication & CSRF:** Connect forms to real server endpoints with CSRF tokens, secure session cookies (HttpOnly, SameSite=Lax/Strict), and rate-limiting.
3. **API Integration & Persistence:** Replace `demo.js` with real API client logic (fetch/axios/React Query) backed by database persistence and server-side pagination.
4. **Server-Side Validation:** Replicate all client-side validation rules (type, range, sanitization) on the server.
5. **Accessibility & Responsive Testing:** Verify keyboard tab order, screen reader labels, and touch targets across target screen viewports and assistive technologies.

## Automated Verification

Run the stdlib Node.js verification script:

```bash
node skills/sentana-ui-patterns/templates/check-templates.js
node skills/sentana-ui-patterns/templates/check-behavior.js
node skills/sentana-ui-patterns/templates/check-theme.js
node --check skills/sentana-ui-patterns/templates/demo.js
```

The behavior check uses a small DOM double to exercise retry focus, edit/cancel focus across row replacement, and drawer breakpoint transitions. It does not prove native focus trapping, Escape behavior, rendered contrast, viewport layout or screen-reader output. Check those in a real browser before production use. Input boundaries use explicit `#64748b` (4.76:1 against white), and `.demo-link` uses inline-flex so its 44px minimum height applies.
