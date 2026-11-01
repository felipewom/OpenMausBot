# Flow: invite a team

## Diagram

```mermaid
flowchart TD
  A[Admin: Invite] --> B[Email, role, optional workspace]
  B --> C[Token hash stored, link 7 days, one use]
  C --> D[Person opens the link]
  D --> E[Sets a password or signs in]
  E --> F[Member row, sessions]
```

## Steps

| Step | Who | What happens | Result |
| --- | --- | --- | --- |
| 1 | Admin | Invites by email as member or admin | Link |
| 2 | Person | Accepts | They see only the workspaces on the invite |
| 3 | Admin | Removes them later | Sessions die. `sessionVersion` bumps. |
| 4 | Guest | P1 | Named on a bot, not the whole workspace |

A member does not see another member’s direct transcripts unless the workspace policy is shared.
