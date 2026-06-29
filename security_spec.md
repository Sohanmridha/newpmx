# Security Spec - MridhaX Leaderboard

## Data Invariants
- A user profile must have a valid `userId` matching the Auth UID.
- `totalFocusMinutes` must be a non-negative integer.
- Users can only edit their own profile.
- Public data (name, stats) is readable by all authenticated users to enable the Global Leaderboard.
- Posts must be created by the authenticated user.
- Comments must be created by the authenticated user and linked to a valid post.
- `points`, `prayerStreak`, `maintenanceScore` are system-managed or restricted update fields.

## The Dirty Dozen Payloads
1. Create a profile with a different `userId` than current Auth.
2. Update someone else's `totalFocusMinutes`.
3. Set `totalFocusMinutes` to a negative value.
4. Set `name` to a 2MB string (resource exhaustion).
5. Inject a "Ghost Field" `isAdmin: true` into the profile.
6. Delete another user's profile.
7. Update `lastUpdated` to a date in the past (instead of server time).
8. Read a profile without being signed in.
9. List all user profiles without being signed in.
10. Update a profile with invalid characters in the `userId`.
11. Set `habitConsistency` to a value > 100 or < 0.
12. Modify the `userId` field itself during an update (immutable field).
13. Create a post as another user.
14. Delete a post you didn't create.
15. Create a comment on a non-existent post.
16. Update a post content with an invalid type.

## Test Runner (Logic)
- `service firestore.test`
- `on /users/userA: allow group: authenticated;`
- `on /users/userA: deny group: unauthenticated, otherUsers(write);`
- `on /posts/postA: allow owner(write), authenticated(read);`
- `on /posts/postA/comments/commentA: allow owner(write), authenticated(read);`
