# Cache Components migration — evaluation and plan

**Status:** evaluation complete, decisions made, blocked on #44 merging
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
| 5   | `app/[[...slug]]/page.tsx:77`               | `empty-generate-static-params` — must return ≥1 result                                             | Fail the build — see Decisions made              |
| 6   | `components/organisms/Footer/Footer.tsx:17` | `blocking-prerender-current-time-client` — `new Date()` in a Client Component                      | Cached server fn — see Decisions made            |

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

A webhook for an edited _project_ fires with that project's `_id` — never the slug of the homepage listing it. So add one coarse tag to **every** cached Sanity fetch and invalidate it on any publish:

```ts
cacheTag("sanity:content", "sanity:page", `sanity:page:${slug}`);
```

This has no correctness holes because it doesn't attempt to model the reference graph. The usual objection doesn't apply at this size — per the docs, `revalidateTag` _"marks tagged data as stale, but fresh data is only fetched when pages using that tag are next visited... will not immediately trigger many revalidations at once."_ Regeneration is lazy, so a publish costs at most one background re-fetch per page, whenever that page is next visited.

| Event                                  | Tags to invalidate                                          |
| -------------------------------------- | ----------------------------------------------------------- |
| **Any** document publish/update/delete | `sanity:content`                                            |
| Page-like doc with a slug              | also `sanity:page:${slug}`, `sanity:sitemap`, `sanity:llms` |
| `settings` document                    | also `sanity:settings`                                      |

**Implementation:** new route `app/api/revalidate/route.ts`, signature-verified with `@sanity/webhook`'s `parseBody` (new dependency) rather than hand-rolled. Add `SANITY_REVALIDATE_SECRET` to the `web#build` env array in `turbo.json` per the convention in `CLAUDE.md` — never `globalEnv` — plus the Vercel project env. Configure the webhook in Sanity's API settings to POST on create/update/delete with a projection including `_type` and `slug.current`.

**Cross-instance check.** `use cache` entries are in-memory and not inherently shared between instances; Vercel is expected to supply a shared cache handler, so this should just work — but the failure mode reads as flakiness rather than breakage, so confirm it. On preview: publish a change, then hit the same URL repeatedly. If the fresh value appears and disappears between requests, invalidation is only reaching one instance — switch the cached fetches to `'use cache: remote'`.

**If Sanity read volume ever becomes a concern**, the precise alternative is source-map–derived tags: `@sanity/client` can return a `resultSourceMap` listing every document that contributed to a result, tagged as `sanity:doc:${_id}` and invalidated by changed `_id`. The repo already uses stega, which rides the same machinery — but confirm it works on the CDN-backed published client first. Not worth the complexity at current scale.

### Phase 4 — regression sweep

Manual pass over R4. Preview deploy for R7. Measure R5.

### Phase 5 — optional

`partialPrefetching: true` to complete the App Shell upgrade path.

---

## Decisions made

| Decision                   | Choice                                                                             |
| -------------------------- | ---------------------------------------------------------------------------------- |
| **Sequencing**             | Wait for #44 to merge; migrate as a separate PR off `develop`                      |
| **Cache lifetimes**        | Keep today's 1h / 1w. Tags carry freshness; the timer is a backstop                |
| **Webhook invalidation**   | In scope (Phase 3), not a follow-up                                                |
| **`generateStaticParams`** | Fail the build loudly — remove the try/catch, no empty-array fallback              |
| **Footer year**            | Try a cached server function first; fall back to `useEffect`. **Not** `<Suspense>` |

**On the Footer:** `<Suspense>` was rejected because a dynamic hole in the root layout means no route can be fully static — every route drops from `○` to `◐`, requiring origin compute on every request instead of pure CDN delivery. A site-wide cost for a copyright year. The preferred fix is untested and needs verifying in Phase 1:

```ts
// apps/web/utils/get-copyright-year.ts
export async function getCopyrightYear() {
  "use cache";
  cacheLife("days");
  return new Date().getFullYear();
}
```

If Next still rejects `new Date()` inside a cache scope, fall back to `useEffect` with a server-rendered fallback year — routes stay fully static, at the cost of one paint.

---

## References

Version-exact docs from `next@16.3.0` (`node_modules/next/dist/docs/`):

- `01-app/02-guides/migrating-to-cache-components.md`
- `01-app/02-guides/incremental-static-regeneration-cache-components.md`
- `01-app/03-api-reference/05-config/01-next-config-js/cacheComponents.md`
- `01-app/03-api-reference/04-functions/cacheLife.md`
- `01-app/03-api-reference/01-directives/use-cache-remote.md`
