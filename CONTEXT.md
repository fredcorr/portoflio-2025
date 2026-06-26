# Portfolio

A personal portfolio and writing platform. Content is authored in Sanity Studio and rendered as a Next.js site.

## Language

### Writing

**Entry**:
A single piece of writing published in the Journal. Has an edition number, category, read time, and hero image.
_Avoid_: Article, post, blog post

**Journal**:
The collection of all Entries, presented as a paginated, filterable archive.
_Avoid_: Blog, writing section, articles section

**Edition Number**:
A sequential integer assigned to an Entry at publish time, reflecting its order in the Journal from first to latest. Stored on the document — not derived from query position.
_Avoid_: Index, post number, article number

**Read Time**:
An integer (minutes) stored on the Entry document representing estimated reading duration. May be set manually by the author or left blank; when blank, no estimate is shown.
_Avoid_: Reading time, time to read

**Category**:
A single tag from the Entry's tag list used to filter the Journal archive. Categories are derived dynamically from all published Entry tags — there is no separate curated taxonomy.
_Avoid_: Topic, tag, filter, label

### Surfaces

**Journal Listing**:
The full archive page for the Journal. Shows all Entries paginated (6 per page), filterable by Category, with a live entry count.
_Avoid_: Journal page, articles page, blog index

**Journals Feed**:
A curated, hand-picked subset of Entries shown as a horizontal list on other pages (e.g. homepage). Not paginated or filterable.
_Avoid_: Journal list, article feed, recent posts
