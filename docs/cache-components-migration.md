# Cache Components migration — evaluation and plan

**Status:** evaluation complete, not started
**Target:** `apps/web` on Next.js 16.3 (after [#44](https://github.com/fredcorr/portoflio-2025/pull/44) lands)
**Date:** 2026-08-08

---

## Verdict

The migration is viable and small — **6 files carry hard blockers, and every one has a mechanical fix.** A naive migration builds and serves a working site, which is exactly the danger: the caching silently disappears and nothing fails. The work is not in getting it to build, it's in deliberately restoring each cache that route-segment `revalidate` is giving us today.

Recommended sequencing: **land #44 first, migrate separately.** The two changes fail in different ways — #44's risk is a Vercel deploy-step failure, this one's risk is a silent caching regression — and bisecting them together is unpleasant.

---

## How this was verified

I ran real `next build`s against Next.js **16.3.0** (installed from PR #44's lockfile) with `cacheComponents: true`, iterating until the build passed, then diffed the route table against a baseline build of the current code.

**What that means for confidence:**

- **Verified by build output:** every blocker in the table below, the route-classification changes, and the revalidate/expire numbers.
- **Not verified:** anything requiring live Sanity data. This container's egress allowlist rejects `*.apicdn.sanity.io`, so the data layer was stubbed. Nothing in the findings depends on query _results_ — but the runtime behaviour of draft mode and visual editing was **not** exercised and needs a preview deploy to confirm.
- **Not verified:** the proposed fixes for the Footer blocker (see below). I confirmed only that the current code blocks the build.

---

## Current caching model

One fact drives this whole migration:

> **`@sanity/client` does not use the global `fetch`.** v7.25.0 routes through `get-it` → `follow-redirects` → Node's `http`. Next's fetch Data Cache never sees a Sanity query.

So there is no second caching layer underneath. Every cache the site has today comes from route-segment ISR:

| Route                       | Mechanism                 | Revalidate  |
| --------------------------- | ------------------------- | ----------- |
| `app/[[...slug]]/page.tsx`  | `export const revalidate` | 3600 (1h)   |
| `app/sitemap.ts`            | `export const revalidate` | 604800 (1w) |
| `app/llms.txt/route.ts`     | `export const revalidate` | 604800 (1w) |
| `app/api/journals/route.ts` | none (edge, per-request)  | —           |

`React.cache()` in `get-page.ts` / `get-settings.ts` dedupes within a single request. It is **not** a persistent cache and does not survive the request.

**Consequence:** remove `revalidate` without adding `'use cache'`, and every page render hits the Sanity API. The build still succeeds and the site still works. This is the regression to guard against.

---

## Hard blockers

All six confirmed by build failure. Fixes are mechanical except the last.

| #   | File                                        | Error                                                                                              | Fix                                              |
| --- | ------------------------------------------- | -------------------------------------------------------------------------------------------------- | ------------------------------------------------ |
| 1   | `app/[[...slug]]/page.tsx:18`               | `Route segment config "revalidate" is not compatible with cacheComponents`                         | Remove; replace with `'use cache'` + `cacheLife` |
| 2   | `app/llms.txt/route.ts:8`                   | same                                                                                               | same                                             |
| 3   | `app/sitemap.ts:7`                          | same                                                                                               | same                                             |
| 4   | `app/api/journals/route.ts:1`               | `Route segment config "runtime" is not compatible` — Cache Components requires the Node.js runtime | Delete `export const runtime = 'edge'`           |
| 5   | `app/[[...slug]]/page.tsx:77`               | `empty-generate-static-params` — must return ≥1 result                                             | See decision D2                                  |
| 6   | `components/organisms/Footer/Footer.tsx:17` | `blocking-prerender-current-time-client` — `new Date()` in a Client Component                      | See decision D3                                  |

Blocker 6 is the awkward one: it is **synchronous IO during prerender**, which `instant = false` explicitly does _not_ defer. It cannot be postponed to a later phase, and because `Footer` sits in the root layout it blocks _every_ route.

---

## Before / after

Both tables are real build output, same stubbed data, Next 16.3.0.

**Baseline (current code):**

```
┌ ○ /_not-found
├   /[[...slug]]
│ └ ● /                         1h      1y
├ ○ /llms.txt                   1w      1y
└ ○ /sitemap.xml                1w      1y
```

**After migration (`'use cache'` + `cacheLife` applied):**

```
┌ ○ /_not-found                 1h      1d
├   /[[...slug]]
│ ├ ◐ /[[...slug]]              1h      1d   ← new: App Shell for unknown slugs
│ └ ○ /                         1h      1d
├ ○ /llms.txt                   1w     30d
└ ○ /sitemap.xml                1w     30d
```

The `◐` row is a genuine win: slugs not covered by `generateStaticParams` currently **block** on first visit; under Cache Components they get an App Shell instantly and upgrade in the background.

The `expire` column is a genuine loss. See R1.

---

## Regression register

Ranked by risk. R1 and R2 are the ones that matter.

### R1 — `expire` collapses from 1 year to 1 day 🔴

The stock `cacheLife` presets are tighter than what ISR gives us today:

|            | today  | `cacheLife('hours')` | `cacheLife('weeks')` |
| ---------- | ------ | -------------------- | -------------------- |
| revalidate | 3600   | 3600 ✅              | 604800 ✅            |
| **expire** | **1y** | **1d** ❌            | **30d** ❌           |

`expire` is _"after this period with no traffic, the server regenerates synchronously on the next request"_ — i.e. the visitor waits for a live Sanity round-trip. On a portfolio site where most pages get little traffic, a large share of visits would land past a 1-day expiry and pay full latency. Today they'd be served stale-and-instant.

**Fix — custom profiles that reproduce today's numbers exactly:**

```ts
// apps/web/next.config.ts
cacheComponents: true,
cacheLife: {
  cmsPage:  { stale: 300, revalidate: 3600,   expire: 31536000 }, // was revalidate = 3600
  cmsIndex: { stale: 300, revalidate: 604800, expire: 31536000 }, // was revalidate = 604800
},
```

Then `cacheLife('cmsPage')` / `cacheLife('cmsIndex')` at the call sites. **Do not ship the stock presets.**

### R2 — silent loss of all Sanity caching 🔴

Because Sanity bypasses the fetch Data Cache (above), any data function that loses `revalidate` and doesn't gain `'use cache'` goes to **zero caching** — and the build stays green. In the experiment, `sitemap.xml` and `llms.txt` came back with a blank revalidate column until `'use cache'` was added explicitly.

**Guard:** the build's route table is the check. Every data-backed route must show a revalidate value. This belongs in the PR description as a pasted before/after, and ideally in CI.

### R3 — `use cache` is in-memory and does not persist across deploys 🟠

ISR entries today survive instance recycling. `use cache` entries do not — they are per-instance, in-memory, and keyed by build ID. On serverless this means noticeably more Sanity API calls, especially right after a deploy.

**Options:** accept it (a portfolio's Sanity volume is small), or use `'use cache: remote'` on the settings/page fetches. Remote also doesn't survive deploys, but it _is_ shared across instances. Recommend starting without it and measuring.

### R4 — `<Activity>` preserves component state across navigation 🟠

Cache Components keeps previous routes mounted in `"hidden"` mode instead of unmounting. Since the whole site is one catch-all route, every page-to-page navigation is affected. Components at risk:

- `Navigation.tsx` — `isOpen` mobile menu, `useFocusTrap`, `useLockScroll`. A menu left open could return open, with scroll still locked.
- `components/molecules/Form/Form.tsx` — react-hook-form values and submission state persist on back-navigation.
- `components/hoc/JournalsListingClient.tsx` — SWR page/filter state persists.
- `PageTransitionBoundary.tsx` — keyed on `pathname`; the transition animation may not re-fire.
- `CookieBanner`, Swiper carousels.

**Guard:** manual click-through of each. This is the least mechanical part of the migration and deserves its own pass.

### R5 — `/api/journals` moves from edge to Node 🟡

Removing `runtime = 'edge'` changes the execution environment for the journals pagination endpoint: different cold-start profile, no longer geographically distributed. Functionally identical, latency is not. Measure after deploy; if it regresses, the documented alternative is Proxy.

### R6 — build now fails hard on a Sanity outage 🟡

Today `generateStaticParams` swallows fetch errors and returns `[]`, so a Sanity blip at build time produces a **green build that deploys a site with zero prerendered pages**. Under Cache Components that same path raises `empty-generate-static-params` and fails the build.

This is arguably a fix, not a regression — but it changes CI behaviour and should be a conscious choice. See D2.

### R7 — draft mode and visual editing 🟢

Lower risk than expected. The docs confirm, and the build agrees, that `draftMode().isEnabled` is readable inside a `'use cache'` scope and does not force the route dynamic — so the current `layout.tsx` / `page.tsx` pattern survives untouched. When draft mode is on, everything under a cache scope re-executes per request and is not written to cache, which is the behaviour we want.

**Still needs a preview deploy to confirm**, since stega/visual editing was not exercised here.

---

## Plan

### Phase 0 — prerequisite

Land #44. Do not stack this on an unmerged branch.

### Phase 1 — unblock the build (one PR, no behaviour change intended)

1. Add `cacheComponents: true` and the two custom `cacheLife` profiles (R1) to `next.config.ts`.
2. Delete the three `export const revalidate` lines and the `runtime = 'edge'` line.
3. Resolve D2 (`generateStaticParams`) and D3 (Footer).
4. Build. Expect it to pass with degraded caching — that's Phase 2's job.

### Phase 2 — restore every cache

Add `'use cache'` at the data layer, not the page. Verified shape:

```ts
// apps/web/utils/get-page.ts
async function fetchPublishedPage(slug: string) {
  "use cache";
  cacheLife("cmsPage");
  cacheTag("sanity:page", `sanity:page:${slug}`);
  return client.fetch<CmsPages | null>(PAGE_BY_SLUG_QUERY, { slug });
}

const getPage = cache(async (slug: string, isDraft: boolean) => {
  if (isDraft) {
    return previewClient.fetch<CmsPages | null>(PAGE_BY_SLUG_QUERY, { slug });
  }
  return fetchPublishedPage(slug);
});
```

The draft branch deliberately stays outside the cache scope. Apply the same shape to `get-settings.ts` (`cmsPage`), `sitemap.ts` and `llms.txt/route.ts` (`cmsIndex`). Note `'use cache'` cannot go on the `GET` export itself — it needs a helper.

Gate: the route table must match the "after" table above, with `expire` reading `1y`.

### Phase 3 — regression sweep

Manual pass over R4. Preview deploy for R7. Measure R5.

### Phase 4 — optional follow-ups

`partialPrefetching: true` to complete the App Shell upgrade path. `cacheTag`-based on-demand invalidation from a Sanity webhook — the tags in Phase 2 are already there for it, which would let content go live in seconds instead of waiting out an hour.

---

## Decisions needed

**D1 — cache lifetimes.** Reproduce today's numbers exactly (recommended, above), or take the migration as a chance to retune? A portfolio could reasonably revalidate faster than hourly.

**D2 — `generateStaticParams` error handling.** Under Cache Components the current `return []` fallback is illegal. Either:

- **(a, recommended)** remove the try/catch and let a Sanity outage fail the build loudly — better than silently deploying an empty site, which is what happens today; or
- **(b)** return a hardcoded `[{ slug: [] }]` to keep builds green, accepting that an outage ships a near-empty site.

**D3 — Footer copyright year.** `new Date()` in a Client Component blocks the prerender and cannot be deferred. The documented options are `<Suspense>`, moving the read into `useEffect`, or a timing API — none of which I've tested here. For a copyright year, deferring to `useEffect` (with a server-rendered fallback year) is the least invasive, at the cost of the year being absent for one paint. Worth a moment's thought rather than a reflex fix.

---

## References

Version-exact docs from `next@16.3.0` (`node_modules/next/dist/docs/`):

- `01-app/02-guides/migrating-to-cache-components.md`
- `01-app/02-guides/incremental-static-regeneration-cache-components.md`
- `01-app/03-api-reference/05-config/01-next-config-js/cacheComponents.md`
- `01-app/03-api-reference/04-functions/cacheLife.md`
- `01-app/03-api-reference/01-directives/use-cache-remote.md`
