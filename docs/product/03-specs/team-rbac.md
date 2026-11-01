# Spec: team and RBAC

Roles are workspace-scoped and org-scoped. The ledger and the inbox obey the same roles.

| Action | Owner | Admin | Member | Guest (P1) |
| --- | --- | --- | --- | --- |
| Billing, delete org | yes | no | no | no |
| Pair or revoke a node | yes | yes | no | no |
| Invite, change roles | yes | yes | no | no |
| Read the ledger | yes | yes | yes, in their workspaces | no |
| Revert a ledger commit | yes | yes | no | no |
| Turn on earned send | yes | no | no | no |
| Triage and decide inbox cards | yes | yes | yes, if they can see that mailbox | named bots only |
| Export backup | yes | yes | no | no |

A mailbox belongs to the member who connected it. Other members see counts only, unless the connector is shared. Sharing is a decision `approve` on the connection, written to the ledger.

Invites: email, role, optional workspace, 7-day single-use token, hash stored. Removing a member bumps `sessionVersion`.

Personal workspaces hide invites. That matches upstream’s personal Cloud home, without copying its code.
