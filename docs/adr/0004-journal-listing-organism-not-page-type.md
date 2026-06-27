# Journal Listing is an organism on a generic Page, not a dedicated page type

The Journal Listing is implemented as a `journalListing` organism dropped onto a Sanity `page` document, rather than a dedicated `journalPage` document type. A dedicated type was considered for cleaner editor UX and a purpose-built query, but there is no SEO or technical advantage: the generic `page` type already carries full SEO fields, and the catch-all route resolves both the same way. Maintaining architectural consistency across all content pages outweighed the editor convenience of a dedicated type.
