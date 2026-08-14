# Portfolio Roles and Theming Bugfix Design

## Overview

Three behavioral gaps exist in the current Next.js portfolio app. This document formalizes the bug conditions and fix approach for each:

1. **Role Enforcement** — No role system exists; any authenticated user can access write/edit/delete routes. The fix adds an `admin` role (first registered user) via better-auth's `admin` plugin, and gates `/write` routes and write API calls behind that role.

2. **Comments & Likes** — No comment or like models or UI exist. The fix adds `Comment` and `Like` Prisma models, two new API routes, and a `CommentsLikes` client component rendered below article content in `BlogView`.

3. **Theme** — `globals.css` uses `#013E37` (teal) and `#FFEFB3` (yellow) which are unsuitable for a professional portfolio. The fix replaces them with `#0f172a` (deep navy) and `#1e293b` (slate).

The strategy is minimal, targeted changes: no page rebuilds, no library additions beyond what better-auth already supports.

---

## Glossary

- **Bug_Condition (C)**: The condition that identifies a defective input or system state
- **Property (P)**: The correct behavior that must hold when C is true
- **Preservation**: All behaviors listed under "Unchanged Behavior" in bugfix.md that must not regress
- **admin role**: A `better-auth` role value of `"admin"` stored on the `user` record and available in the session
- **user role**: A `better-auth` role value of `"user"` assigned to all registrations after the first
- **isBugCondition**: Pseudocode predicate returning `true` when the defective state is present
- **`auth.ts`**: `app/lib/auth.ts` — better-auth server configuration
- **`/write` routes**: `app/write/page.tsx` and `app/write/edit/[postId]/page.tsx` — client pages for article creation and editing
- **`BlogView`**: `app/components/blog-page/BlogView.tsx` — client component that renders a single article
- **`globals.css`**: `app/globals.css` — Tailwind `@theme` block defining CSS color tokens

---

## Bug Details

### Bug 1 — Role Enforcement

The bug manifests on every request to a write route by any authenticated non-admin user. The `auth.ts` configuration has no `admin` plugin and no `user` table `role` column, so neither the pages nor the API routes can distinguish admin from regular user.

**Formal Specification:**
```
FUNCTION isBugCondition_RoleAccess(user)
  INPUT: user of type AuthenticatedUser | null
  OUTPUT: boolean

  RETURN (user IS NULL OR user.role != "admin")
         AND (requestPath STARTS_WITH "/write"
              OR requestMethod IN ["POST", "PATCH", "DELETE"]
                 AND requestPath STARTS_WITH "/api/posts")
END FUNCTION
```

**Examples:**
- A second Google-OAuth user visits `/write` → currently sees the write form; should be redirected to `/articles`
- A non-admin user calls `POST /api/posts` → currently creates a post; should receive 403
- A non-admin user calls `DELETE /api/posts/:id` → currently deletes the post; should receive 403
- The first registered user visits `/write` → should see the form (admin, no bug condition)

---

### Bug 2 — Missing Comments & Likes

The bug manifests on every article page render. Neither a `Comment` model nor a `Like` model exist in the Prisma schema, and `BlogView` renders no comment or like UI.

**Formal Specification:**
```
FUNCTION isBugCondition_NoInteraction(renderContext)
  INPUT: renderContext = { page: "article", userId: string | null }
  OUTPUT: boolean

  RETURN commentSectionExists() = false
         OR likeSectionExists() = false
END FUNCTION
```

**Examples:**
- Authenticated user views an article → no comment input rendered; should see a textarea + submit
- Authenticated user views an article → no like button rendered; should see a like toggle + count
- Guest views an article → no comment/like section at all; should see existing comments + like count + login prompt
- Authenticated user submits a comment → currently no endpoint; should persist and re-render

---

### Bug 3 — Teal/Yellow Theme

The bug manifests on every page render. `globals.css` sets `--color-background: #013E37` and `--color-secondary-background: #FFEFB3`, and the root `<body>` applies `bg-background` directly.

**Formal Specification:**
```
FUNCTION isBugCondition_Theme(cssToken)
  INPUT: cssToken of type string (CSS variable value)
  OUTPUT: boolean

  RETURN cssToken = "#013E37" OR cssToken = "#FFEFB3"
END FUNCTION
```

**Examples:**
- `--color-background` resolves to `#013E37` → should be `#0f172a`
- `--color-secondary-background` resolves to `#FFEFB3` → should be `#1e293b`
- Any component using `bg-secondary-background` (e.g., excerpt textarea in `/write`) gets yellow → should be dark slate

---

## Expected Behavior

### Preservation Requirements

**Unchanged Behaviors:**
- Admin article creation via `/write` continues to upload cover image to Cloudinary, generate a unique slug, and persist the post
- Admin article editing via `/write/edit/[postId]` continues to update the post and redirect to the updated slug
- Admin article deletion continues to remove the Cloudinary image and delete the DB record
- Search via `/api/posts/search` continues to return matching posts
- Paginated article listing at `/articles` with infinite scroll continues to work
- Google and GitHub OAuth sign-in via better-auth continues unchanged
- The Edit and Delete controls shown to the article author in `BlogView` continue to appear for admin

**Scope:**
All inputs that do NOT involve (a) a non-admin user accessing write routes, (b) absence of comment/like UI, or (c) the teal/yellow color tokens must be completely unaffected by these fixes.

---

## Hypothesized Root Cause

### Bug 1 — Role Enforcement

1. **No role column on `user` model**: The Prisma `User` model has no `role` field; better-auth's `admin` plugin requires it, so roles cannot be stored or retrieved.
2. **better-auth not configured with admin plugin**: `auth.ts` does not import or configure the `admin` plugin, so session tokens carry no role claim.
3. **No route-level guard**: `/write/page.tsx` and `/write/edit/[postId]/page.tsx` perform no role check; they render for any authenticated user.
4. **No API-level role guard**: `POST /api/posts`, `PATCH /api/posts/:id`, and `DELETE /api/posts/:id` only verify `session.user.id` exists — no role assertion.
5. **Navbar "Write" link visible to all authenticated users**: `Navbar.tsx` shows the write link whenever `session` is truthy, regardless of role.

### Bug 2 — Missing Comments & Likes

1. **No Prisma models**: `Comment` and `Like` models do not exist in the schema; no DB tables back the feature.
2. **No API routes**: No endpoints exist for creating/fetching comments or toggling likes.
3. **No UI components**: `BlogView` renders no comment section or like button.

### Bug 3 — Theme

1. **Wrong color tokens in `@theme`**: `--color-background` and `--color-secondary-background` hold the old teal/yellow values, applied globally via `bg-background` on `<body>` and `bg-secondary-background` on several inputs.

---

## Correctness Properties

Property 1: Bug Condition — Role Access Control

_For any_ request where `isBugCondition_RoleAccess` returns true (a non-admin authenticated user attempts to reach a write route or a write API), the fixed system SHALL deny access: page routes redirect to `/articles`, API routes return HTTP 403.

**Validates: Requirements 2.2, 2.3**

Property 2: Bug Condition — Comment and Like Rendering

_For any_ article page render where `isBugCondition_NoInteraction` returns true (comment section or like button absent), the fixed `BlogView` SHALL render a comment list, a like count, and — when the viewer is authenticated — a comment input and like toggle button; when the viewer is a guest it SHALL render a login prompt instead of the interaction controls.

**Validates: Requirements 2.4, 2.5, 2.6, 2.7**

Property 3: Bug Condition — Professional Theme

_For any_ CSS token where `isBugCondition_Theme` returns true (`#013E37` or `#FFEFB3`), the fixed theme SHALL replace that token with `#0f172a` for the background and `#1e293b` for the secondary background, so every rendered page uses the professional dark-navy palette.

**Validates: Requirements 2.8**

Property 4: Preservation — Write Workflow Unchanged for Admin

_For any_ request where `isBugCondition_RoleAccess` returns false (the requesting user IS an admin), the fixed system SHALL produce the same behavior as the original system: full access to `/write`, `/write/edit/[postId]`, and the write API endpoints.

**Validates: Requirements 3.1, 3.2, 3.3**

Property 5: Preservation — Unrelated Features Unchanged

_For any_ request that does not involve write-route access, article interaction UI, or color token rendering (search, article listing, OAuth sign-in, article read), the fixed system SHALL produce the same result as the original system.

**Validates: Requirements 3.4, 3.5, 3.6, 3.7**

---

## Fix Implementation

### Fix 1 — Role Enforcement

**File**: `prisma/schema.prisma`

**Changes**:
1. Add `role String @default("user")` field to the `User` model so better-auth's admin plugin can read and write it.

**File**: `app/lib/auth.ts`

**Changes**:
1. Import and register the `admin` plugin from `better-auth/plugins`.
2. Add a `databaseHooks.user.create.before` hook that queries `prisma.user.count()` and sets `role: "admin"` when count is 0, otherwise `role: "user"`.

**File**: `app/lib/auth-client.ts`

**Changes**:
1. Import and register the `adminClient` plugin from `better-auth/client/plugins` so the session type includes `role`.

**File**: `app/write/page.tsx` and `app/write/edit/[postId]/page.tsx`

**Changes**:
1. Both pages are `"use client"` components. Add a `useSession` check: if the session user's role is not `"admin"`, call `router.replace("/articles")` in a `useEffect`.

**File**: `app/api/posts/route.ts` (POST handler) and `app/api/posts/[postId]/route.ts` (PATCH, DELETE handlers)

**Changes**:
1. After the existing `session.user.id` check, add `if (session.user.role !== "admin") return 403`.

**File**: `app/components/general/navbar/Navbar.tsx`

**Changes**:
1. Change the "Write" link visibility condition from `session` truthy to `session?.user.role === "admin"`.

---

### Fix 2 — Comments & Likes

**File**: `prisma/schema.prisma`

**Changes**:
1. Add `Comment` model: `id`, `content`, `createdAt`, `authorId` (→ User), `postId` (→ Post).
2. Add `Like` model: `id`, `userId` (→ User), `postId` (→ Post), with `@@unique([userId, postId])`.
3. Add `comments Comment[]` and `likes Like[]` back-relations to both `User` and `Post`.

**File**: `app/api/posts/[postId]/comments/route.ts` *(new)*

**Changes**:
1. `GET` — fetch all comments for the post, ordered by `createdAt desc`, including author name and image.
2. `POST` — require session; create a comment record.

**File**: `app/api/posts/[postId]/likes/route.ts` *(new)*

**Changes**:
1. `GET` — return total like count and whether the current session user has liked this post.
2. `POST` — require session; toggle like (upsert / delete).

**File**: `app/components/blog-page/CommentsLikes.tsx` *(new)*

**Changes**:
1. Client component that takes `postId` and renders: like button with count + comment list + conditional input (auth) or login prompt (guest). Fetches via the two new API routes using `useQuery` / `useMutation` from the existing `@tanstack/react-query` setup.

**File**: `app/components/blog-page/BlogView.tsx`

**Changes**:
1. Import and render `<CommentsLikes postId={post.id} />` below the article content divider.

---

### Fix 3 — Theme

**File**: `app/globals.css`

**Changes**:
1. Replace `--color-background: #013E37` with `--color-background: #0f172a`.
2. Replace `--color-secondary-background: #FFEFB3` with `--color-secondary-background: #1e293b`.

No other files need changes for the theme — all components reference these tokens via Tailwind utility classes (`bg-background`, `bg-secondary-background`), so the change propagates automatically.

---

## Testing Strategy

### Validation Approach

Testing follows a two-phase approach: first run exploratory tests against the **unfixed** code to surface counterexamples and confirm root cause analysis; then run fix-checking and preservation-checking tests against the **fixed** code.

---

### Exploratory Bug Condition Checking

**Goal**: Surface counterexamples on unfixed code to confirm root causes before implementing fixes.

**Test Cases:**

1. **Non-admin write access** — Create a second user (non-first), attempt to GET `/write` and POST `/api/posts`. Expect: currently succeeds (confirms bug). After fix: expect redirect / 403.
2. **Article page — no comment section** — Render `BlogView` with a mock post. Assert: no `<textarea>` or like button in the output (confirms bug).
3. **Theme token value** — Read the CSS variable `--color-background` from `globals.css`. Assert: equals `#013E37` (confirms bug).
4. **Navbar write link** — Render `Navbar` with a non-admin session. Assert: "Write" link is present (confirms bug).

**Expected Counterexamples:**
- Second authenticated user can reach the write form and call the API successfully
- `BlogView` output contains no interactive comment or like elements
- Background color resolves to teal rather than navy

---

### Fix Checking

**Goal**: Verify that for all inputs where the bug condition holds, the fixed system produces the expected behavior.

**Pseudocode:**
```
-- Role access
FOR ALL user WHERE isBugCondition_RoleAccess(user) DO
  result := accessWriteRoute'(user)
  ASSERT result = REDIRECT("/articles") OR result.status = 403
END FOR

-- Comment/like rendering
FOR ALL renderContext WHERE isBugCondition_NoInteraction(renderContext) DO
  result := renderBlogView'(renderContext)
  ASSERT result CONTAINS commentSection AND likeSection
END FOR

-- Theme tokens
FOR ALL cssToken WHERE isBugCondition_Theme(cssToken) DO
  result := resolveToken'(cssToken)
  ASSERT result IN ["#0f172a", "#1e293b"]
END FOR
```

---

### Preservation Checking

**Goal**: Verify that for all inputs where the bug condition does NOT hold, the fixed system produces the same result as the original.

**Pseudocode:**
```
FOR ALL user WHERE NOT isBugCondition_RoleAccess(user) DO
  ASSERT accessWriteRoute(user) = accessWriteRoute'(user)
END FOR

FOR ALL request WHERE NOT involves write-route OR interaction UI OR color token DO
  ASSERT originalSystem(request) = fixedSystem(request)
END FOR
```

**Testing Approach**: Property-based testing is used for preservation checks because:
- It generates many input combinations automatically (various user states, post states, request types)
- It catches regressions that targeted unit tests might miss
- It provides strong guarantees across the full input domain

**Test Cases:**
1. **Admin write access preserved** — Admin user can still GET `/write`, POST `/api/posts`, PATCH and DELETE `/api/posts/:id`
2. **Search preserved** — `GET /api/posts/search` returns the same results before and after
3. **Article listing preserved** — `GET /api/posts` with cursor pagination returns identical shapes
4. **OAuth flow preserved** — better-auth sign-in with Google/GitHub still sets a valid session
5. **Article page — Edit/Delete controls** — Admin author still sees Edit and Delete on their own articles

---

### Unit Tests

- Test `isBugCondition_RoleAccess` predicate with admin vs non-admin users against each route
- Test `POST /api/posts/[postId]/comments` with authenticated and unauthenticated requests
- Test `POST /api/posts/[postId]/likes` toggle: first call adds like, second call removes it
- Test `@@unique([userId, postId])` constraint on `Like` prevents duplicate likes
- Test `databaseHooks.user.create.before` assigns `admin` to user count 0, `user` to count ≥ 1

### Property-Based Tests

- Generate arbitrary user objects with `role: "user"` and verify all write routes return 403/redirect
- Generate arbitrary authenticated requests to read-only endpoints and verify role change does not affect responses
- Generate arbitrary comment payloads and verify they persist with correct `authorId` and `postId`
- Generate arbitrary sequences of like/unlike and verify idempotency of the final count

### Integration Tests

- Full flow: register two users, verify first gets `admin`, second gets `user`; second user cannot access `/write`
- Full flow: admin creates a post, authenticated user comments and likes, guest sees comment + count + login prompt
- Full flow: verify `bg-background` and `bg-secondary-background` utility classes resolve to the new navy/slate values across multiple pages
- Full flow: admin edits and deletes a post end-to-end — Cloudinary + DB — unchanged by the role fix
