# Agents Hub — product requirements

Status: discovery. This is the product description the specs, flows, prototype, and tickets implement. It is not an implementation plan with dates.

## 1. Vision

Agents Hub is the control plane for a team of AI bots that keeps working when any one computer is off.

A person runs bots the way they already do in this fork: each bot is a contact, with a persona, a model they bring themselves, a computer, connected apps, routines, and an approval when something matters. Agents Hub adds the missing piece upstream sells as MausBot Cloud, and the piece the owner’s agent-labs vision asked for, as one product:

- One website for every bot, routine, connection, approval, and node.
- The bots’ home can be a managed machine, a server the person rents, a Linux box, a Mac on the desk, or several of those at once.
- WhatsApp, Slack, and email keep reaching the bots.
- Risky actions wait in one queue, with an audit trail.
- Nothing in the product depends on upstream’s paid cloud, analytics, relay, checkout, or updater.

The fork stays local-first in the sense that a single machine with no account is a complete Agents Hub. Cloud is a place a node can run, not a lock-in.

## 2. Problem

Today the fork is a desktop app whose harness lives on that computer. Routines stop when the laptop sleeps. Upstream’s answer is one hosted Fly machine per paying customer (“My Cloud”), a website to see it, and a one-time move that makes that machine the only home. That solves “laptop closed” and creates a new trap: one vendor, one machine, one Composio project the person does not own, and no honest place for a homelab that already has a hub, a tailnet, and a WhatsApp bridge.

The owner’s world is already multi-machine. A product that only offers “move everything to our cloud” throws away the hub. A product that only offers “keep the desktop” throws away the Cloud website he wants.

## 3. Product principles

1. **A node the person can point at.** Mac, Linux, Docker, a VM, a homelab, a VPS, or a machine Agents Hub provisions. Same agent, same pairing.
2. **One plane, many nodes.** Workspaces, people, approvals, and the audit log are visible in one place. Execution stays on a node.
3. **Bring your own model.** Agents Hub does not resell Claude, Codex, or Grok. Usage of those plans is shown, not billed.
4. **Bring your own connector account.** Composio is an implementation, on the operator’s project. Pipedream and Nango are peers. Resale of Composio is out of bounds.
5. **WhatsApp keeps working.** The bridge the owner already runs stays a supported channel. The phone send-sheet stays the path that does not link WhatsApp Web.
6. **The main agent learns.** Every keep, archive, trash, label, approve, reject, and draft edit is written to a private per-workspace ledger. Other agents read it and ask only about cases it does not already cover.
7. **The inbox is the agent’s job.** Gmail, Outlook, and later mailboxes are triaged into Important and Other. Junk is cleaned from the ledger. Drafts wait for a person. Destructive and outgoing actions ask until that sender or category has earned trust.
8. **Ask before it hurts.** Shell, files, sends, and spends surface in one queue. Unattended work fails closed. A ledger rule can narrow what “hurts” means for one sender. It cannot turn the queue off for the whole workspace.
9. **Leave upstream cleanly.** Import an OpenMausBot backup. Do not call upstream’s hosts.
10. **Open by default.** The fork of upstream stays Apache-2.0. New Agents Hub code is Apache-2.0 unless the owner later chooses otherwise. `enterprise/` is not included.
11. **Personal data stays on the node** unless the person turns on an encrypted backup. The control plane stores metadata, not transcripts, and it does not store the learning ledger, by default.

## 4. Personas

### 4.1 Solo power user with a homelab

Alex runs a Mac mini as a hub, a laptop that sleeps, Tailscale, a WhatsApp bridge, and a dozen bots with routines. Alex is a senior engineer and will SSH, but wants a website for the question queue and for “which machine is this bot on.”

Jobs: see every node’s health, pin WhatsApp to the hub, move a noisy bot onto a VPS, answer an approval from a phone, restore last week’s backup, add a managed node without giving up the hub, open the morning inbox already split, and correct the agent once so it does not ask about that sender again.

Success: the laptop can be shut and the morning digest still arrives on WhatsApp. Alex can say which node ran it. A newsletter Alex trashed twice never asks a third time, and a reply to a person is still a draft.

### 4.2 Family

A household of four. One person administers the hub. Others have their own chats and must not see each other’s bots, and must not be able to change billing or delete the hub.

Jobs: invite a partner to the Family workspace only, let a teenager have a bot that cannot spend money or message strangers, share a calendar connection without sharing a mail connection.

Success: two workspaces (Home, Family) on the same hub, different members, one audit log the admin can read.

### 4.3 Small team

A team of about ten. An owner, two admins, members. Bots do support triage and research. Approvals must name a human. The company will not put transcripts on a vendor they do not have a contract with, so the control plane is self-hosted on a VM they already run.

Jobs: SSO later, RBAC now, per-member usage, a shared Slack channel, customer data staying on their VM.

Success: a member can chat and approve what they were assigned, and cannot export the workspace or read another member’s direct chats.

### 4.4 Agency

An operator runs a workspace per client. Clients must not see each other. The operator may later want a managed node per client so one client’s workload cannot fill the hub’s disk.

Jobs: create a workspace, place it on a node, invite the client as a member of that workspace only, meter hours per workspace, offboard a client by exporting and deleting.

Success: client A’s WhatsApp session, connections, and transcripts are unreachable from client B’s members. Offboarding produces a backup the client can import.

The agency persona is v1 for isolation and later for per-client managed nodes. MVP must not make isolation impossible (workspace is the tenancy boundary from the first schema).

## 5. Jobs to be done

| Job | Persona | Milestone |
| --- | --- | --- |
| Keep bots working when this computer is off | All | MVP, by pinning the workspace to a node that stays on |
| See clouds, nodes, bots, and usage in one website | All | MVP |
| Add a machine I already have | Solo, team | MVP |
| Add a managed machine without operating Docker | Solo, agency | v1 |
| Move a bot from one node to another | Solo | MVP (manual), v1 (with replica) |
| Survive a node going offline | Solo, team | v1 for movable routines; MVP shows the outage and pauses |
| Connect Gmail, Slack, and other apps on my own connector account | All | MVP |
| Talk to bots from WhatsApp | Solo, family | MVP, via the existing bridge adapter |
| Teach the main agent by deciding, not by rewriting a prompt | All | MVP ledger |
| Have the inbox triaged when I sit down | Solo, team | MVP for Gmail, P1 for Outlook |
| Let cleanup happen without asking, only where I have already been consistent | Solo | MVP propose-batch, P1 earned archive |
| Approve a send or a shell command from my phone | All | MVP |
| Know who did what | Team, agency | MVP audit of control-plane actions; v1 full tool audit |
| Invite my family or my team without sharing the admin role | Family, team | MVP |
| Pay for managed capacity, or pay nothing to self-host | All | Self-host MVP; billing v1 |
| Leave upstream OpenMausBot without losing bots | Solo | MVP import of `.ombbackup` |
| Update the software without upstream’s GitHub feed | Solo | MVP |

## 6. Concepts

### 6.1 Organization

The account. One billing relationship, many workspaces, many members. A self-hosted install has one organization created at setup. A managed Agents Hub can host many organizations.

### 6.2 Workspace

What the Cloud website calls a Cloud. Named, coloured, with a plan allowance when billing exists. Contains bots, rooms, routines, webhooks, connections, channels, and usage. Examples: Home, Design Studio, Family.

A workspace has a **placement**: a primary node, optional standby nodes, and a policy (`pinned` in MVP).

A workspace may be marked `personal`. Personal uses the owner-proof rules already documented for a Cloud home: only the owner’s devices administer it, and routines without owner proof run confined.

### 6.3 Node

A machine running the Agents Hub node agent. Kinds: `local` (Mac or Linux desktop or a homelab box), `docker` (the agent and harness in containers), `vm`, `managed` (provisioned by the plane).

A node reports heartbeat, OS, agent version, disk, memory, labels (`whatsapp`, `gpu`, `tailnet`, `desktop`), and which workspace replicas it holds.

The first node in an all-local install also runs the control plane. That is a mode, not a different product.

### 6.4 Bot

A `WireBot`, plus `workspaceId` and `placement` (inherit the workspace, or pin to a node). Engines stay the existing fleet. The computer (`cloud`, `vm`, `local`, `browser`, `off`) is a computer **on the node**, not a second hidden cloud.

### 6.5 Channel

A messaging adapter bound to a workspace and to the node that holds its session. Kinds in scope: `whatsapp-bridge` (the operator’s daemon), `whatsapp-phone` (the existing send sheet), `slack`, `email`. Telegram and others are later, behind the same interface.

### 6.6 Approval and question

A card the bot cannot answer alone. Kinds: shell, file edit, tool call, question, outbound message, spend. States: `pending`, `approved`, `denied`, `expired`, `cancelled`. The node enforces the decision. The plane shows the queue and stores the audit row.

### 6.7 Connection

An app account (Gmail, Slack, GitHub, Notion, Linear, and the rest) through a provider implementation: `composio`, `pipedream`, `nango`, or `mcp`. Tokens stay at the provider or on the node. The plane stores the provider, the toolkit, the display name, and which workspace may use it.

### 6.8 Usage

Two ledgers:

- **Token ledger**, already `UsageRow` on the node. Not billed by Agents Hub.
- **Capacity ledger**, new: node-seconds a workspace’s bots and desktops were running, rolled up to hours. This is the “128 of 360 hours” meter. It is not the learning ledger.

### 6.9 Learning ledger

A private git repository on the workspace’s primary node. The main agent is the only writer. Every user decision becomes a commit: an append-only `decisions.jsonl` line (`action`, `reason`, `decided_by`, `date`) and a compiled rule file such as `ledger/email/senders.yaml`. Other agents read the files at the start of a turn. They apply a matching rule and ask only when nothing matches. The control plane can show the ledger. It does not store a second copy of the mail.

### 6.10 Inbox

A workspace surface over one or more mail providers (Gmail first, Outlook next). Messages are split into Important and Other. The inbox agent summarizes, drafts, snoozes, nudges, and labels. Archive and trash of a known pattern follow the ledger. Sending does not.

## 7. Run anywhere

Run anywhere is a capability, not a separate product name.

| Topology | Control plane | Nodes | Who it is for |
| --- | --- | --- | --- |
| All local | On the hub | The hub, optionally the laptop as a second node that is often offline | Solo, homelab |
| Hybrid | On the hub or a small VM | Hub plus a VPS plus a laptop | Solo who wants a louder machine |
| Multi-server | On its own VM | Several nodes, labeled | Team, agency |
| Managed | Agents Hub’s hosted plane | Customer nodes, managed nodes, or both | Anyone who does not want to host the plane |

Rules that hold in every topology:

- A workspace has exactly one primary node in MVP.
- Two nodes never run the same routine at the same time. Upstream’s one-home rule (“nothing ever runs in two places”) stays.
- Moving a workspace is a copy, a check, a switch, and a freeze of the old primary. The person can switch back until they delete the copy.
- Channels with a live session (WhatsApp bridge) declare `sticky: true` and refuse to start on a node that does not hold the session files.
- The plane can be reached on loopback, on the tailnet, or through a tunnel the person configures. Upstream’s `accounts.openmausbot.com` tunnel is not used.
- Offline: if the plane is on the hub and the hub is up, the website works on the LAN even when the internet is down. Model calls and connector calls fail per bot and show as such. Approvals against a node that is up still work on the LAN.

Diagrams: [05-architecture](05-architecture/README.md).

## 8. Feature requirements

Priority is P0 (MVP), P1 (v1), P2 (later). Detail and APIs are in [03-specs](03-specs/README.md).

### 8.1 Control plane (P0)

- Sign-up on a self-hosted install creates the organization, the first admin, and offers to make this machine the first node.
- Web app pages: Home, Workspaces, Workspace, Nodes, Node, Bots, Routines, Connections, Channels, Approvals, Usage, Team, Invites, Billing, Settings, Phone, Audit. The prototype in [06-prototype](06-prototype/index.html) is the visual spec.
- The plane stores orgs, members, workspaces, node records, placement, approval metadata, audit, and capacity rollups.
- The plane does not store message bodies by default.
- Session auth: password for the self-hosted admin in MVP, session cookie, CSRF on mutations. Email magic link and OIDC are P1.

### 8.2 Node agent and pairing (P0)

- Install paths: a desktop build, a Docker Compose stack, a single Linux binary or package, a Mac menu-bar app that can run headless.
- Pairing: the plane shows a one-time code and a URL, the node redeems it within ten minutes, the node stores a device credential, the plane stores a hash. Same spirit as `shared/pairing-link.ts` and the connector enroll code.
- Heartbeat at least every 15 seconds. A node is `online`, `degraded` (missed 2), or `offline` (missed 6, about 90 seconds).
- The node runs the existing harness for the workspaces placed on it.
- Labels and capacity are reported, not trusted for security. Security is the pairing credential and the workspace ACL.

### 8.3 Scheduling and failover (P0 pin, P1 failover)

- P0: assign a workspace to a node. Show what is running. If the node is offline, mark routines missed and surface it. Do not start them elsewhere.
- P0: move a workspace to another node with an explicit wizard (copy, verify counts, switch, freeze source).
- P1: a standby node holds an encrypted replica. Movable routines fail over when the primary is offline and the standby is healthy. Sticky channels do not.
- P1: overlap rules (`skip`, `queue`) still apply after a failover so a late primary cannot double-run.

### 8.4 Bot runtime (P0)

- Create, edit, archive bots. Persona, model, approval mode, computer, workspace.
- Chat UI remains the existing app, served by the node and linked from the plane (“Open”).
- Engines: the current fleet, custom ACP, API keys the person supplies. Keys stay on the node (`config.json` discipline, mode `0600`).
- Bot computers on that node: local, local VM, browser, and an optional Bring-your-own Boat or Docker desktop. No included Boat credential.

### 8.5 Routines and triggers (P0)

- The existing schedule types, webhook triggers, and proactive checks.
- `runOn` becomes “the workspace’s primary node” rather than an upstream Cloud flag.
- Creating a routine from chat still works. The plane lists them and can pause, resume, and run once.
- Unattended approvals are held, as today.

### 8.6 Connectors (P0 interface, P0 Composio, P1 Pipedream, P1 Nango)

- One connection model in the UI.
- Composio through a broker the operator deploys (`OMB_COMPOSIO_BROKER_URL`), or a project key on the node for a pure self-host with no worker.
- No call to the upstream broker URL in a packaged build.
- Share connections inside a workspace on purpose. Default is private to the member who connected.
- Triggers (new Gmail, Slack message) deliver to the node that owns the workspace.

### 8.7 Channels (P0)

- WhatsApp bridge adapter: base URL of the daemon on the node or on the tailnet, shared secret, allowlist of phone numbers, inbound posts into a bot or a room, outbound goes through the approval queue unless the room’s policy is `auto` for that allowlist.
- WhatsApp phone sheet: unchanged tool, available when a phone is paired.
- Slack: a Slack app on the node (bot token plus signing secret) **or** a Composio connection. One of them is enough for MVP; the adapter interface must allow both.
- Email: Composio Gmail trigger for MVP, and the inbox in section 8.16. A trigger is not the inbox. IMAP is P1.

### 8.16 Learning ledger (P0)

- One main agent per workspace, flagged on the bot. It is the only process that commits the ledger.
- The repo lives at `<data-dir>/workspaces/<id>/ledger`, mode `0700`, `git init` on first decision, no remote unless an admin adds one.
- Decisions the ledger must record: `keep`, `archive`, `trash`, `label`, `approve`, `reject`, `edit_draft`. Also `snooze` and `remind` when the person is stating a rule, not a one-off.
- Each line of `decisions.jsonl` has `action`, `reason`, `decided_by` (member id), `date`, plus ids the agents need (`sender`, `category`, `object` id, `source`). Reason is the person’s words, or a one-line summary of an edit. Full message bodies are not copied into the repo by default.
- Compiled rules are YAML the agents can read without replaying the log. A rule names the action, the trust level, and the decision ids it came from.
- All agents on that workspace read the ledger before they act. A match means they act or they stay quiet. No match on a destructive or outgoing action means they ask.
- The Ledger page shows the files, the log, and the git history. An admin can revert a commit. A revert is itself a decision.

Detail: [03-specs/learning-ledger.md](03-specs/learning-ledger.md).

### 8.17 Inbox autopilot (P0 Gmail, P1 Outlook)

- The inbox agent owns triage for connected mailboxes. The person still has Gmail or Outlook. Agents Hub is the place that decides what deserves them.
- Split: **Important** and **Other**. Important is people and anything the ledger marks keep. Other is the rest, already grouped.
- Cleanup: newsletters and junk the ledger has learned are proposed as a batch (“Archive 14 from this sender”). After trust is earned for that sender or category, archive can run without a card. Trash stays behind a higher trust. Until then, trash is a batch approval.
- Summaries: a morning digest of Important, and one line per Other thread.
- Reply drafts sit in the queue and in the provider’s drafts. Sending is an approval. Editing the draft before send is an `edit_draft` decision, and the main agent writes the difference into the ledger so the next draft is closer.
- Reminders and snoozes return a thread at a time. A follow-up nudge fires when a sent mail has no reply. The nudge is a card, not an automatic send.
- Auto labels apply when a label rule matches. Labeling is not trash.
- Trust is per sender or per category, never global. Outgoing trust is not earned by count alone: the workspace must turn it on, and the default is off. Archive trust can be earned. See the spec.

Detail: [03-specs/inbox-autopilot.md](03-specs/inbox-autopilot.md). Flows: [04-flows/learning-loop.md](04-flows/learning-loop.md), [04-flows/inbox-triage.md](04-flows/inbox-triage.md), [04-flows/approving-cleanup.md](04-flows/approving-cleanup.md).

### 8.8 Approvals and the question queue (P0)

- One queue across workspaces the member can see.
- Filters: kind, bot, workspace, age.
- Actions: approve, deny, answer a question, expire.
- Phone can do the same actions.
- Every decision writes an audit row: who, when, bot, tool, decision, and a hash of the prompt the card showed. The prompt body stays on the node; the plane stores the hash and a short title.

### 8.9 Usage (P0)

- Per workspace: capacity hours used and included, token totals by bot and by model, connector event counts.
- The meter matches the screenshot’s information design: a used/included pair, a renew date, a link to the breakdown.
- No dollars on model tokens unless the node’s existing `costUsd` estimate is present, and then it is labeled as an estimate from the provider’s prices, not an Agents Hub charge.

### 8.10 Billing (P1)

- Self-host: no billing module required. The Billing page explains that this install is self-hosted.
- Managed plane: Stripe (or a processor the owner already uses). Not Dodo. Not upstream’s checkout.
- Suggested packaging is in section 10. It is a proposal, not a price promise.
- A failed payment marks managed nodes `past_due` and stops provisioning new ones. It does not delete data before the retention window (14 days in the proposal).

### 8.11 Team and RBAC (P0)

Roles, workspace-scoped:

| Action | Owner | Admin | Member | Guest |
| --- | --- | --- | --- | --- |
| Billing and delete org | yes | no | no | no |
| Add and remove nodes | yes | yes | no | no |
| Invite to a workspace | yes | yes | no | no |
| Create bots and routines | yes | yes | yes | no |
| Chat and answer approvals on assigned bots | yes | yes | yes | yes, if named on that bot |
| See other members’ direct transcripts | yes | admin sees audit metadata, not bodies, unless the workspace policy is `shared-transcripts` | no | no |
| Export backup | yes | yes | no | no |
| Manage connections | yes | yes | own connections | no |

Guest is P1. Owner, admin, and member are P0.

A member is invited by email link. The link expires in 7 days, single use. Revoking a member revokes their sessions and their node credentials if they had any.

### 8.12 Phone (P0)

- Pair the existing phone web app to a node (or to the plane, which proxies to the node) with the current QR and one-time code.
- The plane has a Phone page that explains which workspace the phone reaches and whether that node is online.
- Push is P1. Until then, the phone page is the queue and the chats, as today’s web app.

### 8.13 Backups and migration (P0)

- Backup a workspace to an encrypted `.ombbackup` the existing importer understands, plus an Agents Hub manifest (workspace id, node id, channel kinds, no secrets).
- Restore onto a node, routines paused, as today.
- Import a backup taken from upstream OpenMausBot on this computer.
- Do not import `enterprise/` state.
- Scheduled backup to a folder, S3-compatible bucket, or another node is P1.

### 8.14 Updates (P0)

- Desktop and node agent update from a feed the owner publishes (GitHub releases on the fork, or a static `latest.yml` the owner hosts).
- The feed URL is a build-time default the owner controls, overridable with an env var.
- `autoDownload` stays false until the person confirms, matching today’s updater behavior.
- The control plane shows nodes whose agent is behind.

### 8.15 Upstream removal (P0, and it blocks a release)

Packaged Agents Hub must not contact:

- `cloud.openmausbot.com` and the staging Fly host
- `accounts.openmausbot.com`
- the upstream Composio worker
- `us.i.posthog.com`
- the HighLevel relay
- `checkout.dodopayments.com`
- `github.com/milind-soni/OpenMausBot` as an update feed

The Cloud React components that sell that plan are removed or left unmounted. Local bot-computer code that talks to a Boat or VPS the **person** configured stays.

## 9. Non-functional requirements

### 9.1 Security

- Node credentials and session cookies are hashed at rest on the plane (SHA-256 or better for lookup tokens; passwords with a current password hash).
- Pairing codes are single use, at least 128 bits, ten-minute TTL.
- The harness keeps binding loopback. The node agent is the only process that exposes a port, and only to the plane’s address or the tailnet.
- CSRF on cookie mutations. CORS allow-list is the plane’s origin.
- A node can only act on workspaces placed on it.
- Secrets are write-only in the UI, as today.
- Dependency updates are in scope as maintenance, not as a feature.

### 9.2 Secrets

- Model keys, connector tokens, channel secrets, and backup passwords never go in the audit log, analytics, or support bundles.
- A support bundle, if added later, is an explicit export with a redaction list.
- The Composio project key exists only on the broker the operator runs, or in the node’s secret file if they chose the no-broker path.

### 9.3 Privacy

- Default: transcripts, attachments, and `SOUL.md` stay on the node.
- The plane’s database is metadata.
- Encrypted backup blobs, if the person turns them on, are ciphertext to the plane. The plane cannot search them.
- No telemetry in the default build. If telemetry is added, it is opt-in, listed, and aimed at a project the owner operates.
- Members can export and delete their account. Deleting the organization deletes plane metadata and instructs nodes to delete workspace data, with a typed confirmation.

### 9.4 Offline and degraded

- A node keeps running routines when the plane is unreachable. It queues heartbeats and audit rows and flushes them later.
- It does not accept new placements while it cannot authenticate to the plane.
- Connector and model failures are per run, with the existing routine run states, not a crash of the node.

### 9.5 Observability

- Node logs stay on the node. The plane shows health, last heartbeat, disk, and the last error string (one line, no secrets).
- Trace fields already on `UsageRow` (steps, tools, outcome) are the bot-run timeline.
- An audit log covers: sign-in, invite, role change, node pair and revoke, workspace create and move, connection create and delete, approval decision, backup, restore, billing change.

### 9.6 Approvals and audit

- A pending approval expires in 24 hours by default (workspace setting, 5 minutes to 7 days).
- Expiration is a deny for side effects.
- The audit row is written even when the node later fails to apply the decision, and a second row records the apply result.
- Guests and members cannot delete audit rows. Owners can export them. Retention default is 1 year on the plane.

### 9.7 Performance (targets, not benchmarks)

- Heartbeat ingest: a plane on a 2-core VM handles 100 nodes at a 15-second interval without dropping health.
- Queue page: under a second for 200 pending cards of metadata.
- These are design budgets so the schema stays append-only for audit and usage. They are not load-test results.

## 10. Pricing and packaging (proposal)

Self-hosting the plane and the nodes is free, in the Apache-2.0 build, with no phone-home and no feature lock. That is the product the homelab persona gets on day one.

Managed service, if the owner sells one, charges for **the plane and the managed nodes**, not for model tokens and not for Composio.

Suggested shape, inspired by the screenshot’s hours meter and by Coolify’s “we host the panel, you keep the servers” split. Numbers are placeholders for a decision, not a quote:

| Plan | For | Includes | Placeholder price |
| --- | --- | --- | --- |
| Self-host | Anyone | Full product, their machines | $0 |
| Hosted plane | A person who wants the website hosted | The plane, 3 nodes they attach, 2 workspaces | $20 / month |
| Pro | The screenshot’s “bots stay on” buyer | Hosted plane, 1 managed node, 360 capacity hours, extra hours billed | $49 / month |
| Team | Several members | Hosted plane, 3 managed nodes or attached nodes, more hours, admin role | $99 / month |

Hours are capacity hours of managed nodes, matching the meter people already saw (used / included). Attached nodes (the homelab) do not consume included hours. Overage on a managed node pauses non-pinned routines rather than silently continuing, unless the workspace allows overage.

Upstream’s fixture prices (Starter $15, Pro $49, Max $99, Team $199) are context, not Agents Hub’s price list. A $169 tier was not in this repository.

Annual billing, taxes, and the processor are a billing-spec decision. Cancel stops renewal and keeps data until the retention window ends.

## 11. Success metrics

| Metric | MVP signal | Later signal |
| --- | --- | --- |
| Homelab actually runs it | The owner’s hub is a node, routines fire while the laptop is off, WhatsApp inbound still arrives | A second person can install from the docs without the owner |
| One plane | All workspaces and nodes appear on Home | A managed-plane tenant does the same |
| Trust | Approvals from the phone match what the node does, and the audit row exists | No secret in a sampled audit export |
| Migration | An upstream backup restores, routines paused, bots chat | The owner has switched the updater off upstream |
| Learning | A repeated archive or trash becomes a rule, and the next matching mail does not ask | The person can read the rule in the ledger and revert it |
| Inbox | Morning Important is short, Other is summarized, replies are drafts | A week of decisions archives a known newsletter with no card |
| Isolation | A family member cannot open the admin’s direct chats | An agency client cannot see another client |
| Connector independence | Packaged build makes zero requests to the upstream broker | A workspace can be moved from Composio to Pipedream without recreating bots |

Vanity sign-up counts are not a goal for MVP.

## 12. Risks

| Risk | Why it matters | Mitigation |
| --- | --- | --- |
| Name collision with agentshub.ai and USPTO AGENTHUB (Reg. 7707945) | Commercial use can be challenged | [01-naming.md](01-naming.md). Lawyer before ads or a filing. Fallback name Assistants Hub. |
| Composio terms forbid resale | Billing customers for “included apps” would breach the vendor terms | Provider interface. Customer’s or operator’s own Composio project. Do not mark up connector seats. |
| WhatsApp unofficial client | A Baileys-style bridge can get the number limited | Dedicated number, allowlist, no bulk send, approval on outbound, keep the phone-sheet path, document the official Cloud API as P1. |
| Double execution | A failover that also leaves the old node running | Switch is fenced. Old primary is frozen before the new one enables routines. Same invariant as one-home. |
| Sticky WhatsApp vs failover | Session files cannot be copied live without a re-pair | Label the channel sticky. Failover skips it and says why. |
| Transcript leakage to the plane | A “helpful” sync would break the privacy principle | Metadata only, tested. Backup is ciphertext. The ledger stays on the node. |
| Ledger learns the wrong rule | One mis-click archives a person forever | Rules show their source decisions. Contradicting a rule writes a new decision and drops trust. Trash and send do not earn themselves quietly. |
| Inbox agent sends mail | An autopilot that sends is a different product | Drafts are free. Sends ask. Earned send is a workspace switch defaulting off. |
| Upstream phone-home left in the build | The fork would still be upstream’s client | Release checklist in the update spec. A test that fails the build if those hosts appear in packaged defaults. |
| `enterprise/` temptation | The license forbids shipping it | Directory stays deleted in the product build. Specs restate the features in new code. |
| Scope of “any runtime” (Hermes, OpenClaw) | A bus for every agent is a second product | MVP runtime is this fork’s harness. Other runtimes are P2 adapters on the same node contract. |
| Single-author bus factor | The owner is the first user and the builder | Specs and tickets are the handoff. The prototype is the UI contract. |

## 13. Non-goals

- Reusing or reimplementing `enterprise/` by copying it.
- Reselling model access, Composio, Boat, ElevenLabs, or Jev.
- A hosted multi-tenant execution fabric where strangers’ bots share a process.
- Active-active execution of one routine on two nodes.
- Replacing the chat app with a workflow canvas.
- A native phone app in MVP (the web app is the phone).
- Offline chat on the phone.
- Kubernetes as a required dependency.
- White-label of this product in MVP.
- Cryptocurrency, a token, or any use of the Maus name as the product.
- Bulk or unsolicited WhatsApp messaging.
- Storing WhatsApp sessions on the control plane.
- Storing the learning ledger, or raw mail, on the control plane.
- A global “autopilot on” switch that skips approvals for every sender.
- Earning permission to send mail from archive or label decisions.
- Replacing Gmail or Outlook with a full mail client in MVP. The inbox triages, drafts, and acts. The provider remains the mailbox.
- Supporting upstream Cloud accounts inside Agents Hub. Migration is a backup import, then the upstream account is someone else’s product.

## 14. Open decisions

Recorded with options and a recommendation in [08-discussion.md](08-discussion.md). The ones that block MVP build order:

1. Whether the first install embeds the plane in the node process or always runs it as a second container.
2. Whether MVP Slack is a Slack app or Composio-only.
3. The public hostname (`getagentshub.com` is free; `agents-hub.app` is registered and should be confirmed as yours or not).
4. Counsel’s read of the AGENTHUB registration before any paid launch.
