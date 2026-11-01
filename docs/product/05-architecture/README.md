# Architecture

Editable diagrams are the `.drawio` files. The PNGs are the same topologies rendered for review.

The diagram skill in `felipewom/root-workspace` (`feat/architecture-diagrams-skill`, `.agents/skills/architecture-diagrams/`) was not readable with this agent’s GitHub credential (`gh` returned 404). These files were drawn directly in draw.io XML, in the grouped AWS-style used for cloud architecture reviews: dashed groups, compute in orange, control plane in purple, data in green, people in blue.

| Diagram | Files | What it shows |
| --- | --- | --- |
| All local | [all-local.drawio](all-local.drawio), [all-local.png](all-local.png) | Plane and node on the hub. Ledger and WhatsApp there. |
| Hybrid | [hybrid.drawio](hybrid.drawio), [hybrid.png](hybrid.png) | Hub plus a VPS plus a laptop that may be offline. |
| Multi-server | [multi-server.drawio](multi-server.drawio), [multi-server.png](multi-server.png) | Plane on its own VM. Standby is v1 and does not take WhatsApp. |
| Managed | [managed.drawio](managed.drawio), [managed.png](managed.png) | Hosted plane. Attached nodes are free of the hour pool. |
| Data flow | [data-flow.drawio](data-flow.drawio), [data-flow.png](data-flow.png) | Handoff, triage, ledger commit, approvals, node-hours. |
