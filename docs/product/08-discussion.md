# Discussion

Open [discussion.html](discussion.html) for the review page: summary, mockups, diagrams, and the decisions below.

## Decisions to make

1. **Earned send.** Recommend it stays off. Archive trust can be earned. Permission to send is a separate owner switch, per sender, never inferred from edits or archives.
2. **Trust counts.** Recommend 3 consistent archives, 5 trashes (and archive trust already held), 2 labels. A reject resets that sender to ask.
3. **Where the ledger lives.** Recommend a private git repo on the primary node, mode 0700, no remote. The plane shows it and does not store it.
4. **Who writes.** Recommend one main agent. Other agents propose.
5. **Mail scope.** Recommend Gmail in MVP, Outlook in v1, the provider remaining the mailbox.
6. **Desktop What’s new.** Recommend three local slides and a hand-off to the website. No checkout in the Electron window. No upstream URL.
7. **Node-hours.** Recommend billing only managed nodes. Attached machines are metered for the chart and not charged. 360 is a placeholder cap, not a copy of upstream’s Admin number.
8. **First install.** Recommend the plane embedded on the hub. Split it out when a second node needs the plane elsewhere.
9. **Name and domain.** The name is Agents Hub. `getagentshub.com` was free on 1 Nov 2026. Confirm whether `agents-hub.app` is already yours. Ask counsel about USPTO AGENTHUB Reg. 7707945 before a paid launch. Assistants Hub is the fallback.
10. **License.** Stay Apache-2.0 outside `enterprise/`, and do not ship `enterprise/`.

## Not decided here

Counsel’s read of the AGENTHUB registration. The processor (Stripe is the proposal, Dodo is not). Whether a managed Agents Hub may use one Composio project before a vendor deal. That last one should be no for multi-tenant resale.
