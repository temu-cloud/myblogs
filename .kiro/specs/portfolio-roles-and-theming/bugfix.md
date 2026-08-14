# Bugfix Requirements Document

## Introduction

The existing Next.js blog app needs to be adapted into a professional portfolio system. Three behavioral gaps exist: (1) any authenticated user can currently write/edit/delete articles — there is no admin role, so access control is broken; (2) no comment or like functionality exists for regular users; (3) the color theme uses a teal/yellow palette (`#013E37` / `#FFEFB3`) that is not appropriate for a professional portfolio. These gaps must be fixed without rebuilding the application.

---

## Bug Analysis

### Current Behavior (Defect)

1.1 WHEN any authenticated user is logged in THEN the system shows the "Write" link in the navbar and allows them to create articles via `/write`

1.2 WHEN any authenticated user visits `/write/edit/[postId]` THEN the system allows them to submit an update to any post they authored, with no admin-role restriction enforced at the route or API level

1.3 WHEN any authenticated user triggers delete on a post they authored THEN the system deletes it, because the API only checks `authorId === userId` with no concept of an admin role

1.4 WHEN a logged-in non-admin user views an article THEN the system shows no way to interact (no comment input, no like button)

1.5 WHEN a guest (unauthenticated) user views an article THEN the system shows no comment or like section at all

1.6 WHEN any page is rendered THEN the system applies `background: #013E37` (dark teal) and `secondary-background: #FFEFB3` (yellow) which look informal and unsuitable for a professional portfolio

### Expected Behavior (Correct)

2.1 WHEN the first user registers in the system THEN the system SHALL assign that user the `admin` role, and all subsequently registered users SHALL receive the `user` role

2.2 WHEN the logged-in user has the `admin` role THEN the system SHALL show the "Write" link in the navbar and allow article creation, editing, and deletion

2.3 WHEN the logged-in user has the `user` role THEN the system SHALL NOT show the "Write" link in the navbar and SHALL deny access to `/write` and `/write/edit/[postId]` with a redirect

2.4 WHEN a logged-in user (any role) views an article THEN the system SHALL display a comment input and a like button for that article

2.5 WHEN an authenticated user submits a comment THEN the system SHALL save the comment linked to the user and post, and display it on the article page

2.6 WHEN an authenticated user clicks the like button THEN the system SHALL toggle the like (add if not liked, remove if already liked) and display the current like count

2.7 WHEN a guest views an article THEN the system SHALL show existing comments and like count, and prompt the user to log in to comment or like

2.8 WHEN any page is rendered THEN the system SHALL apply a professional dark portfolio theme using deep navy/charcoal background (`#0f172a`), muted slate secondary background (`#1e293b`), and the existing indigo accent (`#1e3a8a`), replacing the current teal/yellow palette

### Unchanged Behavior (Regression Prevention)

3.1 WHEN the admin user creates a new article via `/write` THEN the system SHALL CONTINUE TO upload the cover image to Cloudinary, generate a unique slug, and persist the post to the database

3.2 WHEN the admin user edits an existing article via `/write/edit/[postId]` THEN the system SHALL CONTINUE TO update the post and redirect to the updated article slug

3.3 WHEN the admin user deletes an article THEN the system SHALL CONTINUE TO remove the cover image from Cloudinary and delete the post record from the database

3.4 WHEN any user performs a search THEN the system SHALL CONTINUE TO return matching posts via the existing search API

3.5 WHEN any user navigates to `/articles` THEN the system SHALL CONTINUE TO display paginated posts with infinite scroll

3.6 WHEN any user signs in with Google or GitHub THEN the system SHALL CONTINUE TO authenticate via better-auth with no change to the OAuth flow

3.7 WHEN the admin views an article they authored THEN the system SHALL CONTINUE TO show the Edit and Delete controls on the article page

---

## Bug Condition Pseudocode

### Bug Condition — Role Enforcement

```pascal
FUNCTION isBugCondition_RoleAccess(user)
  INPUT: user of type AuthenticatedUser
  OUTPUT: boolean

  RETURN user.role != "admin" AND (user accessing /write OR user accessing /write/edit/*)
END FUNCTION

// Fix Checking
FOR ALL user WHERE isBugCondition_RoleAccess(user) DO
  result ← accessWriteRoute'(user)
  ASSERT result = REDIRECT("/articles")
END FOR

// Preservation Checking
FOR ALL user WHERE NOT isBugCondition_RoleAccess(user) DO
  ASSERT accessWriteRoute(user) = accessWriteRoute'(user)
END FOR
```

### Bug Condition — Missing Comments & Likes

```pascal
FUNCTION isBugCondition_NoInteraction(context)
  INPUT: context = { page: "article", feature: "comment" | "like" }
  OUTPUT: boolean

  RETURN feature does not exist in current codebase
END FUNCTION

// Fix Checking
FOR ALL context WHERE isBugCondition_NoInteraction(context) DO
  result ← renderArticlePage'(context)
  ASSERT result CONTAINS commentSection AND likeButton
END FOR
```

### Bug Condition — Theme

```pascal
FUNCTION isBugCondition_Theme(colorToken)
  INPUT: colorToken of type CSSVariable
  OUTPUT: boolean

  RETURN colorToken = "#013E37" OR colorToken = "#FFEFB3"
END FUNCTION

// Fix Checking
FOR ALL colorToken WHERE isBugCondition_Theme(colorToken) DO
  result ← applyTheme'()
  ASSERT background = "#0f172a" AND secondaryBackground = "#1e293b"
END FOR
```
