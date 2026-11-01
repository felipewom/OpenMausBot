# Spec: connectors

Mail, Slack, and the other apps go through one interface. Composio is the default implementation on the operator’s own project. It is not a product the person resells.

## Interface

```text
ConnectorProvider
  id: composio | pipedream | nango | mcp
  connect(member, toolkit) -> url
  accounts(workspace) -> [{ id, toolkit, label, ownerMemberId }]
  invoke(accountId, tool, args) -> result
  triggers(accountId) -> events pulled by the node
```

The node is the only caller. The plane stores provider id, toolkit, label, and owner. Refresh tokens stay at the provider or in the node secret file.

## Composio

The operator deploys `cloudflare/composio-broker` under their own name and sets `OMB_COMPOSIO_BROKER_URL` to that worker, or sets a project key on the node and skips the worker. The packaged default must not be `openmausbot-composio.milindsoni201.workers.dev`.

Composio’s terms do not include resale of the platform. Agents Hub bills node-hours, not connector seats. Each customer of a managed Agents Hub either brings their own Composio project or uses a project the operator holds for their own users under a deal. The spec assumes the operator’s project for a single-tenant homelab, and a written vendor deal before multi-tenant resale.

Sessions stay per member (`user_id`). Sharing into a workspace is an explicit pin, matching Composio’s shared-connection ACL. Default is private.

## Pipedream and Nango

Same interface. Pipedream Connect is the hosted fallback. Nango is the self-hosted OAuth fallback when the person wants token refresh on their own machine. Gmail inbox can bind to whichever account is marked `inbox: true`.

## MCP

A remote MCP server the person adds is a provider with no OAuth broker. Tools appear beside the others. The inbox still needs a mail-shaped `list` and `archive`. A generic MCP server does not become an inbox.

## Non-goals

- Proxying the upstream broker.
- Storing Connect Links in chat.
