# Flow: migrate from upstream OpenMausBot

## Diagram

```mermaid
flowchart TD
  A[This computer still runs upstream] --> B[Export an encrypted workspace backup]
  B --> C[Install Agents Hub, do not sign in to cloud.openmausbot.com]
  C --> D[Restore the backup onto the hub node]
  D --> E[Routines paused, engines need the person's own sign-in]
  E --> F[Point the updater at the fork's feed]
  F --> G[Remove upstream notices: Cloud Pro popup, trial intro, PostHog, old broker URL]
```

## Steps

| Step | Who | What happens | Result |
| --- | --- | --- | --- |
| 1 | Person | Exports from the current app | File they hold |
| 2 | Person | Installs Agents Hub and restores | Bots and chats on the hub |
| 3 | Person | Signs in Claude or Codex on the node | No trial relay |
| 4 | Person | Connects Gmail on their own connector project | Inbox can start empty of rules |
| 5 | Person | Confirms the packaged build does not call upstream hosts | Release checklist |

`enterprise/` data is not imported. The learning ledger starts empty, which is honest: upstream did not have these decisions.
