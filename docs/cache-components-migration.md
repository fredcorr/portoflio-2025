# Cache Components migration — evaluation and plan

**Status:** Phases 1–3 implemented; CI green against live Sanity ([#47](https://github.com/fredcorr/portoflio-2025/pull/47)). Phase 4 (regression sweep) still needs a manual pass on the preview.
**Target:** `apps/web` on Next.js 16.3 ([#44](https://github.com/fredcorr/portoflio-2025/pull/44), merged)
**Date:** 2026-08-08

---

## Verdict

The migration is viable and small — **7 blockers, all now fixed.** Six were mechanical and visible from a first build; the seventh lived in a dependency and only surfaced in CI. A naive migration builds and serves a working site, which is exactly the danger: the caching silently disappears and nothing fails. The work is not in getting it to build, it's in deliberately restoring each cache that route-segment `revalidate` is giving us today.

Recommended sequencing: **land #44 first, migrate separately.** The two changes fail in different ways — #44's risk is a Vercel deploy-step failure, this one's risk is a silent caching regression — and bisecting them together is unpleasant.

---

## How this was verified

I ran real `next build`s against Next.js **16.3.0** (installed from PR #44's lockfile) with `cacheComponents: true`, iterating until the build passed, then diffed the route table against a baseline build of the current code.

**What that means for confidence:**

- **Verified by build output:** every blocker in the table below, the route-classification changes, and the revalidate/expire numbers.
- **Verified in CI against live Sanity:** the final build is green, 33/33 pages generated, with `Revalidate` / `Expire` matching the baseline on every route.
- **Still not verified:** draft mode, stega, and visual editing were never exercised — the dev sandbox's egress allowlist rejects `*.apicdn.sanity.io`, and CI only proves the build. These need a manual pass on the preview deploy.
- **Local builds here are weak evidence.** They run against a stubbed data layer, and the stub silently rendered no organisms for most of this work (wrong page-components key, and a query matcher that caught `PAGE_BY_SLUG_QUERY` as well as `ALL_PAGES_QUERY`). Blocker 7 was missed twice as a result. Trust the CI build over a local one.
- **Resolved during implementation:** the cached-server-function fix for the Footer year, which was an open question when this was written, prerenders cleanly.

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

Six of the seven were confirmed by a first build against stubbed data. The seventh needed live content and is described separately below.

| #   | File                                        | Error                                                                                              | Fix                                              |
| --- | ------------------------------------------- | -------------------------------------------------------------------------------------------------- | ------------------------------------------------ |
| 1   | `app/[[...slug]]/page.tsx:18`               | `Route segment config "revalidate" is not compatible with cacheComponents`                         | Remove; replace with `'use cache'` + `cacheLife` |
| 2   | `app/llms.txt/route.ts:8`                   | same                                                                                               | same                                             |
| 3   | `app/sitemap.ts:7`                          | same                                                                                               | same                                             |
| 4   | `app/api/journals/route.ts:1`               | `Route segment config "runtime" is not compatible` — Cache Components requires the Node.js runtime | Delete `export const runtime = 'edge'`           |
| 5   | `app/[[...slug]]/page.tsx:77`               | `empty-generate-static-params` — must return ≥1 result                                             | Fail the build — see Decisions made              |
| 6   | `components/organisms/Footer/Footer.tsx:17` | `blocking-prerender-current-time-client` — `new Date()` in a Client Component                      | Cached server fn — see Decisions made            |

Blocker 6 is the awkward one: it is **synchronous IO during prerender**, which `instant = false` explicitly does _not_ defer. It cannot be postponed to a later phase, and because `Footer` sits in the root layout it blocks _every_ route.

### Blocker 7 — found only in CI: `new Date()` inside a dependency

`components/organisms/Testimonials/Testimonials.tsx` renders Swiper, and Swiper's **Autoplay module reads `new Date()` as soon as it initialises**. `modules` always includes `Autoplay`, so setting `autoplay={false}` does not avoid it. Every page carrying a testimonials section failed to prerender.

This one is worth understanding because static analysis cannot find it — the offending call is in `node_modules`, and the build's stack trace reports it as "ignore-listed frames" with no component named. Two passes of grepping the app for `new Date()` found nothing. What produced the answer was `next build --debug-prerender`, which the build output itself recommends:

- The first attempt **ran out of heap** before reaching the error — `--debug-prerender` forces `NODE_ENV=development` plus server source maps, and 33 pages does not fit a 2-core build machine.
- Narrowing `generateStaticParams` to the single failing page got the trace out, naming `Testimonials.tsx:94`.

**Fix: mount the carousel after hydration**, not `<Suspense>`. Suspense is Next's first suggestion, but it would put a dynamic hole in every page with testimonials and cost an origin request per visit — the same trade rejected for the footer year. A shared `TestimonialQuote` component renders the first quote server-side, so content stays in the HTML for crawlers and no-JS visitors, and Swiper needs JavaScript regardless.

**Generalise this:** any client component reading current time, randomness, or UUIDs blocks the prerender — including ones you don't own. Swiper was the only case here, but a future dependency upgrade could introduce another, and it will surface as a CI-only failure.

---

## Before / after

Both tables below are real Vercel builds against live Sanity, on Next 16.3.0.

> An earlier revision compared a **local build against stubbed data** (which returned a single page) with the live CI build (33 pages), and concluded from it that the migration was "a no-op on caching behaviour". That comparison was invalid — the route lists differed because of the data source, not the migration — and the conclusion it supported was wrong. Replaced below with develop's own deployment at `de2216a`, this branch's exact base.

**Baseline** — `develop` @ `de2216a`, 30/30 pages:

```
├   /[[...slug]]
│ ├ ● /journals/what-frontend-architecture-actually-costs          1h      1y
│ ├ ● /journals/headless-isnt-the-decision                         1h      1y
│ ├ ● /journals/most-interview-processes-are-broken                1h      1y
│ └ ● [+18 more paths]
├ ○ /llms.txt                                                      1w      1y
└ ○ /sitemap.xml                                                   1w      1y
```

**As shipped** — this branch, 33/33 pages:

```
├   /[[...slug]]                                                   1h      1y
│ ├ ◐ /[[...slug]]                                                 1h      1y
│ ├ ○ /journals/what-frontend-architecture-actually-costs          1h      1y
│ ├ ○ /journals/headless-isnt-the-decision                         1h      1y
│ └ ◐ [+19 more paths]
├ ƒ /api/revalidate                                                          ← webhook receiver
├ ○ /llms.txt                                                      1w      1y
└ ○ /sitemap.xml                                                   1w      1y
```

`Revalidate` and `Expire` match the baseline on every route. The **classification symbols differ**, and what that means is genuinely unresolved. Read the rest of this section before drawing conclusions from it.

**First: `●` does not exist under Cache Components.** Compare the two legends the builds printed.

Baseline:

```
○  (Static)   prerendered as static content
●  (SSG)      prerendered as static HTML (uses generateStaticParams)
ƒ  (Dynamic)  server-rendered on demand
```

This branch:

```
○  (Static)             prerendered as static content
◐  (Partial Prerender)  prerendered as static HTML with dynamic server-streamed content
ƒ  (Dynamic)            server-rendered on demand
```

The `●` category is absent from the second legend entirely. So "19 routes were demoted from `●`" is the wrong framing — `●` has no successor under `cacheComponents`, and every previously-`●` route had to be reclassified as `○`, `◐` or `ƒ` regardless of whether its behaviour changed.

**Second: the "19 of 21" figure is an inference, not a measurement.** Next prints one symbol for a collapsed group, so `◐ [+19 more paths]` does not establish that all 19 are `◐`; the group may be mixed. Nobody has confirmed per-route classification.

**Third: the `draftMode()` explanation was tested and failed.** An earlier revision of this document asserted the cause was `draftMode()` — a dynamic API — in the shared render path (`page.tsx`, its `generateMetadata`, and `layout.tsx`). That was never verified, and the 2-vs-19 split contradicted it at the time, since a read in the root layout should affect all paths equally.

It was then tested directly: all four reads were moved inside `use cache` scopes via a shared cached helper (commit `c4c38a2`). The classification did not change at all, and the helper — lacking a `cacheLife` call — pulled every page's revalidate from `1h` to `15m`. Reverted in `6bceceb`. `draftMode()` is not established as the cause, and the docs' allowance that `isEnabled` may be read inside a cache scope says nothing about a route staying static.

**What would actually settle it:** per-route `x-vercel-cache` behaviour on the preview, compared against develop's last good deployment — two requests per path, checking whether a route ever reaches `HIT` or goes to the origin every time. Preview deployments sit behind Vercel Deployment Protection, so this needs a Protection Bypass for Automation token (`x-vercel-protection-bypass` header).

Until that measurement exists, treat the symbol change as unexplained and do not describe it as a regression or as harmless.

Using the stock presets instead would have produced `1h/1d` and `1w/30d` here. See R1.

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

#### `expire` propagates as a minimum — found during implementation

A route's effective `expire` is the **minimum across every cache scope that feeds it**, not just the one nearest the data. The first implementation gave `getCopyrightYear()` a stock `cacheLife('days')`, whose `expire` is one week. Because that helper runs in the root layout, it silently pulled every page's expiry from 1 year down to 1 week — reintroducing R1 through the back door, with the profiles themselves still correct.

The build's `Expire` column is what caught it. Any new `use cache` scope reachable from `layout.tsx` needs an `expire` at least as long as `cmsPage`'s, or it caps the whole site:

```ts
cacheLife({ stale: 300, revalidate: 86400, expire: 31536000 });
```

`revalidate` can still be short — that only controls background refresh. It's `expire` that has to stay long.

### R2 — silent loss of all Sanity caching 🔴

Because Sanity bypasses the fetch Data Cache (above), any data function that loses `revalidate` and doesn't gain `'use cache'` goes to **zero caching** — and the build stays green. In the experiment, `sitemap.xml` and `llms.txt` came back with a blank revalidate column until `'use cache'` was added explicitly.

**Guard:** the build's route table is the check. Every data-backed route must show a revalidate value. This belongs in the PR description as a pasted before/after, and ideally in CI.

### R3 — `use cache` is in-memory and does not persist across deploys 🟠

ISR entries today survive instance recycling. `use cache` entries do not — they are per-instance, in-memory, and keyed by build ID. On serverless this means noticeably more Sanity API calls, especially right after a deploy.

**Options:** accept it (a portfolio's Sanity volume is small), or use `'use cache: remote'` on the settings/page fetches. Remote also doesn't survive deploys, but it _is_ shared across instances.

This matters more now that webhooks are in scope: if the cache isn't shared, a `revalidateTag` call reaching one instance can't invalidate the others. Vercel is expected to supply a shared handler, so this should be a non-issue — but Phase 3 verifies it explicitly, since the failure mode looks like flakiness rather than breakage.

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

This is arguably a fix, not a regression — but it changes CI behaviour. **Decided: accept it and fail loudly.**

### R7 — draft mode and visual editing 🟠

Draft reads stay **outside** the cache scope, in `layout.tsx` and `page.tsx`, as they are today.

An earlier revision rated this 🟢 on the reasoning that `draftMode().isEnabled` is readable inside a `'use cache'` scope and "does not force the route dynamic". The first half is true and documented; the second half does not follow from it and was never tested. When it was tested, moving the reads inside changed nothing about route classification and regressed revalidate — see Before / after. Do not re-attempt that refactor without the measurement described there.

What the docs do establish, and which still holds: when draft mode is on, everything under a cache scope re-executes per request and is not written to cache.

**Still needs a preview deploy to confirm**, since stega/visual editing was not exercised here.

---

## Plan

### Phase 0 — prerequisite

Land #44. Do not stack this on an unmerged branch.

### Phase 1 — unblock the build (one PR, no behaviour change intended)

1. Add `cacheComponents: true` and the two custom `cacheLife` profiles (R1) to `next.config.ts`.
2. Delete the three `export const revalidate` lines and the `runtime = 'edge'` line.
3. Remove the `catch → return []` in `generateStaticParams`; let a Sanity outage fail the build.
4. Fix the Footer year (see Decisions made).
5. Build. Expect it to pass with degraded caching — that's Phase 2's job.

### Phase 2 — restore every cache

Add `'use cache'` at the data layer, not the page. Verified shape:

```ts
// apps/web/utils/get-page.ts
async function fetchPublishedPage(slug: string) {
  "use cache";
  cacheLife("cmsPage");
  cacheTag("sanity:content", "sanity:page", `sanity:page:${slug}`);
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

### Phase 3 — webhook invalidation

Tags and timers are complementary. `cacheLife`'s `revalidate` **is** ISR under Cache Components — identical stale-while-revalidate behaviour to the old segment export. `revalidateTag` is a second, independent trigger that marks an entry stale early. Both converge on the same SWR path, so the hourly timer stays as a backstop for webhook delivery failures.

**Always pass the second argument:**

```ts
revalidateTag(`sanity:page:${slug}`, "max");
```

The single-argument form `revalidateTag(tag)` is deprecated and **blocking** — it expires the entry immediately, making the next request a cache miss the visitor waits on. Most tutorials still show it. `'max'` gives stale-while-revalidate. `updateTag()` blocks deliberately and is Server-Action-only, so it throws in a route handler and isn't an option here.

Expect: the first visitor after a publish sees stale content and triggers the refresh; the next sees fresh.

#### Tag by content, not by page identity

Per-slug tags alone are **wrong** for this schema. The page queries dereference heavily, and the referenced documents change independently of the page displaying them:

| Query                                          | Dereference                       | What a per-slug tag misses                                |
| ---------------------------------------------- | --------------------------------- | --------------------------------------------------------- |
| `queries/components/journals-feed.ts`          | `articles[]->`                    | Publishing an article leaves every page with a feed stale |
| `queries/components/project-listing.ts`        | `projects[]->`, `projectTags[]->` | Editing a project leaves every listing page stale         |
| `queries/components/work-index.ts`             | `projectTags[]->`                 | Renaming a tag doesn't refresh pages showing it           |
| `queries/settings.ts`, `queries/navigation.ts` | `navigationItems[]->`             | Nav items are separate documents                          |
| `queries/fragments.ts`                         | `asset->`                         | Image swaps                                               |

A webhook for an edited _project_ fires with that project's `_id` — never the slug of the homepage listing it.

An earlier revision of this plan answered that with a single coarse `sanity:content` tag on every cached fetch, invalidated on any publish. That was rejected in review, correctly. It was not merely broad: because the coarse tag fired on _every_ publish and sat on _every_ entry, the finer tags beside it (`sanity:page:${slug}`, `sanity:settings`, `sanity:sitemap`, `sanity:llms`) could never change an outcome. Fixing a typo in one article invalidated all 33 pages, the sitemap, llms.txt, settings and navigation.

**The shipped strategy pairs two tag kinds**, because neither is sufficient alone:

| Tag                  | Applied by                                 | Covers                                       |
| -------------------- | ------------------------------------------ | -------------------------------------------- |
| `sanity:id:<id>`     | walking the query result for every `_id`   | **edits** to a document already in the entry |
| `sanity:type:<type>` | the same walk, for _nested_ documents only | **creates and deletes**                      |

The type tag is not redundant. A newly published article has an id that was never in any cache entry, so no id tag can match it — only a listing that recorded "this entry depends on articles collectively" gets invalidated. Conversely the id tag is what keeps an edit from touching unrelated pages.

Two rules make the pairing correct:

- **The root document's own `_type` is excluded.** An article page's result is rooted on that article; tagging `sanity:type:article` there would invalidate every article page whenever any single article changed — reintroducing the problem. The root is addressed precisely by its id tag.
- **Only real document types get type tags.** Nested `_type` values are mostly not documents — portable text blocks, spans, images and the objects inside `pageComponents` all carry one — and tagging those produces tags no webhook can fire.

Three tags stay explicit because they cannot be derived from a result:

| Tag               | Why it cannot be derived                                                                                                                      |
| ----------------- | --------------------------------------------------------------------------------------------------------------------------------------------- |
| `sanity:settings` | `NAVIGATION_QUERY` projects `navigationItems[]->` _without_ the settings document, so a settings publish carries an id the entry never cached |
| `sanity:sitemap`  | listing changes on create/delete, which no id already in the result can signal                                                                |
| `sanity:llms`     | same                                                                                                                                          |

Regeneration stays lazy — per the docs, `revalidateTag` _"marks tagged data as stale, but fresh data is only fetched when pages using that tag are next visited... will not immediately trigger many revalidations at once."_

| Event                              | Tags invalidated                                            |
| ---------------------------------- | ----------------------------------------------------------- |
| Any document publish/update/delete | `sanity:id:${_id}`, `sanity:type:${_type}`                  |
| Page-like doc with a slug          | also `sanity:page:${slug}`, `sanity:sitemap`, `sanity:llms` |
| `settings` document                | also `sanity:settings`                                      |
| Payload with neither id nor type   | `sanity:content` (fallback — over-invalidates deliberately) |

**Implementation:** `utils/collect-cache-tags.ts` does the walk; `app/api/revalidate/route.ts` receives the webhook, signature-verified with `@sanity/webhook`. Two constraints the implementation handles:

- **`cacheTag` accepts at most 128 tags per call** and silently drops the rest, so tags are chunked across calls. A listing page with more than 128 referenced documents would otherwise lose invalidation with only a console warning.
- **Sanity addresses drafts as `drafts.<id>`.** Cache entries are built from published reads, so webhook ids are normalised or a publish would never match what was cached.

Tagging from the fetched payload is the documented pattern — Next's `cacheTag` reference has a "Creating tags from external data" section showing `cacheTag('bookings-data', data.id)` after the await.

The webhook projection must now include `_id`:

```
{"_id": _id, "_type": _type, "slug": slug.current}
```

Without it every publish falls back to type-level tags — still correct, but coarser than necessary.

Note this supersedes the source-map alternative previously parked here: `@sanity/client`'s `resultSourceMap` is unnecessary, because the queries already project `_id` on every dereference.

**Cross-instance check.** `use cache` entries are in-memory and not inherently shared between instances; Vercel is expected to supply a shared cache handler, so this should just work — but the failure mode reads as flakiness rather than breakage, so confirm it. On preview: publish a change, then hit the same URL repeatedly. If the fresh value appears and disappears between requests, invalidation is only reaching one instance — switch the cached fetches to `'use cache: remote'`.

### Phase 4 — regression sweep

Manual pass over R4. Preview deploy for R7. Measure R5.

### Phase 5 — optional

`partialPrefetching: true` to complete the App Shell upgrade path.

---

## Decisions made

| Decision                   | Choice                                                                |
| -------------------------- | --------------------------------------------------------------------- |
| **Sequencing**             | Wait for #44 to merge; migrate as a separate PR off `develop`         |
| **Cache lifetimes**        | Keep today's 1h / 1w. Tags carry freshness; the timer is a backstop   |
| **Webhook invalidation**   | In scope (Phase 3), not a follow-up                                   |
| **`generateStaticParams`** | Fail the build loudly — remove the try/catch, no empty-array fallback |
| **Footer year**            | Cached server function — verified working. **Not** `<Suspense>`       |

**On the Footer:** `<Suspense>` was rejected because a dynamic hole in the root layout means no route can be fully static — every route drops from `○` to `◐`, requiring origin compute on every request instead of pure CDN delivery. A site-wide cost for a copyright year. The cached-server-function alternative was untested when this was written; it is now **confirmed working** — `new Date()` inside a `use cache` scope prerenders cleanly and routes stay static:

```ts
// apps/web/utils/get-copyright-year.ts
export default async function getCopyrightYear() {
  "use cache";
  // NOT cacheLife('days') — its 1-week expire would cap the whole site.
  cacheLife({ stale: 300, revalidate: 86400, expire: 31536000 });
  return new Date().getFullYear();
}
```

Implemented in `apps/web/utils/get-copyright-year.ts`. The `useEffect` fallback proved unnecessary.

---

## References

Version-exact docs from `next@16.3.0` (`node_modules/next/dist/docs/`):

- `01-app/02-guides/migrating-to-cache-components.md`
- `01-app/02-guides/incremental-static-regeneration-cache-components.md`
- `01-app/03-api-reference/05-config/01-next-config-js/cacheComponents.md`
- `01-app/03-api-reference/04-functions/cacheLife.md`
- `01-app/03-api-reference/01-directives/use-cache-remote.md`
