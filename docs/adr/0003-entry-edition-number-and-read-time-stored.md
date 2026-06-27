# Read time is a stored field; edition number is derived via GROQ

`readTime` (integer, minutes) is stored on the article document in Sanity. Deriving it at query time requires fetching full `articleContent` portable text for every entry in every listing query — too heavy at scale.

`editionNumber` was initially planned as a stored field for the same reasons, but the codebase already derives it reliably via `count(*[_type == "article" && _createdAt <= ^._createdAt])`. This GROQ expression is position-independent: it counts all articles with a creation date earlier than or equal to the current one, so it returns the correct number regardless of filtering, pagination, or query order. It is used in the article page query and the journal listing query consistently. A stored field would duplicate this and introduce a manual maintenance burden.
