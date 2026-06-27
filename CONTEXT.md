# Domain glossary

The ubiquitous language for this project. Names here are the canonical terms to use
in code, schemas, queries, and reviews. This is a living document — add terms as the
model sharpens.

## Page rendering

- **Page** — a CMS document of one `PageTypeName` (homepage, project, about, contact,
  article, page). Served through the single catch-all route `app/[[...slug]]/page.tsx`.
- **Template** — a full-page wrapper, one per `PageTypeName`
  (`apps/web/components/templates/`). Receives the whole page document and iterates its
  components array.
- **Organism** — a CMS-driven section within a page, one per `ComponentTypeName`
  (`apps/web/components/organisms/`). Every organism wraps its output in
  `ComponentLayout` for consistent padding, the 12-column grid, and section-id anchors.

## Organism Registry

The **Organism Registry** is the single seam that maps each `ComponentTypeName` to the
three things the system needs for it. `ComponentTypeName` (`shared/types/base.ts`) is
the key; the registry is the value. It exists as three keyed structures — kept exhaustive
by the type system, not by hand — so that a missing organism is a **compile error**, not
a silently-dropped section:

- **Render map** — `organismComponents` in
  `apps/web/components/hoc/organism-registry.tsx`. A mapped type
  (`{ [T in ComponentTypeName]: … }`) from component type to its React render thunk.
  `RenderOrganism` is a lookup into this map; there is no `switch`.
- **Fragment map** — `organismFragments` in
  `apps/web/sanity/queries/components/index.ts`. A `Record<ComponentTypeName, string>`
  from component type to its GROQ fragment. `pageComponentFields` is generated from it,
  so the query and the enum cannot drift. Plain strings only — no React in the query
  layer.
- **Schema map** — `componentSchemas` in `apps/studio/schemas/components/index.ts`. A
  `Record<ComponentTypeName, ObjectDefinition>` from component type to its Studio schema.
  The `components` array is derived via `Object.values`.

The `PageComponent` union (`shared/types/pages/base.ts`) is guarded by a compile-time
`assertNever` check so it cannot fall behind the enum either.

**Adding an organism** still means authoring four artifacts (schema, type, GROQ fragment,
React component), but the wiring collapses to one entry in each map, and the compiler
names any entry you forget. Field-level drift between a fragment and the props its
component reads is **not** caught here — that is the province of query/type codegen
(Sanity TypeGen), tracked separately.
