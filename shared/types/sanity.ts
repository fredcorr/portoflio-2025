// Sanity schema types

import type { SanityDocument } from "@sanity/client";

// Base document type
export interface BaseDocument extends SanityDocument {
  _id: string;
  _type: string;
  _createdAt: string;
  _updatedAt: string;
  _rev: string;
}

// Image type
export interface SanityImage {
  _type: "image";
  asset: {
    _ref: string;
    _type: "reference";
  };
  alt?: string;
  caption?: string;
}

// Slug type
export interface SanitySlug {
  _type: "slug";
  current: string;
}

// Add more schema types as needed
