# Tickets

46 tickets in 17 epics. Import `tickets.json`. Fields: title, description, epic, milestone, priority (1 highest), estimate (S/M/L).

## Control plane

### Embedded control plane and first-run setup

- Milestone: MVP. Priority: 1. Estimate: M.
- Spec: [docs/product/03-specs/control-plane.md](../03-specs/control-plane.md)

SQLite plane on the hub. POST /api/v1/setup creates the org and owner once.

Acceptance:

- Setup returns 409 after the first owner
- Session cookie is HttpOnly
- Listen stays loopback until an admin changes it

### Home API for workspaces, nodes, and inbox counts

- Milestone: MVP. Priority: 2. Estimate: M.
- Spec: [docs/product/03-specs/control-plane.md](../03-specs/control-plane.md)

GET /api/v1/home returns workspace status, node health, pending approvals, and node-hours.

Acceptance:

- Offline node shows last cache and a timestamp
- Mail bodies are not in the payload

### OIDC for the plane

- Milestone: v1. Priority: 4. Estimate: L.
- Spec: [docs/product/03-specs/control-plane.md](../03-specs/control-plane.md)

Self-host can use an identity provider.

Acceptance:

- Password login still works

## Node agent

### Node pairing with a one-time code

- Milestone: MVP. Priority: 1. Estimate: M.
- Spec: [docs/product/03-specs/node-agent-pairing.md](../03-specs/node-agent-pairing.md)

Admin mints a code. The node redeems it from stdin. The plane stores a hash.

Acceptance:

- Code expires in 10 minutes and is single use
- Token file is mode 0600
- Revoke makes the next heartbeat 401

### Heartbeat and long-poll work items

- Milestone: MVP. Priority: 1. Estimate: M.
- Spec: [docs/product/03-specs/node-agent-pairing.md](../03-specs/node-agent-pairing.md)

Node dials the plane every 15s and long-polls for decisions and placements.

Acceptance:

- Status moves online, degraded, offline on the documented ages
- A NAT node needs no inbound port

### Docker and desktop install shapes

- Milestone: MVP. Priority: 2. Estimate: M.
- Spec: [docs/product/03-specs/node-agent-pairing.md](../03-specs/node-agent-pairing.md)

Same agent on the Mac app and on Compose.

Acceptance:

- Compose pair reads the code from stdin
- Desktop can be the embedded plane

## Workspaces

### Create a workspace pinned to one node

- Milestone: MVP. Priority: 1. Estimate: S.
- Spec: [docs/product/03-specs/scheduling-failover.md](../03-specs/scheduling-failover.md)

Admin names a workspace and a primary node.

Acceptance:

- A second primary is 409
- Personal flag hides invites

### Move a workspace between nodes

- Milestone: MVP. Priority: 1. Estimate: L.
- Spec: [docs/product/03-specs/scheduling-failover.md](../03-specs/scheduling-failover.md)
- Depends on: Create a workspace pinned to one node

Copy, check counts, freeze source, unfreeze target.

Acceptance:

- Mismatch discards the import
- Routines do not run on both
- WhatsApp session is not copied
- Ledger repo moves with the data dir

### Show offline instead of failing over

- Milestone: MVP. Priority: 2. Estimate: S.
- Spec: [docs/product/04-flows/node-offline.md](../04-flows/node-offline.md)

Pinned MVP does not start work on another node.

Acceptance:

- Home says Offline
- Inbox triage does not run

### Standby replica and fenced failover

- Milestone: v1. Priority: 3. Estimate: L.
- Spec: [docs/product/03-specs/scheduling-failover.md](../03-specs/scheduling-failover.md)

Promote a standby when the primary is offline and the replica is fresh.

Acceptance:

- Old primary stays frozen if it returns
- Sticky WhatsApp stays paused
- Lease bounds split brain

## Bot runtime

### Main-agent flag on a bot

- Milestone: MVP. Priority: 1. Estimate: S.
- Spec: [docs/product/03-specs/learning-ledger.md](../03-specs/learning-ledger.md)

One bot per workspace has role main and is the only ledger writer.

Acceptance:

- A second main is rejected
- Other bots can propose and cannot commit

### Drop upstream included model credentials

- Milestone: MVP. Priority: 1. Estimate: M.
- Spec: [docs/product/03-specs/update-channel.md](../03-specs/update-channel.md)

No trial relay, no included Boat key.

Acceptance:

- Packaged defaults contain none of the banned hosts
- A person's own key still works

### Hermes or other runtime as a node adapter

- Milestone: later. Priority: 4. Estimate: L.
- Spec: [docs/product/03-specs/bot-runtime.md](../03-specs/bot-runtime.md)

Another agent binary can sit behind the node contract.

Acceptance:

- The ledger tool is still the only write path

## Routines

### Retire runOn cloud

- Milestone: MVP. Priority: 2. Estimate: S.
- Spec: [docs/product/03-specs/routines-triggers.md](../03-specs/routines-triggers.md)

Routines run only on an unfrozen primary.

Acceptance:

- A frozen node does not fire schedules

### Inbox morning routine

- Milestone: MVP. Priority: 1. Estimate: M.
- Spec: [docs/product/03-specs/inbox-autopilot.md](../03-specs/inbox-autopilot.md)

System routine at 07:30 that runs triage.

Acceptance:

- Overlap skip
- Missed when the node is offline
- Cursor does not skip mail

## Connectors

### Connector provider interface

- Milestone: MVP. Priority: 1. Estimate: L.
- Spec: [docs/product/03-specs/connectors.md](../03-specs/connectors.md)

Composio, Pipedream, Nango, and MCP behind one interface.

Acceptance:

- Plane stores labels not refresh tokens
- Upstream broker URL is not the default

### Bind Gmail as an inbox account

- Milestone: MVP. Priority: 1. Estimate: M.
- Spec: [docs/product/03-specs/inbox-autopilot.md](../03-specs/inbox-autopilot.md)

A connection can be marked inbox.

Acceptance:

- A generic trigger does not become triage
- Auth expiry stops triage and says reconnect

## Channels

### WhatsApp bridge adapter

- Milestone: MVP. Priority: 1. Estimate: L.
- Spec: [docs/product/03-specs/messaging-channels.md](../03-specs/messaging-channels.md)

HTTP adapter to the existing daemon. Allowlist. Sticky.

Acceptance:

- Unknown senders are dropped
- Outbound send requires approval
- Session is not stored on the plane

### Keep the phone WhatsApp sheet

- Milestone: MVP. Priority: 2. Estimate: S.
- Spec: [docs/product/03-specs/messaging-channels.md](../03-specs/messaging-channels.md)

PHONE_SEND_WHATSAPP still works without a bridge.

Acceptance:

- Both channels can be on

### Slack channel adapter

- Milestone: v1. Priority: 3. Estimate: M.
- Spec: [docs/product/03-specs/messaging-channels.md](../03-specs/messaging-channels.md)

Slack app on the node or a connector trigger, same channel row.

Acceptance:

- enterprise hosted Slack URL is not used

### Official WhatsApp Business adapter

- Milestone: later. Priority: 4. Estimate: L.
- Spec: [docs/product/03-specs/messaging-channels.md](../03-specs/messaging-channels.md)

A supported business-number path beside the existing bridge.

Acceptance:

- The unofficial bridge is unchanged
- No bulk send tools

## Learning ledger

### Init the private ledger repo

- Milestone: MVP. Priority: 1. Estimate: M.
- Spec: [docs/product/03-specs/learning-ledger.md](../03-specs/learning-ledger.md)

First decision creates a git repo mode 0700 with no remote.

Acceptance:

- README and empty decisions.jsonl exist
- Shell bots cannot write the repo

### Append decisions.jsonl

- Milestone: MVP. Priority: 1. Estimate: M.
- Spec: [docs/product/03-specs/learning-ledger.md](../03-specs/learning-ledger.md)

Every keep, archive, trash, label, approve, reject, and edit_draft writes action, reason, decided_by, and date.

Acceptance:

- Full mail bodies are not stored
- A missing reason is confirmed in one sentence
- Cancel writes nothing

### Compile sender and category YAML

- Milestone: MVP. Priority: 1. Estimate: M.
- Spec: [docs/product/03-specs/learning-ledger.md](../03-specs/learning-ledger.md)

YAML is a pure function of the log and policy.yaml. One commit per decision.

Acceptance:

- Sender beats category
- Reject resets trust to ask
- git log message has no subject or body

### ledger.read for every agent

- Milestone: MVP. Priority: 1. Estimate: M.
- Spec: [docs/product/03-specs/learning-ledger.md](../03-specs/learning-ledger.md)

Agents must read before a destructive or outgoing action.

Acceptance:

- No match means ask
- A harness call that acts without a match is rejected

### Revert a ledger commit

- Milestone: MVP. Priority: 2. Estimate: S.
- Spec: [docs/product/03-specs/learning-ledger.md](../03-specs/learning-ledger.md)

Admin revert writes a new reject and recompiles. History is kept.

Acceptance:

- The revert itself is a decision

### Ledger page

- Milestone: MVP. Priority: 2. Estimate: M.
- Spec: [docs/product/04-flows/learning-loop.md](../04-flows/learning-loop.md)

Show YAML, the log, and commits. File text comes from the node.

Acceptance:

- Guests cannot open it
- The plane database does not keep the YAML

## Inbox autopilot

### Split inbox Important and Other

- Milestone: MVP. Priority: 1. Estimate: L.
- Spec: [docs/product/03-specs/inbox-autopilot.md](../03-specs/inbox-autopilot.md)

Triage classifies new Gmail using the ledger.

Acceptance:

- Unknown people stay Important
- Unknown bulk stays unresolved
- Known archive trust archives without a card

### Cleanup batch approval

- Milestone: MVP. Priority: 1. Estimate: M.
- Spec: [docs/product/04-flows/approving-cleanup.md](../04-flows/approving-cleanup.md)

Unresolved mail groups into one card per sender.

Acceptance:

- Approve writes one decision and applies those ids
- Reject writes reject and leaves the mail
- Unchecking rows archives only the rest

### Reply drafts that do not send

- Milestone: MVP. Priority: 1. Estimate: M.
- Spec: [docs/product/03-specs/inbox-autopilot.md](../03-specs/inbox-autopilot.md)

Drafts land in Gmail and in the queue.

Acceptance:

- Edit writes edit_draft
- Send requires approve
- Archive decisions do not grant send

### Snooze, reminders, and follow-up nudges

- Milestone: MVP. Priority: 2. Estimate: M.
- Spec: [docs/product/03-specs/inbox-autopilot.md](../03-specs/inbox-autopilot.md)

One-off times live outside the rule files. A nudge is a card.

Acceptance:

- Always snooze is the only snooze that becomes a decision
- Sending a nudge is a send

### Trust thresholds and earned-send switch

- Milestone: MVP. Priority: 1. Estimate: M.
- Spec: [docs/product/03-specs/inbox-autopilot.md](../03-specs/inbox-autopilot.md)

Defaults: archive after 3, trash after 5, label after 2, outgoing off.

Acceptance:

- Only the owner can enable earned send
- Send trust is per sender and never inferred from edits

### Outlook inbox provider

- Milestone: v1. Priority: 3. Estimate: L.
- Spec: [docs/product/03-specs/inbox-autopilot.md](../03-specs/inbox-autopilot.md)

Same triage through Pipedream or Nango.

Acceptance:

- Gmail behavior does not change
- Tokens stay at the provider

## Approvals

### Approval metadata and apply path

- Milestone: MVP. Priority: 1. Estimate: M.
- Spec: [docs/product/03-specs/approvals-question-queue.md](../03-specs/approvals-question-queue.md)

Plane stores title and prompt hash. Node applies the decision.

Acceptance:

- Stale hash is refused
- Expiry denies the side effect
- Ledger proposal runs after a recorded decision

## Usage

### Node-hour meter

- Milestone: MVP. Priority: 1. Estimate: M.
- Spec: [docs/product/03-specs/usage-metering.md](../03-specs/usage-metering.md)

Managed placement time rolls up. Attached nodes are shown and not billed.

Acceptance:

- Self-host has no denominator
- Duplicate samples are ignored
- Tokens stay a separate estimate

### Cap managed routines at 100%

- Milestone: v1. Priority: 3. Estimate: M.
- Spec: [docs/product/03-specs/usage-metering.md](../03-specs/usage-metering.md)

When the pool is full and overage is off, new routine starts pause.

Acceptance:

- Chats still run
- Data is not deleted

## Billing

### Billing page for self-host

- Milestone: MVP. Priority: 2. Estimate: S.
- Spec: [docs/product/03-specs/billing.md](../03-specs/billing.md)

Explains there is nothing to pay.

Acceptance:

- No card form
- No call to Dodo

### Managed checkout handoff

- Milestone: v1. Priority: 2. Estimate: L.
- Spec: [docs/product/03-specs/billing.md](../03-specs/billing.md)

Web checkout via a processor the owner chooses. Webhook sets the hour allowance.

Acceptance:

- Desktop only receives a handoff code
- Replay of the webhook is ignored
- Cancel keeps attached nodes

## Team

### Invites and roles

- Milestone: MVP. Priority: 2. Estimate: M.
- Spec: [docs/product/03-specs/team-rbac.md](../03-specs/team-rbac.md)

Owner, admin, member. Ledger read and revert follow the table.

Acceptance:

- Invite expires in 7 days
- Removing a member kills sessions
- Members do not see other direct transcripts by default

## Phone

### Phone pairing page

- Milestone: MVP. Priority: 2. Estimate: M.
- Spec: [docs/product/03-specs/phone-mobile.md](../03-specs/phone-mobile.md)

QR to the node. Phone can approve cleanup and cannot edit policy.

Acceptance:

- Code is single use
- Earned send is not available on the phone

## Backups

### Backup includes the ledger

- Milestone: MVP. Priority: 1. Estimate: M.
- Spec: [docs/product/03-specs/backups-migration.md](../03-specs/backups-migration.md)

Encrypted backup keeps the git repo and drops secrets and WhatsApp sessions.

Acceptance:

- Restore pauses routines
- Trust rules come back
- Truncating the ledger fails the backup

### Import an upstream OpenMausBot backup

- Milestone: MVP. Priority: 1. Estimate: M.
- Spec: [docs/product/04-flows/migrate-upstream.md](../04-flows/migrate-upstream.md)

Restore bots without calling upstream and without inventing ledger rules.

Acceptance:

- enterprise data is skipped
- Old cards are not compiled into rules

### Scheduled backup to a second disk

- Milestone: v1. Priority: 3. Estimate: M.
- Spec: [docs/product/03-specs/backups-migration.md](../03-specs/backups-migration.md)

Copy the encrypted archive to a folder or S3-compatible bucket.

Acceptance:

- The bucket receives ciphertext

## Updates

### Point updates at the fork

- Milestone: MVP. Priority: 1. Estimate: M.
- Spec: [docs/product/03-specs/update-channel.md](../03-specs/update-channel.md)

Feed URL is the owner's. autoDownload stays false.

Acceptance:

- Windows feed includes latest.yml
- Upstream GitHub is not the default

### Ban upstream hosts in the packaged build

- Milestone: MVP. Priority: 1. Estimate: M.
- Spec: [docs/product/03-specs/update-channel.md](../03-specs/update-channel.md)

A test fails if packaged defaults contain the cloud, account, broker, PostHog, checkout, or relay hosts.

Acceptance:

- The test is in CI
- CloudProPopup and the cloud-pro notice are unmounted

## Desktop hand-off

### Desktop What's new carousel

- Milestone: MVP. Priority: 2. Estimate: M.
- Spec: [docs/product/04-flows/whats-new.md](../04-flows/whats-new.md)

Three local slides over the bot list: sleep, node-hours, open the hub.

Acceptance:

- Not now remembers the release id
- Open Agents Hub uses a 60s handoff
- No Get Pro and no upstream URL
