import test from "node:test";
import assert from "node:assert/strict";
import makeID from "./makeID";

test("makeHeadingId - transforms strings into safe ids", () => {
  assert.equal(makeID("Hello world"), "Hello-world");
  // note: the implementation replaces any non-allowed sequence with a single dash,
  // so trailing punctuation produces a trailing dash
  assert.equal(makeID("my @title!!"), "my-title-");
  assert.equal(makeID("already-safe-id"), "already-safe-id");
  assert.equal(makeID(""), undefined);
  assert.equal(makeID(undefined), undefined);
});
