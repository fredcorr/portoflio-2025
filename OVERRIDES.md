# npm `overrides` — track record

This file documents every entry in the `overrides` block of the root
`package.json`, why it exists, and the condition under which it can be removed.

**Overrides are temporary patches, not permanent config.** Most force a
*patched* version of a transitive dependency ahead of the upstream package that
pulls it in (Sanity's CLI/build tree, Next's bundled tooling, the ESLint 9
chain). They should be deleted once upstream catches up.

## How to check these on each dependency routine

A clean `npm audit` only proves the overrides are *working*, not that they're
still *needed* (with the pin in place, the vulnerable version never appears).
To find stale pins, **test-remove** each one:

1. Delete the override from `package.json`.
2. Run a real `npm install` (not `--package-lock-only` — it applies overrides
   unreliably), then `npm audit`.
3. If audit stays clean and the package resolves to a safe version, the
   override is **obsolete → delete it** and update this file.
4. If a vulnerability or an old version returns, it's **still required → keep
   it**; re-check its "Remove when" condition below.

Skip the **structural** pins (bottom section) — those are permanent, not
security-lag.

---

## Security / transitive pins (subject to the staleness check)

### Added 2026-07 — Sanity 4→6 upgrade security pass (`npm audit` 28 high → 0)

| Override | Advisory (run `npm audit` for the live ID) | Pulled in by | Remove when |
|---|---|---|---|
| `minimatch → ^10.2.6` | classic `brace-expansion` DoS (`<=5.0.7`) via old `minimatch ^3.1.x`; v10 uses the patched brace-expansion 5.x natively (forcing brace-expansion alone breaks minimatch 3's export shape) | the **ESLint 9** ecosystem (`eslint`, `eslint-plugin-import/jsx-a11y/react`) | we can move to **ESLint 10** — blocked today by `eslint-plugin-react`'s `eslint ^9.7` cap. Watch that plugin. |
| `postcss → ^8.5.24` | sourceMappingURL path traversal + `</style>` XSS (`<=8.5.17`) | **Next** (bundles its own postcss 8.4.31) | Next bumps its bundled postcss |
| `sharp → ^0.35.3` | inherited libvips CVEs (GHSA-f88m-g3jw-g9cj, `<0.35.0`) | **Next**'s optional image dep (requested `^0.34.5`) | Next moves to sharp ≥0.35 |
| `adm-zip → ^0.6.0` | crafted ZIP → 4 GB alloc DoS (`<0.6.0`) | **Sanity CLI** tree | `@sanity/cli` bumps adm-zip |
| `js-yaml@3.13.1 → ^4.3.0` | merge-key quadratic DoS (GHSA-h67p-54hq-rp68, `>=3.0.0 <3.15.0`); the 3.x line has no fix, so this is a **cross-major** pin | `@vercel/frameworks`, inside **Sanity CLI** (build-time only) | `@sanity/cli` / `@vercel/frameworks` moves off js-yaml 3.x. **Highest-risk pin — retire first.** |
| `uuid@10.0.0 → 11.1.1` | missing buffer bounds check in v3/v5/v6 (GHSA-w5hq-g745-h8pq, `<11.1.1`); targeted to just the vulnerable copy | `typeid-js`, inside **Sanity** | `typeid-js`/Sanity bumps uuid |
| `smol-toml → ^1.7.1` | DoS via many commented lines (`<1.6.1`) | a Sanity/Vercel build tool | parent bumps smol-toml |

### Pre-existing (present before the Sanity 6 pass)

Reasons were not recorded when these were introduced — this table is a
best-effort reconstruction. **Confirm/replace each with its real advisory on the
next audit**, or test-remove to see if it's already obsolete.

| Override | Likely reason | Notes |
|---|---|---|
| `js-yaml@3.14.1 → 3.14.2` | js-yaml prototype-pollution / merge-key advisory | version-targeted; pairs with the new `js-yaml@3.13.1` pin |
| `js-yaml@4.1.0 → 4.1.1` | js-yaml advisory (4.x line) | version-targeted |
| `qs → 6.15.3` | classic `qs` prototype-pollution / ReDoS advisory | verify ID |
| `markdown-it → 14.2.0` | markdown-it advisory | verify ID |
| `lodash-es → 4.18.1` | lodash advisory | verify ID |
| `tar@7.5.1 → 7.5.2` | tar advisory | version-targeted |
| `min-document@2.19.0 → 2.19.2` | min-document advisory | version-targeted |
| `@isaacs/brace-expansion → 5.0.1` | brace-expansion DoS (scoped fork) | pairs with the `minimatch` pin above |
| `hono → ^4.11.9` | version floor / advisory (Sanity Functions runtime) | confirm whether security or compat |
| `@modelcontextprotocol/sdk → ^1.25.4` | version floor (figma-developer-mcp / Sanity MCP) | likely compat, not security — confirm |
| `@actions/http-client → 4.0.0` | GitHub Actions tooling pin (Sanity blueprint) | likely compat — confirm |
| `@actions/github → 9.0.0` | GitHub Actions tooling pin | likely compat — confirm |

---

## Structural pins (permanent — NOT part of the staleness check)

These force a single version across the monorepo workspaces; they are hygiene,
not security-lag, and should stay.

| Override | Reason |
|---|---|
| `react → ^19.2.4` | one React copy across all workspaces (two copies break hooks) |
| `react-dom → ^19.2.4` | matches `react` |
| `@types/react → ^19.2.14` | single React type version across workspaces |
| `@types/react-dom → ^19.2.3` | matches `@types/react` |
| `rxjs → ^7.8.2` | dedupe rxjs (used heavily by Sanity) to one recent version |

---

_Last reconciled: 2026-07-28 (Sanity 6 upgrade, PR #30). Update this file
whenever an override is added or removed._
