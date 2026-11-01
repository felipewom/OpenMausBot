# Spec: usage metering

Two ledgers. Only one of them can become a bill, and only for managed nodes.

## What upstream does

`parseCloudUsage` (`electron/cloud-home.mjs`) accepts a snapshot the Admin already computed: `tier`, `resetsAt`, meters, upgrade targets. The kind that matches the screenshot is `computerHours`. The desktop calls it “Cloud desktop hours” and draws “{used} of {max} hours” plus “Resets on {date}.” (`src/lib/usage-meter.ts`, `CloudUsageMeter.tsx`). The file’s own comment says the meter is display only. The Admin enforces.

The screenshot’s site shows one pool, **128 of 360** Cloud compute hours, reset **1 Dec**, beside per-Cloud plans (Pro, Team, Starter) and “2 apps signed in.” Fixtures elsewhere use other caps (50, 200, 300, 800). 360 is not a constant in this repo.

Separately, the harness already appends `UsageRow` tokens to `usage/<YYYY-MM>.jsonl` (`server/usage-ledger.ts`): bot, model, tokens, `costUsd`, trigger. That is not the hour pool.

## Agents Hub ledgers

### Token ledger (on the node, not billed)

Keep `UsageRow` as it is. The node rolls it up and posts a summary to the plane once an hour and at heartbeat:

```json
{
  "workspaceId": "ws_design",
  "day": "2026-11-01",
  "bots": [{ "botId": "bot_chief", "model": "claude-opus", "input": 12000, "output": 800, "costUsd": null }]
}
```

`costUsd` stays null unless the node already estimated it. The UI labels any dollar figure “estimated from the provider,” never “due.”

### Node-hour ledger (the meter people see)

A **node-hour** is one hour a workspace’s primary placement was unfrozen on a node whose `kind` is `managed`. Attached nodes (`local`, `docker`, `vm` that the person installed) record hours for the chart and do not decrement an allowance.

```text
NodeHourSample
  workspaceId, nodeId, kind: "managed" | "attached"
  startedAt, endedAt          # a closed interval the node reports
  seconds

CapacityRollup
  workspaceId, periodStart, periodEnd
  managedSeconds, attachedSeconds
  includedSeconds?            # null on self-host
```

The node reports samples on heartbeat (the open interval since the last sample, plus any closed ones). The plane sums them. A sample that arrives twice is ignored (id is `nodeId + startedAt`).

Period: calendar month in the workspace timezone, default UTC. Reset copy matches upstream’s shape: “Resets on 1 Dec.”

Display, on Home, on the workspace, and on Billing:

| Install | What the meter says |
| --- | --- |
| Self-host, only attached nodes | “142 node-hours on your machines this month.” No bar with a max. |
| Managed allowance | “128 of 360 node-hours” and a bar. Near at 80%, full at 100%, same bands as `meterBand`. |
| Mixed | Two numbers: included managed hours, and attached hours labeled “your machines, not billed.” |

360 in the prototype is a **placeholder allowance** for a managed Pro-shaped plan, chosen so the meter is comparable to the screenshot. It is not a price promise. See [billing.md](billing.md).

## What consumes hours

| Activity | Managed node | Attached node |
| --- | --- | --- |
| Placement unfrozen, harness up | yes, wall clock | recorded, not billed |
| Node offline | no | no |
| Frozen during a move | no | no |
| Bot computer container on that node | included in the wall clock, not a second meter | same |
| Model tokens | never | never |
| Connector calls | counted separately, not in hours | same |

Upstream’s pool is “Cloud desktop hours” (computers). Agents Hub’s pool is “the managed machine was on.” A bot that chats all day and a bot that sleeps all day cost the same node-hours if the machine stays up. That is deliberate: it matches “bots keep working when the laptop is off,” which is a machine you leave running, not a per-token tax. A later plan can add a sleep-when-idle machine (`sleeps` exists on upstream allowances) so idle managed nodes stop the clock. P1.

## API

`GET /api/v1/usage?workspaceId=&from=&to=`

```json
{
  "period": { "start": "2026-11-01", "end": "2026-12-01" },
  "resetsAt": "2026-12-01T00:00:00Z",
  "managed": { "usedHours": 128, "includedHours": 360 },
  "attached": { "usedHours": 40 },
  "tokens": { "input": 1000000, "output": 80000 },
  "byWorkspace": []
}
```

`includedHours` is null when nothing is billed. The UI then hides the denominator.

Enforcement, managed only, P1: at 100% the plane marks the workspace `capped`. The managed node keeps the disk and the chats, and it pauses **new** routine starts. Chats the person sends still run. Overage is off unless the workspace sets `overage: "allow"`. There is no silent continue.

## Non-goals

- Billing tokens.
- Asking upstream’s Admin for a meter.
- Showing the meter inside a desktop modal that also takes payment.
