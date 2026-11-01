# Spec: backups and migration

## Backup

The existing encrypted `.ombbackup` (`shared/workspace-backup.ts`) is the container. Agents Hub adds a manifest:

```json
{ "product": "agents-hub", "workspaceId": "ws_home", "nodeId": "nd_hub", "ledgerCommits": 42, "channels": ["whatsapp-bridge", "gmail"] }
```

The archive includes the ledger git directory. It excludes connector tokens, channel secrets, WhatsApp session files, and CLI homes, which today’s policy already keeps out. Routines restore paused. Ledger rules restore as they were, including trust. The person still reconnects providers before triage runs.

Password of at least 12 characters. Caps stay 10 GB and 100k entries unless the ledger would be truncated, in which case the backup fails rather than dropping commits.

## Migration from upstream

1. Export a backup from OpenMausBot on this computer.
2. Restore it onto an Agents Hub node.
3. Do not call `cloud.openmausbot.com` during or after.
4. The ledger starts with no commits. Old approval cards are history, not rules. The main agent does not infer rules from old transcripts.
5. `enterprise/` files are skipped if present in a hand-made copy.

A one-home journal (`one-home.json`) is not replayed. The workspace simply lives on the node they restored to.
