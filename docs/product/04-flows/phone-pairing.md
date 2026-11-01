# Flow: phone pairing

## Diagram

```mermaid
sequenceDiagram
  participant Person
  participant Plane
  participant Node
  participant Phone
  Person->>Plane: Open Phone
  Plane-->>Person: which workspace and whether its node is online
  Person->>Node: Create pairing code
  Node-->>Phone: QR, one-time token, two minutes
  Phone->>Node: redeem
  Node-->>Phone: device cookie, SHA-256 stored
```

## Steps

| Step | Who | What happens | Result |
| --- | --- | --- | --- |
| 1 | Person | Opens Phone in the hub | Sees the node the phone will reach |
| 2 | Person | Creates a code and scans it | Same pairing shape as today |
| 3 | Phone | Loads the web app over Tailscale or the node’s HTTPS | Chats, approvals, inbox cards |
| 4 | Person | Approves a cleanup from the phone | Same decision endpoint. The ledger still commits on the node. |
