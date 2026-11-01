# Spec: phone and mobile

MVP is the existing phone web app, pointed at the node that holds the workspace.

## Pairing

Unchanged shape from `shared/pairing-link.ts`: QR, high-entropy one-time token, six-digit fallback, two minutes, single use, device token stored as SHA-256. The Phone page on the plane tells the person which node they are pairing and whether it is online.

The phone can:

- open chats the member is allowed to open
- answer approval and question cards
- approve or reject an inbox cleanup batch
- read the Important list

The phone cannot:

- edit `policy.yaml`
- turn on earned send
- export the ledger
- control the host screen

Push is P1. Until then the phone is the site on the home screen, as today’s web app. There is no offline mailbox.

A handoff code from the desktop is not a phone pairing. Phone pairing is a device. Handoff is a browser session.
