# Flow: backup and restore

## Diagram

```mermaid
flowchart TD
  A[Admin: Back up workspace] --> B[Password, 12 characters or more]
  B --> C[Encrypted archive, ledger included, secrets excluded]
  C --> D[Download or, later, another disk]
  D --> E[Restore on a node]
  E --> F[Routines paused, ledger repo restored, channels need secrets again]
```

## Steps

| Step | Who | What happens | Result |
| --- | --- | --- | --- |
| 1 | Admin | Starts a backup | `.ombbackup` plus an Agents Hub manifest |
| 2 | Archive | Includes the ledger git repo | Does not include connector tokens or the WhatsApp session |
| 3 | Admin | Restores onto a node | Counts checked, routines paused |
| 4 | Person | Reconnects mail and WhatsApp | Inbox cursor can resume. Send trust rules survived. |
