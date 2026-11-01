# Flow: a node goes offline

## Diagram

```mermaid
flowchart TD
  A[Heartbeat age] --> B{Age}
  B -->|under 30s| C[online]
  B -->|30s to 90s| D[degraded, still primary]
  B -->|over 90s| E[offline]
  E --> F{MVP pinned?}
  F -->|Yes| G[Workspace shows Offline. Routines do not start elsewhere.]
  F -->|v1 standby| H[Freeze primary, promote standby if replica is fresh]
  H --> I[Sticky WhatsApp stays paused]
  H --> J[Ledger is on the replica only if the last replica included it]
```

## Steps

| Step | Who | What happens | Result |
| --- | --- | --- | --- |
| 1 | Plane | Marks degraded, then offline | Home shows it |
| 2 | MVP | Does not start the workspace on another node | Mail waits at the provider. Routines miss. |
| 3 | v1 | Promotes a standby only with a fresh replica and a lease | Old primary stays frozen if it returns |
| 4 | Person | Confirms or reverts | No silent double run |

Inbox triage does not run on a node that is not primary.
