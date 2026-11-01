# Spec: update channel

## Feed

Desktop and node agent update from a feed the owner publishes. Build-time default is the fork’s release URL, overridable with `AH_UPDATE_URL`. `autoDownload` stays false until the person confirms. Windows still needs a `latest.yml` on that feed or installs strand.

The upstream feed `github.com/milind-soni/OpenMausBot` is not the default.

## What’s new

After a successful update, once per release id, the desktop shows Agents Hub’s carousel ([../04-flows/whats-new.md](../04-flows/whats-new.md)). It is local content shipped with the app, not a page fetched from `cloud.openmausbot.com`.

Removed from the packaged build, and covered by a test that fails if the string appears in packaged defaults:

- `cloud.openmausbot.com`
- `omb-cloud-staging.fly.dev`
- `accounts.openmausbot.com`
- `openmausbot-composio.milindsoni201.workers.dev`
- `us.i.posthog.com`
- `checkout.dodopayments.com`
- the HighLevel relay default URL

Unmounted UI: `CloudProPopup`, notice id `cloud-pro-update-2026-10`, `CloudTrialIntro`, `ProIntroduction`, `cloud-buy/`. `UpdateIndicator` may keep a local release-notes list. It must not deep-link to upstream’s marketing site.

`src/lib/analytics.ts` is deleted or pointed at nothing. Opt-out is not enough if the binary still contains the upstream key.
