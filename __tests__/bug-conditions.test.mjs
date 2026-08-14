/**
 * Bug Condition Exploration Tests
 * ================================
 * These tests run against UNFIXED code and are EXPECTED TO FAIL.
 * Failure confirms each bug exists. After fixes are applied (tasks 3.x),
 * re-running these tests should produce all PASS results.
 *
 * Run with: node __tests__/bug-conditions.test.mjs
 */

import { readFileSync } from "fs";
import assert from "assert";

let passed = 0;
let failed = 0;
const failures = [];

function test(name, fn) {
  try {
    fn();
    console.log(`  ✓ PASS  ${name}`);
    passed++;
  } catch (err) {
    console.log(`  ✗ FAIL  ${name}`);
    console.log(`          Counterexample: ${err.message}`);
    failed++;
    failures.push({ name, message: err.message });
  }
}

// ─── Read source files once ───────────────────────────────────────────────────
const navbarSrc     = readFileSync("app/components/general/navbar/Navbar.tsx", "utf-8");
const blogViewSrc   = readFileSync("app/components/blog-page/BlogView.tsx", "utf-8");
const postsRouteSrc = readFileSync("app/api/posts/route.ts", "utf-8");
const postIdRouteSrc = readFileSync("app/api/posts/[postId]/route.ts", "utf-8");
const globalsCss    = readFileSync("app/globals.css", "utf-8");

// ─── Bug 1: Role Enforcement ──────────────────────────────────────────────────
console.log("\nBug 1 — Role Enforcement");

test(
  'Navbar "Write" link is gated on admin role (session?.user.role === "admin")',
  () => {
    // The fixed code must check role. Unfixed code checks `session` only.
    assert.ok(
      navbarSrc.includes('session?.user.role === "admin"') ||
      navbarSrc.includes("session?.user.role === 'admin'") ||
      navbarSrc.includes('.role === "admin"'),
      'Navbar shows "Write" link for ANY authenticated user (session check only), not just admins. ' +
      'The condition must check role === "admin".'
    );
  }
);

test(
  "POST /api/posts has admin role guard",
  () => {
    // Find the POST handler section (before GET)
    const postHandlerSection = postsRouteSrc.split("export async function GET")[0];
    assert.ok(
      postHandlerSection.includes('role !== "admin"') ||
      postHandlerSection.includes("role !== 'admin'"),
      "POST /api/posts has no admin role guard — any authenticated user can create posts. " +
      'Must include: if (session.user.role !== "admin") return 403.'
    );
  }
);

test(
  "PATCH /api/posts/[postId] has admin role guard",
  () => {
    const patchSection = postIdRouteSrc
      .split("export async function PATCH")[1]
      ?.split("export async function DELETE")[0] ?? "";
    assert.ok(
      patchSection.includes('role !== "admin"') ||
      patchSection.includes("role !== 'admin'"),
      "PATCH /api/posts/[postId] has no admin role guard — any authenticated user can update posts. " +
      'Must include: if (session.user.role !== "admin") return 403.'
    );
  }
);

test(
  "DELETE /api/posts/[postId] has admin role guard",
  () => {
    const deleteSection = postIdRouteSrc
      .split("export async function DELETE")[1] ?? "";
    assert.ok(
      deleteSection.includes('role !== "admin"') ||
      deleteSection.includes("role !== 'admin'"),
      "DELETE /api/posts/[postId] has no admin role guard — any authenticated user can delete posts. " +
      'Must include: if (session.user.role !== "admin") return 403.'
    );
  }
);

// ─── Bug 2: Missing Comments & Likes ─────────────────────────────────────────
console.log("\nBug 2 — Missing Comments & Likes");

test(
  "BlogView contains a comment input (textarea)",
  () => {
    assert.ok(
      blogViewSrc.toLowerCase().includes("textarea") ||
      blogViewSrc.includes("CommentsLikes"),
      "BlogView renders no comment textarea and no CommentsLikes component — " +
      "logged-in users have no way to comment on articles."
    );
  }
);

test(
  "BlogView contains a like button",
  () => {
    assert.ok(
      blogViewSrc.toLowerCase().includes("like") ||
      blogViewSrc.includes("CommentsLikes"),
      "BlogView renders no like button and no CommentsLikes component — " +
      "logged-in users have no way to like articles."
    );
  }
);

// ─── Bug 3: Teal/Yellow Theme ─────────────────────────────────────────────────
console.log("\nBug 3 — Teal/Yellow Theme");

test(
  "--color-background is not the old teal #013E37",
  () => {
    assert.ok(
      !globalsCss.includes("#013E37") && !globalsCss.includes("#013e37"),
      "globals.css still has --color-background: #013E37 (dark teal). " +
      "Must be replaced with #0f172a (deep navy) for professional portfolio."
    );
  }
);

test(
  "--color-secondary-background is not the old yellow #FFEFB3",
  () => {
    assert.ok(
      !globalsCss.includes("#FFEFB3") && !globalsCss.includes("#ffefb3"),
      "globals.css still has --color-secondary-background: #FFEFB3 (yellow). " +
      "Must be replaced with #1e293b (slate) for professional portfolio."
    );
  }
);

// ─── Summary ──────────────────────────────────────────────────────────────────
console.log("\n─────────────────────────────────────────────");
console.log(`Results: ${passed} passed, ${failed} failed`);

if (failed > 0) {
  console.log("\nCounterexamples (confirm bugs exist on unfixed code):");
  failures.forEach((f, i) => {
    console.log(`  ${i + 1}. [${f.name}]\n     → ${f.message}`);
  });
  console.log("\n✓ Expected outcome: tests FAIL on unfixed code — bugs confirmed.");
  console.log("  After implementing tasks 3.1–3.8, re-run to verify all tests PASS.");
} else {
  console.log("\n✓ All tests passed — bugs are fixed.");
}
