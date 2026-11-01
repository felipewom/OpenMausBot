# Spec: bot runtime

Bots stay the fork’s bots. Agents Hub adds the workspace and the node they live on, and drops upstream’s included model and desktop credentials.

## What exists today

`WireBot` in `shared/wire.ts`: identity, `soul`, `modelSelection`, `computer`, `cloudBackend`, `approvalMode`, memory flag. Stored in `bots.json`. Transcripts in `messages.db`. Engines in `server/instance-fleets.ts` and `server/drivers/`. Computers: Boat cloud, box via `connector/`, VPS via SSH, local VM, this computer via Cua (`electron/cua.mjs`), browser.

`SOUL.md` in the bot folder mirrors `soul`. `soulHash` detects edits made outside the app.

## Model

```text
Bot
  id, workspaceId, nodeId          # nodeId denormalized from placement; a bot may pin
  name, title, description, soul, soulHash
  modelSelection: { instanceId, model, effort?, variant? }
  computer: "cloud" | "vm" | "local" | "browser" | "off"
  cloudBackend?: "box" | "docker" | "vps" | "boat"
  approvalMode
  memoryEnabled
  archivedAt?
```

`nodeId` defaults to the workspace primary. A pin (`bot.pinNodeId`) is P1 and is how one loud bot moves without the whole workspace. MVP moves the workspace.

## Engines

Unchanged contract: an instance in `config.json` with a driver, started by the harness, events normalized into the runtime stream.

Rules for Agents Hub:

- No trial Claude credit relay. `OMB_CLOUD_AI_*` is unset and the code path that reads it is not in the packaged build.
- No included Jev key. The decision model works if the person adds a key, as on a local install today.
- Keys remain in `config.json` on the node, mode `0600`, write-only in the UI.
- Custom ACP CLIs stay supported, so a person can point a bot at a local Hermes or another binary later without a new driver framework. A first-class Hermes adapter is P2, not a new runner.

## Computers

| `computer` | MVP behavior |
| --- | --- |
| `off` | Chat and connectors only |
| `local` | This node’s OS, with the existing one-shot `use_your_computer` consent on Mac and allowed Linux |
| `vm` | Local VM settings already in `server/local-vm-settings.ts` |
| `browser` | Electron or Chrome profiles on the node, if the node has a GUI. Headless nodes hide this option |
| `cloud` + `docker` | A container on the node, the connector’s job runner. Replaces “box” as the name in the UI |
| `cloud` + `vps` | SSH alias the person configured. Prefer registering that VPS as a node instead; keep the alias for compatibility |
| `cloud` + `boat` | Only if the person set a Boat API key. Never from an included env |

The UI copy says “Computer on Hub,” naming the node, not “Cloud computer” as a vendor.

## Chat

The existing UI (`src/`) is served by the node. The plane links to it:

- Embedded: same origin, path `/chat/:workspaceId`.
- Split: the plane opens the node’s tailnet or tunnel URL with a one-time handoff code (`POST /api/v1/workspaces/:id/open` → `{ url, code }`, 60 seconds, single use). The node redeems the code for a member session. This is the same idea as upstream’s “Open My Cloud,” without upstream’s session.

The plane does not proxy message bodies.

## Bot list API (on the node, called by the agent)

The node already has harness routes for bots. The agent exposes a summary for the plane cache:

`GET /agent/v1/workspaces/:id/bots` → `[{ id, name, title, model, computer, approvalMode, archived }]`

No `soul` text in this summary. The plane does not need the persona to render the list.

## Lifecycle

| Action | Effect |
| --- | --- |
| Create | Admin or member. Default approval `ask` on a workspace with more than one member, `full` on a personal single-member workspace. Matches the spirit of `setDefaultApprovalMode("ask")` for a company server. |
| Archive | Hidden from the sidebar, routines paused, files kept |
| Delete | Typed confirmation, deletes the bot folder and threads, audit row. Irreversible except via backup |

## Non-goals

- A new agent runtime.
- Sharing one bot process across nodes.
- Sending bot `soul` or transcripts to the plane for “search.”
