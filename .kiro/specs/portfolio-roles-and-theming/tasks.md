# Implementation Plan

- [x] 1. Write bug condition exploration tests
  - **Property 1: Bug Condition** - Role Access, Missing Interaction UI, and Teal/Yellow Theme
  - **CRITICAL**: These tests MUST FAIL on unfixed code — failure confirms the bugs exist
  - **DO NOT attempt to fix the tests or the code when they fail**
  - **NOTE**: These tests encode the expected behavior — they validate the fixes when they pass after implementation
  - **GOAL**: Surface counterexamples that demonstrate each bug exists
  - **Scoped PBT Approach**: Scope role-access property to non-admin authenticated users attempting write routes; scope theme property to the two concrete bad color tokens
  - Role Access: for all users where `user.role != "admin"`, assert that accessing `/write` or calling POST/PATCH/DELETE `/api/posts` returns a redirect or 403 — on unfixed code this will FAIL (non-admin users currently succeed)
  - Interaction UI: render `BlogView` with a mock post and authenticated session — assert a comment input and like button are present — on unfixed code this will FAIL (no such elements exist)
  - Theme: read `--color-background` and `--color-secondary-background` from `globals.css` — assert neither equals `#013E37` or `#FFEFB3` — on unfixed code this will FAIL (tokens are still teal/yellow)
  - Navbar: render `Navbar` with a non-admin session and assert the "Write" link is absent — on unfixed code this will FAIL
  - Run all tests on UNFIXED code
  - **EXPECTED OUTCOME**: Tests FAIL (this is correct — it proves the bugs exist)
  - Document counterexamples found to understand root cause
  - Mark task complete when tests are written, run, and failures are documented
  - _Requirements: 1.1, 1.2, 1.3, 1.4, 1.5, 1.6_

- [x] 2. Write preservation property tests (BEFORE implementing fix)
  - **Property 2: Preservation** - Admin Write Workflow and Unrelated Features Unchanged
  - **IMPORTANT**: Follow observation-first methodology
  - Observe: admin user can GET `/write`, POST `/api/posts`, PATCH `/api/posts/:id`, DELETE `/api/posts/:id` on unfixed code
  - Observe: `GET /api/posts` returns paginated posts with correct shape on unfixed code
  - Observe: `GET /api/posts/search` returns matching posts on unfixed code
  - Observe: article page `BlogView` renders post title, content, cover image, and Edit/Delete controls for admin author on unfixed code
  - Write property-based test: for all users where `isBugCondition_RoleAccess` returns false (admin users), all write route responses are identical before and after the fix
  - Write property-based test: for all requests that do not involve write-route access, interaction UI, or color tokens, the response shape and status are unchanged
  - Verify all preservation tests PASS on UNFIXED code
  - **EXPECTED OUTCOME**: Tests PASS (this confirms baseline behavior to preserve)
  - Mark task complete when tests are written, run, and passing on unfixed code
  - _Requirements: 3.1, 3.2, 3.3, 3.4, 3.5, 3.6, 3.7_

- [x] 3. Fix role enforcement, comments/likes, and theme

  - [x] 3.1 Add `role` field to Prisma User model and add Comment/Like models
    - Add `role String @default("user")` to the `User` model in `prisma/schema.prisma`
    - Add `Comment` model: `id`, `content`, `createdAt`, `authorId` (→ User), `postId` (→ Post)
    - Add `Like` model: `id`, `userId` (→ User), `postId` (→ Post), with `@@unique([userId, postId])`
    - Add `comments Comment[]` and `likes Like[]` back-relations to `User` and `Post`
    - Run `prisma migrate dev` to apply schema changes
    - _Bug_Condition: isBugCondition_RoleAccess — no `role` field exists on user; isBugCondition_NoInteraction — no Comment/Like models exist_
    - _Requirements: 2.1, 2.4, 2.5, 2.6_

  - [x] 3.2 Configure better-auth admin plugin in `app/lib/auth.ts` and `app/lib/auth-client.ts`
    - Import and register the `admin` plugin from `better-auth/plugins` in `app/lib/auth.ts`
    - Add a `databaseHooks.user.create.before` hook: query `prisma.user.count()`; if count is 0 set `role: "admin"`, otherwise set `role: "user"`
    - Import and register `adminClient` from `better-auth/client/plugins` in `app/lib/auth-client.ts` so the session type exposes `role`
    - _Bug_Condition: isBugCondition_RoleAccess — auth.ts has no admin plugin so session carries no role claim_
    - _Expected_Behavior: first registered user gets role "admin"; all subsequent users get role "user"_
    - _Requirements: 2.1, 2.2, 2.3_

  - [x] 3.3 Add admin role guard to write API routes
    - In `app/api/posts/route.ts` POST handler: after the existing session check, add `if (session.user.role !== "admin") return NextResponse.json({ error: "Forbidden" }, { status: 403 })`
    - In `app/api/posts/[postId]/route.ts` PATCH and DELETE handlers: add the same role guard after the session check
    - _Bug_Condition: isBugCondition_RoleAccess(user) where user.role != "admin" AND requestMethod IN ["POST","PATCH","DELETE"]_
    - _Expected_Behavior: non-admin users receive HTTP 403 from write API endpoints_
    - _Preservation: GET /api/posts and GET /api/posts/[postId] remain unchanged; admin users continue to create, update, and delete posts_
    - _Requirements: 2.3, 3.1, 3.2, 3.3_

  - [x] 3.4 Add role-based redirect to `/write` and `/write/edit/[postId]` pages
    - In `app/write/page.tsx`: import `useSession` from `app/lib/auth-client`; add a `useEffect` that calls `router.replace("/articles")` when `session?.user.role !== "admin"` (and session is not pending)
    - In `app/write/edit/[postId]/page.tsx`: apply the same `useEffect` guard
    - _Bug_Condition: isBugCondition_RoleAccess(user) where user.role != "admin" AND requestPath starts with "/write"_
    - _Expected_Behavior: non-admin authenticated users are redirected to /articles_
    - _Preservation: admin users see the write and edit forms unchanged_
    - _Requirements: 2.3, 3.1, 3.2_

  - [x] 3.5 Update Navbar to show "Write" link only for admin users
    - In `app/components/general/navbar/Navbar.tsx`: change the "Write" link condition from `session` truthy to `session?.user.role === "admin"`
    - _Bug_Condition: isBugCondition_RoleAccess — navbar shows "Write" to all authenticated users regardless of role_
    - _Expected_Behavior: "Write" link visible only when session.user.role === "admin"_
    - _Preservation: all other navbar items and logout/login behavior unchanged_
    - _Requirements: 2.2, 2.3_

  - [x] 3.6 Create comments and likes API routes
    - Create `app/api/posts/[postId]/comments/route.ts`: GET returns all comments for the post ordered by `createdAt desc` including author name and image; POST requires session and creates a comment record
    - Create `app/api/posts/[postId]/likes/route.ts`: GET returns total like count and whether the current session user has liked the post; POST requires session and toggles the like (upsert/delete)
    - _Bug_Condition: isBugCondition_NoInteraction — no API endpoints exist for comments or likes_
    - _Expected_Behavior: authenticated users can POST comments and toggle likes; guests can GET comment list and like count_
    - _Requirements: 2.4, 2.5, 2.6, 2.7_

  - [x] 3.7 Create `CommentsLikes` component and integrate into `BlogView`
    - Create `app/components/blog-page/CommentsLikes.tsx`: client component accepting `postId`; renders like button with count + comment list + comment textarea/submit for authenticated users, or login prompt for guests; fetches via the two new API routes using `useQuery`/`useMutation` from `@tanstack/react-query`
    - In `app/components/blog-page/BlogView.tsx`: import and render `<CommentsLikes postId={post.id} />` below the `border-t` divider
    - _Bug_Condition: isBugCondition_NoInteraction — BlogView renders no comment section or like button_
    - _Expected_Behavior: authenticated users see comment input and like toggle; guests see comment list, like count, and login prompt_
    - _Preservation: article title, content, cover image, author info, Edit/Delete controls for admin author all unchanged_
    - _Requirements: 2.4, 2.5, 2.6, 2.7, 3.7_

  - [x] 3.8 Replace teal/yellow color tokens in `globals.css`
    - In `app/globals.css`: replace `--color-background: #013E37` with `--color-background: #0f172a`
    - Replace `--color-secondary-background: #FFEFB3` with `--color-secondary-background: #1e293b`
    - _Bug_Condition: isBugCondition_Theme(cssToken) where cssToken = "#013E37" OR cssToken = "#FFEFB3"_
    - _Expected_Behavior: all pages render with deep navy background (#0f172a) and muted slate secondary background (#1e293b)_
    - _Preservation: --color-primary (#1e3a8a) and all other tokens unchanged; all Tailwind utility classes that reference bg-background and bg-secondary-background propagate the new values automatically_
    - _Requirements: 2.8_

  - [x] 3.9 Verify bug condition exploration tests now pass
    - **Property 1: Expected Behavior** - Role Access, Interaction UI, and Theme
    - **IMPORTANT**: Re-run the SAME tests from task 1 — do NOT write new tests
    - The tests from task 1 encode the expected behavior
    - When these tests pass, it confirms all three bug conditions are resolved
    - Run bug condition exploration tests from step 1 on FIXED code
    - **EXPECTED OUTCOME**: Tests PASS (confirms all bugs are fixed)
    - _Requirements: 2.1, 2.2, 2.3, 2.4, 2.5, 2.6, 2.7, 2.8_

  - [x] 3.10 Verify preservation tests still pass
    - **Property 2: Preservation** - Admin Write Workflow and Unrelated Features Unchanged
    - **IMPORTANT**: Re-run the SAME tests from task 2 — do NOT write new tests
    - Run preservation property tests from step 2 on FIXED code
    - **EXPECTED OUTCOME**: Tests PASS (confirms no regressions)
    - Confirm admin write, search, article listing, OAuth, and Edit/Delete controls all work as before

- [x] 4. Checkpoint — Ensure all tests pass
  - Ensure all tests pass; ask the user if any questions arise
