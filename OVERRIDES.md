# npm `overrides` — track record

This file documents every entry in the `overrides` block of the root
`package.json`, why it exists, and the condition under which it can be removed.

**Overrides are temporary patches, not permanent config.** Most force a
_patched_ version of a transitive dependency ahead of the upstream package that
pulls it in (Sanity's CLI/build tree, Next's bundled tooling, the ESLint 9
chain). They should be deleted once upstream catches up.

## How to check these on each dependency routine

A clean `npm audit` only proves the overrides are _working_, not that they're
still _needed_ (with the pin in place, the vulnerable version never appears).
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

| Override               | Advisory (run `npm audit` for the live ID)                                                                                                                                                             | Pulled in by                                                                                                                         | Remove when                                                                                                   |
| ---------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------- |
| `minimatch → ^10.2.6`  | classic `brace-expansion` DoS (`<=5.0.7`) via old `minimatch ^3.1.x`; v10 uses the patched brace-expansion 5.x natively (forcing brace-expansion alone breaks minimatch 3's export shape)              | the **ESLint 9** ecosystem (`eslint`, `eslint-plugin-import/jsx-a11y/react`)                                                         | we can move to **ESLint 10** — blocked today by `eslint-plugin-react`'s `eslint ^9.7` cap. Watch that plugin. |
| `postcss → ^8.5.24`    | sourceMappingURL path traversal + `</style>` XSS (`<=8.5.17`)                                                                                                                                          | **Next** (bundles its own postcss 8.4.31)                                                                                            | Next bumps its bundled postcss                                                                                |
| `sharp → ^0.35.3`      | inherited libvips CVEs (GHSA-f88m-g3jw-g9cj, `<0.35.0`)                                                                                                                                                | **Next**'s optional image dep (requested `^0.34.5`)                                                                                  | Next moves to sharp ≥0.35                                                                                     |
| `adm-zip → ^0.6.0`     | crafted ZIP → 4 GB alloc DoS (`<0.6.0`)                                                                                                                                                                | **Sanity CLI** tree                                                                                                                  | `@sanity/cli` bumps adm-zip                                                                                   |
| `js-yaml → ^4.3.1`     | merge-key quadratic DoS (GHSA-h67p-54hq-rp68, `>=3.0.0 <3.15.0`) **plus** `!!omap` quadratic CPU (GHSA-5p4m-2wfm-xmqj, `>=4.0.0 <4.3.1`); the 3.x line has no fix, so this stays a **cross-major** pin | `@vercel/frameworks` (pins `3.13.1`), inside **Sanity CLI** (build-time only); `@eslint/eslintrc` and `figma-developer-mcp` want 4.x | `@sanity/cli` / `@vercel/frameworks` moves off js-yaml 3.x. **Highest-risk pin — retire first.**              |
| `uuid@10.0.0 → 11.1.1` | missing buffer bounds check in v3/v5/v6 (GHSA-w5hq-g745-h8pq, `<11.1.1`); targeted to just the vulnerable copy                                                                                         | `typeid-js`, inside **Sanity**                                                                                                       | `typeid-js`/Sanity bumps uuid                                                                                 |
| `smol-toml → ^1.7.1`   | DoS via many commented lines (`<1.6.1`)                                                                                                                                                                | a Sanity/Vercel build tool                                                                                                           | parent bumps smol-toml                                                                                        |

### Added 2026-08 — audit pass (`npm audit` 14 → 0)

| Override             | Advisory                                                                                                                                                                                                                                                                                                                                          | Pulled in by                                                                                                                                                                         | Remove when                                                                                                                                                               |
| -------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `undici@7 → ^7.29.0` | five advisories fixed in 7.29.0: cross-user disclosure via private cache directives (GHSA-4cwx-7wf7-3272, high), response desync via retry interceptor (GHSA-8xcm-r25x-g524), CRLF injection via blob `type` (GHSA-m8rv-5g2x-5cg5), cache-directive whitespace disclosure (GHSA-jr45-8vmc-qm54), cookie attribute injection (GHSA-v3r7-h72x-cjcm) | `@module-federation/dts-plugin` **exact-pins `7.28.0`**, inside `@sanity/workbench-cli` → `@sanity/cli`. This one node also caused the `sanity` package itself to show as vulnerable | `@module-federation/dts-plugin` bumps undici. Selector is scoped to the **7.x line** so the `@actions/*` 6.28.0 copies are left alone — do not widen it to bare `undici`. |

#### Fixed without an override (lockfile refresh only)

These were all **already satisfiable inside their parents' existing ranges** — the
lockfile was simply stale, so `npm update <pkg>` fixed them and no permanent pin
was added. Prefer this route before reaching for an override.

| Package           | Advisory                                                                                                                     | Resolved                                                |
| ----------------- | ---------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------- |
| `brace-expansion` | DoS via unbounded intermediate arrays, bypassing the CVE-2026-14257 mitigation (GHSA-rgw5-rvv9-x895, high, `>=4.0.0 <5.0.9`) | 5.0.8 → 5.0.9 (`minimatch` wants `^5.0.8`)              |
| `dompurify`       | `IN_PLACE` hook removal leaves a detached subtree executable → XSS (GHSA-55q2-fjhq-7xh7, `<=3.4.12`)                         | 3.4.12 → 3.4.13 (`isomorphic-dompurify` wants `^3.3.1`) |
| `fast-uri`        | host confusion via backslash authority introducer (GHSA-7p8r-x3mc-p8w7, high, `>=3.0.0 <3.1.5`)                              | 3.1.4 → 3.1.5 (`ajv` wants `^3.0.1`)                    |
| `nanoid`          | custom generators loop indefinitely when size is 0 (GHSA-2v37-7h3g-55p8, high, `<3.3.17`)                                    | 3.3.16 → 3.3.18 (`postcss` wants `^3.3.16`)             |

> Note: the 5.x/6.x `nanoid` copies in the Sanity tree are outside the advisory
> range (`<3.3.17`) and were not affected.

### Pre-existing (present before the Sanity 6 pass)

Reasons were not recorded when these were introduced — this table is a
best-effort reconstruction. **Confirm/replace each with its real advisory on the
next audit**, or test-remove to see if it's already obsolete.

| Override                              | Likely reason                                                                                                                                                                                                                                             | Notes                                                                                                                                                                                  |
| ------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `qs → 6.15.3`                         | classic `qs` prototype-pollution / ReDoS advisory                                                                                                                                                                                                         | verify ID                                                                                                                                                                              |
| `markdown-it → 14.2.0`                | markdown-it advisory                                                                                                                                                                                                                                      | verify ID                                                                                                                                                                              |
| `lodash-es → 4.18.1`                  | lodash advisory                                                                                                                                                                                                                                           | verify ID                                                                                                                                                                              |
| `tar@7.5.1 → 7.5.2`                   | tar advisory                                                                                                                                                                                                                                              | version-targeted                                                                                                                                                                       |
| `min-document@2.19.0 → 2.19.2`        | min-document advisory                                                                                                                                                                                                                                     | version-targeted                                                                                                                                                                       |
| `@isaacs/brace-expansion → 5.0.1`     | brace-expansion DoS (scoped fork)                                                                                                                                                                                                                         | pairs with the `minimatch` pin above                                                                                                                                                   |
| `hono → ^4.12.34`                     | **security** — confirmed 2026-08: CORS ReDoS (GHSA-8j4g-w8fx-2239), `memo()` SSR cross-user leak (GHSA-f23p-vx2j-j53r), Proxy Helper `Connection` header leak (GHSA-79qm-7rj5-m7r9), Language middleware DoS (GHSA-54fx-42gc-7vw4) — all fixed in 4.12.34 | pulled in by `@hono/node-server` (`^4`) and `@modelcontextprotocol/sdk` (`^4.11.4`); both ranges already admit the fix, so this is a **floor, not a force** — test-remove it next pass |
| `@modelcontextprotocol/sdk → ^1.25.4` | version floor (figma-developer-mcp / Sanity MCP)                                                                                                                                                                                                          | likely compat, not security — confirm                                                                                                                                                  |
| `@actions/http-client → 4.0.0`        | GitHub Actions tooling pin (Sanity blueprint)                                                                                                                                                                                                             | likely compat — confirm                                                                                                                                                                |
| `@actions/github → 9.0.0`             | GitHub Actions tooling pin                                                                                                                                                                                                                                | likely compat — confirm                                                                                                                                                                |

---

## Structural pins (permanent — NOT part of the staleness check)

These force a single version across the monorepo workspaces; they are hygiene,
not security-lag, and should stay.

| Override                     | Reason                                                        |
| ---------------------------- | ------------------------------------------------------------- |
| `react → ^19.2.4`            | one React copy across all workspaces (two copies break hooks) |
| `react-dom → ^19.2.4`        | matches `react`                                               |
| `@types/react → ^19.2.14`    | single React type version across workspaces                   |
| `@types/react-dom → ^19.2.3` | matches `@types/react`                                        |
| `rxjs → ^7.8.2`              | dedupe rxjs (used heavily by Sanity) to one recent version    |

---

## Removed 2026-08

| Override                  | Why removed                                                                                                                                                                                                                       |
| ------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `js-yaml@3.14.1 → 3.14.2` | selector matched nothing — no package requests `3.14.1` any more. Folded into the single `js-yaml → ^4.3.1` pin.                                                                                                                  |
| `js-yaml@4.1.0 → 4.1.1`   | selector matched nothing, **and 4.1.1 is itself vulnerable** to GHSA-5p4m-2wfm-xmqj (`<4.3.1`) — it was a latent trap that would have installed a vulnerable copy had anything requested `4.1.0`. Folded into `js-yaml → ^4.3.1`. |

The three version-targeted `js-yaml` pins were consolidated into one unscoped
`js-yaml → ^4.3.1`. Effect is identical (the only 3.x consumer,
`@vercel/frameworks`, was already being force-upgraded across the major by the
old `js-yaml@3.13.1` pin), but there is now a single floor to bump.

---

## Non-override fix in the same pass: deduped `next`

Not an override, but recorded here because it was found by the same audit and
lives in the lockfile. `apps/web` declares `next: ^16.3.0`, but npm was also
hoisting a **second** copy at the root (`16.2.12`) to satisfy the peer ranges of
`@sanity/visual-editing`, `@vercel/analytics`, `@vercel/speed-insights` and
`botid`. Two copies of Next's types made `next.config.ts` fail
`tsc --noEmit` (`TS2345`, two structurally distinct `NextConfig` types), which
broke `web#typecheck` **and** `web#build` on a clean install.

`npm update next` collapsed both to a single root `next@16.3.0`. **No override
was needed** — a pin was tested and turned out to be unnecessary, so it was not
added. If the duplicate returns, re-run `npm update next` before considering a
structural pin.

---

_Last reconciled: 2026-08-09 (audit pass: 14 advisories → 0). Previously
2026-07-28 (Sanity 6 upgrade, PR #30). Update this file whenever an override is
added or removed._
