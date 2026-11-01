# Spec: routines and triggers

The scheduler in `server/routines.ts` stays. Agents Hub changes where a routine is allowed to run, and adds the inbox morning routine as a first-class one.

## Model

A routine keeps its current fields: prompt, target bot or room, schedule (cron, once, daily, interval), overlap `skip` or `queue`, checks, enabled. `runOn: "cloud"` is retired. The routine runs on the workspace primary, and only when that placement is unfrozen.

Webhooks stay `shared/webhooks.ts`. The public URL is the plane’s `/hooks/:id`, which forwards to the current primary. The sealing key stays on the node.

## Inbox routine

`inbox.morning` is a system routine the workspace can pause. It is not a free-form prompt. It runs the triage loop in [inbox-autopilot.md](inbox-autopilot.md). Overlap is `skip`. A missed run because the node was offline is `missed`, and the next run uses the same cursor.

## API

The plane lists routines from the node cache: id, name, enabled, next run, last status. Pause, resume, and run-once are work items. Creating a routine from chat still writes `routines.json` on the node. If the routine’s effect is a standing decision (“always archive these”), the main agent also writes the ledger. A schedule alone is not a decision.

## Unattended

A routine that hits an approval waits. It does not approve itself. That includes cleanup batches and sends.

## Non-goals

- Cron on the control plane. The node fires schedules. The plane only displays them.
