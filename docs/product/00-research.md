# Research

Discovery notes for **Agents Hub**, the product this fork should become. Nothing here changes the application. Sources are this repository at the time of writing (desktop version `0.1.134` in `package.json`), the upstream Cloud surfaces in the tree, the attached Cloud modal, and public pages linked below. Lookups were made on 1 November 2026.

Two private repositories named in the brief were not readable with this agent’s GitHub credential (`gh` returned 404): `felipewom/agent-labs-dashboard` and `felipewom/root-workspace` (branch `feat/architecture-diagrams-skill`). The agent-labs shape below is taken from the brief, not from that repo. The diagram skill was not fetched; the diagrams in [05-architecture](05-architecture/README.md) were drawn to the same AWS-style brief the skill exists to produce.

## 1. What this repository is

OpenMausBot is an Electron desktop app plus a loopback harness. The chat UI treats bots as contacts. Each bot is a real agent process (Claude, Codex, Grok, and other CLIs) with its own persona, model, computer, and connected apps. The README states the license, the local-first pitch, and that the project is not affiliated with xAI, Meta, OpenAI, or Manus.

```text
React (src/, Vite)  -- HTTP + one SSE -->  harness 127.0.0.1:8799 (server/)
                                              |  server/harness/registry.ts
                                              |  server/harness/bus.ts
                                              +--> claude / codex / grok / opencode / custom CLIs
phone or remote browser --> companion :8810 --> loopback harness only
Electron (electron/main.mjs) spawns the harness.
Data dir: OMB_DATA_DIR or ~/.openmausbot (legacy ~/.opengrokbot is renamed).
```

Ports called out in the README and companion docs: UI dev server `5199`, harness `8799`, companion `8810`. The managed Cloudflare tunnel, when used, lands on an Electron gateway at `127.0.0.1:8812`, not on the LAN listener.

The React app does not own transports. The harness owns every CLI, persists the data directory, and fans one event stream back.

### Top-level map

| Path | Role in Agents Hub |
| --- | --- |
| `electron/` | Desktop shell. Window, `openmausbot://` protocol, harness spawn, CUA and host screen, companion, Tailscale, cloudflared, the one-home move onto upstream Cloud, managed Composio, updater. |
| `server/` | Harness. Entry `server/openmausbot.ts` → `server/cli.ts`. HTTP and SSE in `server/index.ts`. Drivers in `server/drivers/`. Registry in `server/harness/`. |
| `src/` | React 19 chat UI. One server-backed store. |
| `shared/` | Wire types used by UI and server. This is the contract Agents Hub should extend, not replace, for bots, routines, approvals, backups, and pairing. |
| `companion/` | Sidecar on `:8810`. Pairing, device-token digests, route allowlist, Bonjour. It calls the harness on loopback and refuses to serve the desktop UI. |
| `connector/` | `mausbot-connector`. A Docker host agent: enroll, heartbeat, run jobs for cloud-box computers. Protocol in `connector/src/protocol.ts`. This is the closest thing in-tree to a node agent. |
| `cloudflare/control-plane/` | Account worker: Better Auth email OTP, installation ownership, one managed tunnel per installation, push, HighLevel OAuth. It does not store bots or chats. |
| `cloudflare/composio-broker/` | Hosted Composio broker. Project API key stays on the worker. Installations get a hashed bearer. |
| `deploy/` | Caddy, Compose, Fly (`deploy/fly/`), local, Podman. `docs/cloud-pro.md` describes the Cloud home image: one Fly app, one `home` machine, a volume at `/data`. |
| `apps/docs/` | Product docs site. |
| `enterprise/` | **Out of scope.** Proprietary license. Do not reuse, host, or white-label. Deleting the folder leaves the Apache-2.0 edition. The OSS server only loads it through `server/enterprise.ts` if the folder is present. |

## 2. Data on disk

Persistence is files plus Node’s built-in SQLite (`node:sqlite`), plus a per-bot DuckDB for the data surface. There is no app-wide database.

| Store | Path | What it holds |
| --- | --- | --- |
| Config | `config.json` | Credentials, engine instances, rooms, local VM, browser profiles, budgets. Mode `0600` on secret writes. Env can override keys at load (`server/config.ts`). |
| Bots | `bots.json` | Persona, model, tasks, approval, computer. `server/store.ts`. |
| Rooms | `groups.json` | Channels. Usage is computed, not stored on the group. |
| Routines | `routines.json` | `server/routines.ts`. |
| Webhooks | `webhooks.json` | `server/webhooks.ts`. Sealing key `webhook-key` is not in backups. |
| Transcripts | `messages.db` (WAL) | `messages`, `thread_state`, `chat_followups`, `command_receipts`, `notification_log`. Owner-only `0600`. |
| Events | `events/` | Per-thread NDJSON runtime log. |
| Usage | `usage/<YYYY-MM>.jsonl` | Append-only `UsageRow`s. No message text. `server/usage-ledger.ts`. |
| People | `team-people.json` | Email, role, seen and left. `server/team-people.ts`. Cap 500. |
| Bot folder | `bots/<id>/` | `SOUL.md` mirror, `data.duckdb` for the data engine. |
| Workspaces | `workspaces/`, `task-workspaces/` | Working trees. |

`WireBot` (`shared/wire.ts`) is the client-visible bot: `id`, `threadId`, `name`, `soul` (standing instructions, 24 KB budget in `shared/bot-profile.ts`), `modelSelection` (`instanceId`, `model`, optional effort and variant), `computer` (`cloud | vm | local | browser | off`), `cloudBackend` (`box | vps`, absent means the Boat cloud desktop), `approvalMode`.

`Surface` is where the bot works. Approval modes (`shared/approval-mode.ts`) are `ask`, `edits`, `auto`, `full`, `custom`. Default is `full` unless a company server sets `ask`. Host-computer use is outside that scale: the first touch is a one-shot card, tool name `use_your_computer` (`shared/your-computer.ts`). “Always allow” is never offered for that.

Rooms (`WireGroup`) have members, a default responder, a bulletin, a working folder, and tasks. `dm: true` is an auto bot-to-bot channel.

Engines: `server/instance-fleets.ts` ships a default fleet (Grok, Kimi, Droid, Cursor, Copilot, Claude, Codex, ChatGPT-plan Codex, Antigravity, OpenCode, OpenAI-compatible, Mistral, Cerebras, plus API-key providers). A custom CLI is driver `customAcp` in `config.json`. Agents Hub should keep bring-your-own engines. The product does not resell model tokens.

## 3. Routines, questions, approvals

Routines live in `shared/routines.ts` and `server/routines.ts`.

A schedule is cron, a limit-reset, once, daily (time and weekdays), or an interval with an anchor, optional weekdays, a window, and an end. A routine has a prompt, a target (`bot` or `room-goal`), a bot, an optional room, `runOn` of `maus` (this computer) or `cloud`, enabled, overlap `skip` or `queue`, and optional checks (`calendar`, `mail`, `runs`) so a proactive routine can skip the model when nothing is new.

Run triggers: `schedule`, `manual`, `webhook`, `startup`. Run states include queued, running, waiting, completed, failed, cancelled, missed.

Webhooks (`shared/webhooks.ts`) are a separate trigger with an endpoint id, prompt, bot, and a cap on pending runs.

Provider questions (`AskUserQuestion`) become transcript cards (`shared/ask-question.ts`): at most 6 questions, 12 options, 8000 characters. Today’s inbox reads unanswered approval and question cards from `messages.db` (`server/today.ts`). There is no separate queue service. Team Cloud has a different `Question` type in `server/host/representative.ts` (an assistant answering a teammate from shared facts only).

Unattended routine approvals are denied or held. The companion exposes only a narrow set of approval verbs.

Agents Hub’s “question queue” should be this card inbox, lifted to the control plane so a phone can answer it while the node keeps running. It should not invent a second permission model.

## 4. Remote access, phone, Tailscale

The harness binds loopback and rejects a non-loopback `Host`. Pairing links are `openmausbot://pair` (`shared/pairing-link.ts`). Endpoint kinds: `hosted`, `tailnet`, `lan`, `bonjour`. The link carries a high-entropy one-time token, with a six-digit fallback, two minutes, single use. Device tokens are stored as SHA-256 digests.

The phone web app (`docs/phone-web-app.md`) is the same React UI on the home screen over HTTPS (hosted link, Tailscale HTTPS, or your own proxy). It has no offline chat, no push in that doc’s description of the web app, and no native phone computer control. The control plane worker can register push separately.

Tailscale is the recommended direct remote path: WireGuard, so companion HTTP is still encrypted. Desktop-to-desktop is `docs/desktop-companion.md`.

`connector/` is the cloud-box host agent. It enrolls with a code, heartbeats, reports Docker and disk, runs jobs, and can self-update. That enroll/heartbeat/job loop is the seed of the Agents Hub node agent. It is not yet a general “any server joins the control plane” agent: it exists to host bot computers for the upstream box path.

## 5. Bot computers

| Kind | Where it lives | Notes for Agents Hub |
| --- | --- | --- |
| Boat cloud desktop | Default when `cloudBackend` is absent. `shared/cloud-computer.ts`. | Upstream includes Boat on a paid Cloud via `OMB_CLOUD_BOAT_*` (`server/included-services.ts`). A fork must not depend on that inclusion. The person can still bring a Boat key. |
| Box | `cloudBackend: "box"` through `connector/`. | Becomes “a node that can spawn isolated computers.” |
| VPS | SSH alias, `config.vps` or per-bot `vpsAlias`. | Becomes a node the person already has, not a hidden SSH special case. |
| Local VM | `config.localVm`: shared, per-bot, or pool. | Stays a computer *on* a node. |
| This computer | `electron/cua.mjs`, Cua driver. macOS; Ubuntu Xorg after opt-in; Wayland host control disabled. | Consent stays per turn. |
| Browser | Electron partitions, or “My Chrome.” | Unchanged. |

## 6. Backups and the one-home move

Workspace backup (`shared/workspace-backup.ts`, `server/workspace-backup.ts`): encrypted `.ombbackup`, format `openmaus.workspace-backup` version 1, password at least 12 characters, SQLite snapshot, caps 10 GB and 100k entries. Secrets, CLI homes, provider state, and several credential files stay out (`server/workspace-backup-policy.ts`). Imported routines and webhooks start paused. A safety copy lands in `.openmausbot/.backups/`.

Team backup (`shared/team-backup.ts`) is a shareable department file, max 50 MB: profiles, instructions, rooms, playbooks, routines, memory, conversation text. No files, avatars, connections, models, or permissions.

The one-home move (`electron/one-home.mjs`, `electron/cloud-send.mjs`) copies this computer onto upstream “My Cloud” and then freezes the computer so nothing runs in two places. Journal phases: copy, wait (quiet period), freeze, final copy, check, switch, done. After the switch, home is My Cloud, this computer lends its project folders, and its phone link stops. A later choice can bring bots back while My Cloud continues, or bring them home if the Cloud ends. Agents Hub replaces this with an explicit **move bots to a node**, which the person can reverse, and which can target a homelab or a second server, not only one hosted machine.

## 7. Org, people, usage, billing in the fork

Team Cloud (`server/cloud-team.ts`, `docs/team-cloud.md`): one cloud machine, several people. Roles `owner | admin | member` (UI: Super admin, Admin, User). The roster the machine has seen is `team-people.json` (`email`, `role`, `firstSeenAt`, `lastSeenAt`, `leftAt`). The machine does not read a company directory.

A personal Cloud home (`server/cloud-owner.ts`, `docs/cloud-pro.md`) is stricter: only the owner’s devices, admin sessions, no email sign-in, no People invites. Routines without proof they are the owner’s run confined. That fail-closed owner proof is worth keeping when a workspace is marked personal.

Usage (`UsageRow`): time, bot, thread, instance, driver, model, token counts, `costUsd`, trigger (`user | owner | routine | bot | helper`), plus trace fields (steps, tools, outcome). Grouping: bot, model, user, day, engine, routine. This is local bookkeeping. It is not a payment system.

`server/plan-usage.ts` reads Claude, Codex, and Grok subscription remaining percent from local CLI homes. That is the person’s model plan, not Agents Hub billing.

`config.budgets` (for example `monthlyUsd`) is shaped in OSS and enforced behind the enterprise hook. Do not copy that enforcement from `enterprise/`.

Whop in this repo is a connected app, not the billing system.

## 8. Upstream Cloud, as the screenshot and the code show it

### 8.1 The in-app “What’s new” modal

The offer is not only a website. It is a modal on top of the desktop bot list. The attached screenshot shows a multi-page carousel:

- Scrim over the chat app. The sidebar (bots) stays visible behind it.
- Page content: a picture of the Cloud website, then the kicker “WHAT’S NEW”.
- Headline: “Meet the new MausBot Cloud”.
- Body: “Your bots keep working when this computer is off. The new Cloud website puts your Clouds, team, billing and usage in one place.”
- Buttons: **Get Pro** (filled) and **See the new Cloud** (opens the site).
- Price line: **Pro · $49/month + tax**.
- Footer: **Not now**, a page dot (two dots, so at least two pages), and **Next**.

The website drawn inside that modal is `cloud.openmausbot.com`. It is a per-Cloud control panel, not one meter for the whole account only:

| Cloud in the picture | Plan chip | Status | Renews |
| --- | --- | --- | --- |
| My Cloud | Pro | Running | a date in the table |
| Design Studio | Team | Running | a date |
| Family | Starter | Running | a date |

The same page shows **Usage: 128 of 360 hours**, labeled in the owner’s reading as Cloud compute hours, resetting **1 Dec**, and **Apps and phone: 2 apps signed in**, with Set up. Each Cloud card has Open. The table repeats Cloud, Plan, Status, Renews.

That website is **not implemented in this repository**. `docs/cloud-pro.md` says the Admin is another repo (`openmaus-cloud`). This tree is the desktop client, the home-machine image, and the Cloudflare workers. Design Studio and Family are clouds in the client’s list, not pages of code here.

The carousel’s exact strings (“Meet the new MausBot Cloud”, “Get Pro”, “See the new Cloud”) are **not in this checkout’s locale files**. The in-app Cloud upsell this tree does ship, which is the piece to remove, is a single modal rather than that two-dot carousel:

| Piece | Role |
| --- | --- |
| `src/components/CloudProPopup.tsx` | Full-screen modal (`role="dialog"`, scrim, `data-cloud-pro-popup`). Title key `cloudProPopup.title` is “MausBot Cloud Pro”. Body reuses `cloudIntro.body` (“MausBot Cloud runs your bots for you in the cloud, always on.”). Primary button, optional “Compare plans”, **Not now**. |
| `src/components/AppNotices.tsx` | Decides when the popup is due. Notice id `cloud-pro-update-2026-10` (`CLOUD_PRO_UPDATE_NOTICE` in `src/lib/notices.ts`). It waits until the first-run welcome is not the current launch, and it is skipped while a move is in progress. Source string passed to analytics is `update_popup`. Event `cloud_pro_popup`. |
| `src/components/CloudTrialIntro.tsx` | Corner card, not the modal. Notice `cloud-trial-intro-v1`. “Start free trial” / “Show me how” / Not now. |
| `src/components/ProIntroduction.tsx` | Settings row that sells the same plan. |
| `src/components/UpdateIndicator.tsx` | A different “What’s new” block (`update.card.whatsNew`) on the **updater** card. Release-note highlights only. Not the Cloud carousel, but it is the pattern of a post-update sheet over the app. |
| `src/components/cloud-buy/` | `AddCloudFlow`, `ChooseScreen`: the plan picker the popup opens. Checkout leaves the app for `checkout.dodopayments.com`. |

Agents Hub replaces this whole notice, not by restyling `CloudProPopup`. The desktop may show its own What’s new carousel. That carousel never calls `cloud.openmausbot.com`, never says Get Pro against upstream’s price, and hands off to the person’s Agents Hub site. See [04-flows/whats-new.md](04-flows/whats-new.md).

### 8.2 Per-Cloud plans and the compute-hours meter

Plans are **per Cloud**, not one plan for the person. The screenshot’s three Clouds are on Pro, Team, and Starter at the same time. Each has its own status and renew date.

The client does not hardcode prices. `electron/cloud-home.mjs` `offerPlan` requires USD, interval `month`, amount in cents from 1 to 10,000,000. Tiers it will parse include `starter`, `personal`, `pro`, `max`. `personal` is in `NOT_SOLD` (kept for old subscribers, not offered to new buyers in this app). Team is a separate path (`electron/cloud-team-plan.mjs`, and `TEAM_TIERS` of `team` and `business` in `src/lib/usage-meter.ts`). Tests in `src/lib/cloud-plan.test.ts` fixture Starter $15, Pro $49, Max $99, Team $199. The modal’s visible line is **Pro · $49/month + tax**. A $169 tier was **not** found in this repository.

Allowances ride on the offer (`planAllowances` in `electron/cloud-home.mjs`): `cpus`, `cpuKind` (`shared` or `performance`), `memoryMb`, `diskGb`, `maxDiskGb`, `computers`, **`computerHours`**, `voiceCharacters`, optional `sleeps`, `swapMb`, `snapshotDays`. A test helper sets `computerHours` to `computers * 50` (so 50 or 200 in those fixtures). The usage preview in `src/usage-meter-preview.tsx` uses other caps (about 30, 100, 300, and 800 hours). The screenshot’s **360** is what the Admin sent for that account, not a constant in the app.

Usage is a snapshot the Admin computes. `parseCloudUsage` keeps `tier`, `resetsAt`, optional `trialEndsAt`, up to 20 meters, and up to 10 upgrade targets. Meter kinds (`CLOUD_USAGE_KINDS`): `computerHours`, `voice`, `decisions`, `x`, `research`, `storage`. The desktop label for `computerHours` is “Cloud desktop hours” (`usageMeter.kind.computerHours`), rendered as “{used} of {max} hours”, with “Resets on {date}.” The screenshot’s site says the same shape in compute-hours words: **128 of 360**, reset **1 Dec**.

`src/lib/usage-meter.ts` says the meter is **display only**. It does not grant or limit anything. Bands are ok, near (80%), and full. A card appears when a meter is near or full (`CloudUsageMeter.tsx`). Upgrade preview and confirm go through `window.ogb.cloudPlan` (`upgradePreview`, `upgrade`). The comment on `parseCloudUsage` says spent and metered only by the Admin. Room limits (`parseCloudRoom`) are memory wait or disk cap, and the upgrade they offer is also display until the Admin accepts it.

So the model to learn, and not to copy as a vendor lock, is:

1. Several Clouds, each with a plan, a renew date, and a Running / other status.
2. A monthly pool of **computer hours** (the site’s “Cloud compute hours”), used/included, reset on a date.
3. The desktop shows the meter and can start an upgrade. The Admin enforces the pool.
4. Apps and a phone are counted beside the hours (“2 apps signed in”), not inside the hour pool.

Agents Hub’s meter is **node-hours**, defined in [03-specs/usage-metering.md](03-specs/usage-metering.md). Homelab and other attached nodes are shown and are not billed. Managed nodes consume the included pool. The desktop does not checkout.

What the desktop does implement:

| Surface | File | Behavior |
| --- | --- | --- |
| Trial intro | `src/components/CloudTrialIntro.tsx` | First-run card. |
| Pro popup | `src/components/CloudProPopup.tsx` | Post-update upgrade prompt. |
| Add a Cloud | `src/components/CloudAddDialog.tsx` | Plan picker. Checkout is handed to `checkout.dodopayments.com`. The app does not charge the card. |
| Setup | `src/components/CloudSetup.tsx` | Name, colour, open the new cloud. |
| First job | `src/components/CloudIntent.tsx` | “What should your Cloud do while you’re away?” |
| Account card | `src/components/CloudAccountSettings.tsx` | Plan, machine, trial, phone, files, cancel, keep-bots-here. |
| Usage | `src/components/CloudUsageMeter.tsx` | Meters and upgrade. |
| Move strip | `src/components/CloudSendStrip.tsx` | One-home progress. |
| Engine sign-in | `src/components/CloudEngineSignIn.tsx` | Cloud includes no AI. The person signs in Claude, ChatGPT, or Grok, or pastes a key. |

Prices are not hardcoded. `electron/cloud-home.mjs` parses an Admin offer (USD monthly cents). Tests in `src/lib/cloud-plan.test.ts` fixture Starter $15, Pro $49, Max $99, Team $199, and hour allowances on the order of 100 / 300 / 800. The screenshot’s visible price is **Pro $49/month + tax**, and its usage card shows **128 of 360 hours**. A $169 tier was **not** found in this repository. If the Cloud marketing site shows one, it lives in the Admin repo, which is not here. Tiers the client will upgrade: `starter`, `personal`, `pro`, `max`.

`CLOUD_ORIGIN` is `https://cloud.openmausbot.com` (`electron/cloud-account.mjs`). Staging is `https://omb-cloud-staging.fly.dev` only when `OMB_CLOUD_STAGING=1`. Device tokens look like `omc_` plus 43 characters. Sign-in is a device code: authorize, poll for a token, session get and delete.

`docs/cloud-pro.md` is the contract, version 1. One Fly app, one always-on (or sleep-capable) `home` machine, volume at `/data`, TLS at `https://<app>.fly.dev`. The desktop, the phone, and the web are windows onto it. Included services injected into the child env and never written to `config.json` (`server/included-services.ts`):

| Env prefix | Service |
| --- | --- |
| `OMB_CLOUD_BOAT_*` | Boat desktops (`https://boat.dev/api/v1`) |
| `OMB_CLOUD_VOICE_*` | ElevenLabs |
| `OMB_CLOUD_DECIDER_*` | Jev decision model |
| `OMB_CLOUD_AI_*` | Trial Claude credit (`omb_ai_` token) |
| `OMB_CLOUD_X_*` | X research relay |

A person’s own key wins over an included one.

### Paid and cloud parts a fork replaces or turns off

| Piece | Where | Replacement in Agents Hub |
| --- | --- | --- |
| What’s new / Cloud Pro modal | `src/components/CloudProPopup.tsx`, notice `cloud-pro-update-2026-10` in `src/lib/notices.ts`, queued by `src/components/AppNotices.tsx`. The screenshot’s two-page carousel (Get Pro, See the new Cloud, Pro · $49/month + tax) is this surface even where the strings differ. | Agents Hub’s own carousel. It hands off to the web hub. It does not open `cloud.openmausbot.com` or Dodo. |
| Trial intro and settings upsell | `CloudTrialIntro.tsx`, `ProIntroduction.tsx`, `src/components/cloud-buy/` | Unmounted. Plan choice lives on the web Billing page. |
| Usage meter UI | `CloudUsageMeter.tsx`, `src/lib/usage-meter.ts`, `parseCloudUsage` in `electron/cloud-home.mjs` | Reimplemented against Agents Hub node-hours. Do not call the Admin for meters. |
| Cloud UI | `src/components/Cloud*.tsx` and the cloud libs under `src/lib/cloud-*` | Agents Hub web app. Do not skin upstream’s checkout. |
| Cloud account client | `electron/cloud-account.mjs` and the other `electron/cloud-*.mjs` clients | Control-plane client aimed at the person’s plane. |
| One-home onto My Cloud | `electron/one-home.mjs`, `electron/cloud-send.mjs` | Move between the person’s nodes. |
| `accounts.openmausbot.com` | `electron/companion-account-service.mjs` default. Packaged builds use it unless `OMB_CONTROL_PLANE_URL` is set. Unpackaged builds leave it empty. | The person’s control plane, or no hosted account. |
| HighLevel relay | `server/highlevel/relay.ts`, default URL that host. `OMB_HIGHLEVEL_RELAY_URL=off` disables it. Client secret stays on upstream’s worker. | Omit, or a broker the person runs. HighLevel tools in this tree do not send SMS, email, or WhatsApp. |
| Composio broker | Packaged default in `electron/managed-composio.mjs`: `https://openmausbot-composio.milindsoni201.workers.dev`. `OMB_COMPOSIO_BROKER_URL` overrides. | The person’s worker and Composio project. See connectors below. |
| PostHog | `src/lib/analytics.ts`. Host `https://us.i.posthog.com`. A public write-only key. Opt-out key `omb-analytics-opt-out`, default on. Autocapture is off. | Remove or point at a project the person owns. A fork that ships the binary unchanged still reports upstream. |
| Updater | `electron/updater.mjs`, feed in `electron-builder.yml`: GitHub `milind-soni/OpenMausBot`, `latest.yml` / `latest-mac.yml`. `autoDownload = false`. | The person’s release feed. A Windows install with no `latest.yml` gets stranded, which is why the feed must exist before the updater is pointed anywhere. |
| Included Boat, voice, Jev, trial AI, X | `server/included-services.ts` | Off unless the person configures their own keys. |
| Dodo checkout | Allow-listed `checkout.dodopayments.com` | Not used. Managed billing, if any, is a later Stripe (or equivalent) account the person owns. |
| `enterprise/` | Separate license | Do not ship. |

`SetupOffer` (`src/components/SetupOffer.tsx`) is the new-bot setup card, not a billing offer. `TrialCreditNotice` is the trial Claude credit running out. Both can stay as local behaviors; the credit relay cannot.

Local OpenMausBot with those URLs unset already runs without a Cloud plan. Packaged builds turn the defaults on. Agents Hub’s packaged build must not.

## 9. Composio, and why the connector is an interface

`cloudflare/composio-broker/README.md`: the worker holds the project key. Each installation gets a random bearer stored as a SHA-256 hash. Sessions are Composio Tool Router sessions (`server/composio-session.ts`): one `user_id`, at most 5 accounts per toolkit. OAuth is a short-lived Connect Link, not stored in chat. Desktop and Cloud share apps by a 10-minute one-time code (`POST /v1/installation/share` and `adopt`). Triggers: Composio webhook into a D1 queue, desktop long-poll `GET /v1/events`. Caps in that README: 500 events/day on desktop, 2,000 on a paid Cloud.

A saved project key (`ak_…`) wins over the broker (`docs/composio.md`). Forks are told to deploy their own worker, D1, and `OMB_COMPOSIO_BROKER_URL`.

Composio’s terms ([composio.dev/terms](https://composio.dev/terms), section 3, fetched 1 November 2026) grant a limited, non-transferable license for personal and commercial use of the platform, and then say that license **does not include any resale or commercial use of the platform or its contents, or any derivative use of the platform or its contents**. Connected accounts are private to a `user_id` unless explicitly shared ([docs](https://docs.composio.dev/docs/extending-sessions/shared-connections)). Agents Hub can use Composio as the operator’s own tool, on the operator’s own project, for the operator’s own users. It cannot resell Composio access as the product. That is why the spec has a provider interface with Pipedream Connect and Nango as fallbacks, and why a self-hoster can also bring a raw MCP server and skip all three.

Gmail and Slack “feeds” in this app are Composio triggers (new mail, channel message), not a separate mail daemon.

## 10. WhatsApp, Slack, email

**WhatsApp is not a daemon in this repository.** Bots reach WhatsApp only by preparing a message that opens a sheet on a paired phone and sends when the person taps Send (`server/phones/tools.ts`, `PHONE_SEND_WHATSAPP`). An inbox capability string such as `whatsapp:Family` in tests is a phone registration label, not a server inbox. HighLevel’s tools refuse to send WhatsApp.

The owner’s homelab already runs a WhatsApp bridge daemon, and keeping that access working is a requirement. Hermes Agent documents the same shape publicly: a Baileys bridge that emulates WhatsApp Web, with an explicit ban warning, a dedicated number, and no bulk outbound ([Hermes WhatsApp guide](https://github.com/NousResearch/hermes-agent/blob/main/website/docs/user-guide/messaging/whatsapp.md)), plus an official WhatsApp Business Cloud API path for a real business number. Agents Hub should treat the bridge as a **channel adapter the operator already runs**, sticky to the node that holds the session, with an allowlist and with outbound sends passing the approval queue. It should not be designed as a bulk sender. The phone sheet remains the path that does not link a WhatsApp Web session.

**Slack.** Hosted Slack management (`server/hosted-slack.ts`) only returns an admin URL when enterprise hosted-workspace config is present. Do not reuse that. Ordinary Slack is a Composio connection, or a Slack app token on a channel adapter (the Hermes gateway model: one process, many platforms, an allowlist).

**Email.** There is no first-party inbox bridge. Gmail is Composio. Cloud sign-in email OTP belongs to upstream’s control plane. Agents Hub mail is a connector trigger plus, later, an optional IMAP or forwarding adapter on a node.

## 11. License, and what a commercial or open-source product may do

The repository `LICENSE` is Apache License 2.0. `package.json` says the same. `enterprise/LICENSE` is not Apache: source-available, evaluation is free, production needs a key from the copyright holder, and redistribution, sublicensing, selling, hosting for third parties, and white-labeling are forbidden without a written partner agreement. The license text says the rest of the repository builds and runs if that directory is deleted.

Apache-2.0, applied to everything outside `enterprise/`, allows Agents Hub to:

- use, modify, and distribute the work, including as a commercial product and as a hosted service;
- relicense **new** files under different terms, as long as the Apache conditions are still met for the upstream work;
- keep a fork open source under Apache-2.0, which is the simplest path and the one this discovery assumes.

It requires Agents Hub to:

- ship a copy of the Apache license with redistributions;
- mark modified files;
- keep copyright, patent, trademark, and attribution notices, and any `NOTICE` contents that apply;
- accept the patent-termination clause if the project sues over the work.

It does **not** grant the names OpenMausBot, MausBot, Maus, or the upstream logo (section 6), except to describe origin. Agents Hub is the product name. Attribution in an about box and in `NOTICE` is the right use of the upstream name.

Do not copy `enterprise/` into the product, do not disable a license check in order to ship those features, and do not look to that folder for RBAC, budgets, or hosted Slack. Rebuild the small set of those ideas that Agents Hub needs, in this product’s own code, from the specs.

Third-party notices under `third_party/` stay with their own licenses (Cua, browser bundles, model lists, and others). A release checklist has to include them.

This is not legal advice. The Apache grant is broad; the trademark grant is narrow; the enterprise folder is a different license; Composio’s terms forbid resale of that platform.

## 12. The owner’s existing world

The product has to fit a homelab the owner already runs, described in the brief and visible as the desktop behind the Cloud modal:

- A hub machine in the Mac mini class, plus laptops.
- A Tailscale tailnet.
- A WhatsApp bridge daemon that must keep working.
- On the order of 13 worker bots, routines, and a question queue.
- Email and Slack feeds.
- The desktop app the modal is covering, which is today’s OpenMausBot client.

Agents Hub’s first success is that this hub is a node, the laptop is another node, WhatsApp stays on the hub, and one website shows all of it. Managed cloud is an additional node provider, not a requirement.

The earlier agent-labs vision, from the brief (the dashboard repo was not readable here): one dashboard, a shared message bus, approvals, an audit trail, and agents such as Hermes, OpenClaw, Codex, and WhatsApp connected to that bus. Agents Hub is that dashboard, with this fork’s bot runtime as the first agent runtime on the bus, and with other runtimes as later adapters. The difference from both upstream Cloud and from agent-labs as a single bus is that execution can sit on many nodes at once, including ones the person owns.

## 13. What to borrow

Each row is a public product and one behavior worth taking. Agents Hub does not wrap these products. Prices below are from the linked pages or from secondary writeups dated 2026; confirm them before they appear on a pricing page.

| Product | Link | Borrow | Leave |
| --- | --- | --- | --- |
| MausBot Cloud (upstream) | This repo, `docs/cloud-pro.md`; modal in the brief | The noun “a Cloud” as a workspace with a plan, a status, a renew date, usage hours, apps, and phone pairing. The one-home idea that a laptop is not the only place bots run. Personal-cloud owner proof. | Single hosted machine as the only always-on place. Dodo checkout, included Boat/Jev/trial model, PostHog, their account host, their updater, `enterprise/`. |
| Rakazo (Elie, Inbox Zero) | [github.com/elie222/rakazo](https://github.com/elie222/rakazo), [rakazo.com/docs/self-host](https://rakazo.com/docs/self-host/) | Apache-2.0 self-host that is a real server (API, worker, Postgres), not a static site. Bring-your-own model. Computers as providers: Docker, E2B, Daytona, Boat, Railway, trusted local. Composio **or** Pipedream, plus MCP and OpenAPI. Team computers vs private computers. Routines as readable text. An audit log. One installer that writes a `.env` and starts Compose. | Their Pi runtime and Prisma schema. Agents Hub already has a harness and a file/SQLite data dir; do not rewrite bots onto Rakazo. |
| OpenClaw | [Migration notes in Hermes](https://github.com/NousResearch/hermes-agent/blob/main/website/docs/guides/migrate-from-openclaw.md) | Channel config as data: a token plus an allowlist per platform, including WhatsApp `allowFrom`. A documented import path so a person is not stuck. | Treating a gateway rewrite as the MVP. Import of OpenClaw is a later adapter, not the core. |
| Hermes Agent | [NousResearch/hermes-agent](https://github.com/NousResearch/hermes-agent) | One messaging gateway process with many adapters and a toolset per platform. WhatsApp as an explicit adapter with a dedicated number, an allowlist, and a documented official Cloud API alternative. Cron inside the same gateway that holds the channels. | Running Hermes as the only brain. Codex and Claude CLIs stay first-class. |
| n8n | [n8n.io](https://n8n.io/) | Execution log, credential isolation per connection, queue mode when there is more than one worker, error workflows. | A node canvas as the primary UI. Bots stay chats. A routine may later call an n8n webhook; it is not the editor. |
| Coolify | [coolify.io/compare/coolify-vs-dokploy](https://coolify.io/compare/coolify-vs-dokploy) | A self-hosted control panel that deploys to servers you attach over SSH. Cloud plan hosts the panel only; apps stay on your servers. Apache-2.0. Server as the unit you add. | Becoming a general PaaS. Agents Hub schedules bots and routines, not arbitrary Docker apps, in the MVP. |
| Dokploy | Same comparison | Members with permissions on the free edition; Swarm as one way to spread work; the discipline of keeping a proprietary folder out of the open build (Dokploy’s `/proprietary` is a warning, not a pattern to copy). | Their source-available enterprise features. |
| Tailscale | [tailscale.com](https://tailscale.com/) | Identity-aware reachability, MagicDNS, tags, ACLs, HTTPS certs. Already the fork’s recommended remote path. A node joined to the tailnet is addressable without a public port. | Replacing Tailscale with a homemade VPN. |
| Fly.io machines | [fly.io](https://fly.io/), and `deploy/fly/` in this repo | One machine plus a volume is a good **managed node** shape, because upstream already runs a Cloud home that way. Private networking. | One Fly app as the only topology. |
| Railway | [railway.com](https://railway.com/) | A node target with a volume and a private network, for people who do not want to run Docker themselves. | Credit-shutdown as a silent failure. If a managed node’s credit ends, the control plane must show it and fail over or pause, not drop work. |
| Lindy | [lindy.ai](https://www.lindy.ai/) | Plain-language “while you’re away” jobs, which upstream already asks as the first Cloud job. Phone and mail as the surfaces people actually check. | No-code as the only interface. No self-host. |
| Relevance AI | [relevanceai.com](https://relevanceai.com/) | A workforce view: agents with roles, tools, and a run history an operator can open. | Credit-metered, cloud-only tooling as the product. |
| CrewAI | [crewai.com](https://www.crewai.com/) | Roles on a team, delegation, a studio for the team. Open-source core with a paid control plane. | Requiring their process model. Bot-to-bot rooms already exist here (`WireGroup` DMs and channels). |
| Letta | [letta.com](https://www.letta.com/) | Memory as state that survives the process, with the person able to see and edit it. This fork already has `memoryEnabled` and `SOUL.md`. | Adopting their server as the runtime. |
| LangGraph Platform / LangSmith | [langchain.com/pricing](https://www.langchain.com/pricing) | The deployment matrix on their pricing page is the picture to copy in words: Cloud, Hybrid (their control plane, your data plane), Self-hosted. Durable runs, human approval, traces. | Their graph runtime, and gating self-host behind an enterprise contract. Agents Hub’s self-host path is the default, not the upsell. |
| Cursor background agents | [cursor.com](https://cursor.com/) | An isolated machine per task, a transcript of tool calls, a result that comes back as a reviewable change. | A single vendor cloud as the only place work runs. |
| Pipedream Connect | [pipedream.com/connect](https://pipedream.com/connect) | The second connector provider behind the same interface, so Composio is not a single point of failure or a resale problem. Rakazo already treats it as a peer of Composio. | Building on Pipedream alone. |
| Nango | [nango.dev](https://nango.dev/) | Self-hostable OAuth and token refresh. The right fallback when the person refuses a hosted connector vendor. | Using Nango’s cloud as a silent default. |

## 14. Implications for the specs

1. The control plane is new. The harness, bots, routines, approvals, backups, and pairing stay and grow.
2. A **workspace** is what upstream calls a Cloud (Home, Design Studio, Family): bots, routines, connections, channels, usage. It is placed on one or more **nodes**.
3. A **node** is a generalized connector plus harness: Mac, Linux, Docker, a VM, a homelab, or a managed machine. It pairs once, heartbeats, and runs the jobs it is assigned.
4. MVP placement is **pinned**: a workspace has a primary node. Moving bots is explicit. Automatic failover of movable routines is v1. WhatsApp does not fail over onto a node that lacks the session.
5. The first node may **be** the control plane (all-local). A separate plane is what you add when a second node joins.
6. Connectors are an interface. Composio on the person’s project is the default implementation. Pipedream and Nango are the others. MCP without a vendor is allowed.
7. Channels are an interface. The existing phone WhatsApp sheet stays. The homelab bridge is the first real inbound adapter and is sticky to its node.
8. Usage hours in the screenshot are a per-account compute-hour pool (`computerHours` in the client, “Cloud desktop hours” in the desktop copy, “Cloud compute hours” on the site), reset monthly, enforced by the Admin. Each Cloud also has its own plan. Agents Hub shows both the token ledger and **node-hours**. Only managed nodes draw down an included pool. The desktop What’s new carousel explains that and hands off to the website. It does not sell inside the Electron window.
9. Upstream account, analytics, relay, checkout, and updater hosts are removed from the packaged build before any Agents Hub release.
10. `enterprise/` is not a feature source.
