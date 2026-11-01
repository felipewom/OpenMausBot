# Specs

Functional and technical specs for Agents Hub. They assume the codebase map in [../00-research.md](../00-research.md) and the requirements in [../02-prd.md](../02-prd.md).

| Spec | Area |
| --- | --- |
| [control-plane.md](control-plane.md) | Organization, workspaces, the website’s API, what is stored |
| [node-agent-pairing.md](node-agent-pairing.md) | Installing a node on any machine and pairing it |
| [scheduling-failover.md](scheduling-failover.md) | Placement, moves, and what happens when a node is offline |
| [bot-runtime.md](bot-runtime.md) | Bots, engines, and computers on a node |
| [routines-triggers.md](routines-triggers.md) | Schedules, webhooks, proactive checks |
| [connectors.md](connectors.md) | Composio, Pipedream, Nango, MCP |
| [messaging-channels.md](messaging-channels.md) | WhatsApp bridge, phone sheet, Slack, email |
| [learning-ledger.md](learning-ledger.md) | Private git ledger the main agent writes and every agent reads |
| [inbox-autopilot.md](inbox-autopilot.md) | Split inbox, cleanup, drafts, reminders |
| [approvals-question-queue.md](approvals-question-queue.md) | The queue and how a decision is applied |
| [usage-metering.md](usage-metering.md) | Token ledger and capacity hours |
| [billing.md](billing.md) | Self-host versus managed plans |
| [team-rbac.md](team-rbac.md) | People, invites, roles |
| [phone-mobile.md](phone-mobile.md) | Pairing a phone |
| [backups-migration.md](backups-migration.md) | Backups and leaving upstream |
| [update-channel.md](update-channel.md) | The update feed and the upstream-host ban |

Conventions:

- Ids are ULIDs, prefixed in prose (`ws_`, `nd_`, `bot_`) so examples are readable. The prefix is part of the id.
- Times are ISO-8601 UTC.
- The control-plane API is HTTPS JSON under `/api/v1`. The node keeps today’s harness routes for chat and only adds the agent API under `/agent/v1`.
- “Plane” means the control plane. “Node” means the node agent plus the harness on that machine.
