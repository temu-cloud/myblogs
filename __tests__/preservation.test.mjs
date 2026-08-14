/**
 * Preservation Property Tests
 * ============================
 * These tests document baseline behavior that MUST NOT change after the fixes.
 * They PASS on unfixed code and MUST STILL PASS on fixed code.
 *
 * Run with: node __tests__/preservation.test.mjs
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
    console.log(`          ${err.message}`);
    failed++;
    failures.push({ name, message: err.message });
  }
}

// ─── Read source files ────────────────────────────────────────────────────────
const postsRouteSrc   = readFileSync("app/api/posts/route.ts", "utf-8");
const postIdRouteSrc  = readFileSync("app/api/posts/[postId]/route.ts", "utf-8");
const blogViewSrc     = readFileSync("app/components/blog-page/BlogView.tsx", "utf-8");
const navbarSrc       = readFileSync("app/components/general/navbar/Navbar.tsx", "utf-8");
const globalsCss      = readFileSync("app/globals.css", "utf-8");
const writePage       = readFileSync("app/write/page.tsx", "utf-8");
const schema          = readFileSync("prisma/schema.prisma", "utf-8");

// ─── Preservation: Write API still handles session authentication ─────────────
console.log("\nPreservation — Write API baseline");

test(
  "POST /api/posts still checks session.user.id (auth guard preserved)",
  () => {
    const postSection = postsRouteSrc.split("export async function GET")[0];
    assert.ok(
      postSection.includes("session?.user.id") || postSection.includes("session.user.id"),
      "POST /api/posts lost its session authentication check."
    );
  }
);

test(
  "PATCH /api/posts/[postId] still checks session.user.id (auth guard preserved)",
  () => {
    const patchSection = postIdRouteSrc
      .split("export async function PATCH")[1]
      ?.split("export async function DELETE")[0] ?? "";
    assert.ok(
      patchSection.includes("session?.user.id") || patchSection.includes("session.user.id"),
      "PATCH /api/posts/[postId] lost its session authentication check."
    );
  }
);

test(
  "DELETE /api/posts/[postId] still checks session.user.id (auth guard preserved)",
  () => {
    const deleteSection = postIdRouteSrc.split("export async function DELETE")[1] ?? "";
    assert.ok(
      deleteSection.includes("session?.user.id") || deleteSection.includes("session.user.id"),
      "DELETE /api/posts/[postId] lost its session authentication check."
    );
  }
);

// ─── Preservation: Cloudinary integration still present ──────────────────────
console.log("\nPreservation — Cloudinary integration");

test(
  "POST /api/posts still calls uploadToCloudinary",
  () => {
    assert.ok(
      postsRouteSrc.includes("uploadToCloudinary"),
      "POST /api/posts no longer calls uploadToCloudinary — image upload broken."
    );
  }
);

test(
  "DELETE /api/posts/[postId] still calls deleteFromCloudinary",
  () => {
    assert.ok(
      postIdRouteSrc.includes("deleteFromCloudinary"),
      "DELETE /api/posts/[postId] no longer calls deleteFromCloudinary — image cleanup broken."
    );
  }
);

test(
  "POST /api/posts still generates a unique slug via slugify",
  () => {
    assert.ok(
      postsRouteSrc.includes("slugify"),
      "POST /api/posts no longer uses slugify — slug generation broken."
    );
  }
);

// ─── Preservation: GET /api/posts pagination still present ───────────────────
console.log("\nPreservation — GET /api/posts pagination");

test(
  "GET /api/posts still supports cursor-based pagination",
  () => {
    const getSection = postsRouteSrc.split("export async function GET")[1] ?? "";
    assert.ok(
      getSection.includes("cursor") && getSection.includes("nextCursor"),
      "GET /api/posts lost cursor-based pagination."
    );
  }
);

test(
  "GET /api/posts still returns posts array with nextCursor",
  () => {
    const getSection = postsRouteSrc.split("export async function GET")[1] ?? "";
    assert.ok(
      getSection.includes("posts: items") || getSection.includes('"posts"'),
      "GET /api/posts response shape changed — no longer returns { posts, nextCursor }."
    );
  }
);

// ─── Preservation: BlogView still renders article content ────────────────────
console.log("\nPreservation — BlogView article rendering");

test(
  "BlogView still renders post title",
  () => {
    assert.ok(
      blogViewSrc.includes("post?.title") || blogViewSrc.includes("post.title"),
      "BlogView no longer renders the post title."
    );
  }
);

test(
  "BlogView still renders cover image",
  () => {
    assert.ok(
      blogViewSrc.includes("coverImageUrl"),
      "BlogView no longer renders the cover image."
    );
  }
);

test(
  "BlogView still shows Edit/Delete controls for the post author",
  () => {
    assert.ok(
      blogViewSrc.includes("userId === post?.author.id") ||
      blogViewSrc.includes("userId === post.author.id"),
      "BlogView no longer checks userId to show Edit/Delete controls for the author."
    );
  }
);

test(
  "BlogView still renders the Edit link to /write/edit/[id]",
  () => {
    assert.ok(
      blogViewSrc.includes("/write/edit/"),
      "BlogView lost the Edit link to the write/edit page."
    );
  }
);

// ─── Preservation: Navbar still has standard nav links ───────────────────────
console.log("\nPreservation — Navbar");

test(
  "Navbar still renders Home, Articles, About links",
  () => {
    assert.ok(
      navbarSrc.includes("/articles") && navbarSrc.includes("/about"),
      "Navbar lost the standard nav links (Home, Articles, About)."
    );
  }
);

test(
  "Navbar still renders Login/Logout controls",
  () => {
    assert.ok(
      navbarSrc.includes("Login") && navbarSrc.includes("Logout"),
      "Navbar lost the Login/Logout controls."
    );
  }
);

// ─── Preservation: Theme — primary accent color unchanged ────────────────────
console.log("\nPreservation — Theme accent color");

test(
  "--color-primary (#1e3a8a) is unchanged",
  () => {
    assert.ok(
      globalsCss.includes("#1e3a8a"),
      "globals.css lost --color-primary (#1e3a8a indigo accent) — it must be preserved."
    );
  }
);

// ─── Preservation: Prisma schema has Post and User models ────────────────────
console.log("\nPreservation — Prisma schema");

test(
  "Prisma schema still has Post model with slug and coverImageUrl",
  () => {
    assert.ok(
      schema.includes("model Post") && schema.includes("slug") && schema.includes("coverImageUrl"),
      "Prisma schema lost the Post model or key fields (slug, coverImageUrl)."
    );
  }
);

test(
  "Prisma schema still has User model",
  () => {
    assert.ok(
      schema.includes("model User"),
      "Prisma schema lost the User model."
    );
  }
);

// ─── Summary ──────────────────────────────────────────────────────────────────
console.log("\n─────────────────────────────────────────────");
console.log(`Results: ${passed} passed, ${failed} failed`);

if (failed > 0) {
  console.log("\nFailed preservation checks (regressions detected):");
  failures.forEach((f, i) => {
    console.log(`  ${i + 1}. [${f.name}]\n     → ${f.message}`);
  });
  process.exit(1);
} else {
  console.log("\n✓ All preservation tests pass — baseline behavior documented.");
  console.log("  Re-run after implementing tasks 3.1–3.8 to confirm no regressions.");
}
