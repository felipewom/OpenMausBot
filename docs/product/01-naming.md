# Naming record

**Decision.** The product name is **Agents Hub**. The owner set this on 1 November 2026. It is the name already used for this vision. **Assistants Hub** is the fallback if Agents Hub cannot be used.

Every other document, the prototype, and the tickets use Agents Hub.

This note is not a legal opinion. A trademark lawyer should review the conflicts below before a commercial launch, a logo, or a trademark filing.

## What was checked

Lookups were made on 1 November 2026.

- Domain registration: RDAP against the registry (Verisign for `.com`, Google’s RDAP for `.dev` and `.app`, Identity Digital for `.ai` and `.io`). A 404 from the registry is treated as not registered. DNS was used only as a cross-check.
- GitHub: `GET https://api.github.com/users/<name>` for the org or user slug. A 404 means that slug is free. GitHub repository names are not globally unique, so a free org slug matters more than a free repo name.
- Name conflicts: web search for products and marks using Agents Hub, AgentHub, and Assistants Hub, plus the public record of USPTO serial 98094819.

## Agents Hub

| Name | Result | Evidence |
| --- | --- | --- |
| `agentshub.com` | Registered | RDAP. Registered 2011-05-19, expires 2027-05-19. Registrar GoDaddy. Client delete, renew, transfer, and update prohibited. |
| `agentshub.dev` | Registered | Google RDAP. Registered 2026-08-15, expires 2027-08-15. Client transfer prohibited. DNS NS at `registrar.eu`. |
| `agentshub.ai` | Registered | Identity Digital RDAP. Registered 2025-12-12, expires 2027-12-12. Client transfer prohibited. |
| `agentshub.app` | Registered | Google RDAP. Registered 2020-01-08, expires 2027-01-08. |
| `agentshub.io` | Registered | Identity Digital RDAP. Registered 2024-12-09, expires 2026-12-09. Registrar Porkbun. Registrant privacy (Private by Design, LLC). DNS NS at Porkbun. |
| `getagentshub.com` | Not registered | Verisign RDAP 404. |
| `getagentshub.dev` | Not registered | Google RDAP 404. DNS NXDOMAIN. |
| `getagentshub.ai` | Not registered | Identity Digital RDAP 404. DNS NXDOMAIN. |
| `getagentshub.app` | Not registered | Google RDAP 404. DNS NXDOMAIN. |
| `getagentshub.io` | Not registered | Identity Digital RDAP 404. |
| `agents-hub.com` | Registered | Verisign RDAP. Registered 2023-10-18, expires 2027-10-18. Registrar GoDaddy. |
| `agents-hub.dev` | Not registered | Google RDAP 404. DNS NXDOMAIN. |
| `agents-hub.ai` | Registered | Identity Digital RDAP. Registered 2024-12-15, expires 2026-12-15. Client delete, renew, transfer, and update prohibited. |
| `agents-hub.app` | Registered | Google RDAP. Registered 2026-04-26, expires 2027-04-26. Client transfer prohibited. DNS NS `moura.ns.cloudflare.com` and `journey.ns.cloudflare.com`. |
| `agents-hub.io` | Not registered | Identity Digital RDAP 404. |

`agents-hub.app` is already registered, and one of its Cloudflare nameserver labels is `moura`. That is consistent with a Cloudflare account that was assigned that pair. Confirm whether that registration is already yours before buying anything else. This note does not treat it as owned.

### GitHub

| Slug | Result |
| --- | --- |
| `agentshub` | Taken. Organization, display name AgentsHub, 0 public repositories at lookup time. |
| `agents-hub` | Taken. Organization, 0 public repositories at lookup time. |
| `AgentsHub` | Same organization as `agentshub` (GitHub slugs are case-insensitive). |
| `getagentshub` | Free (HTTP 404). |

Repository search for “agents hub” returns hundreds of unrelated repos (MCP agent lists, CrewAI examples, security pipelines). Those do not block an org, and they do mean the phrase is crowded.

### Conflicts that matter

1. **agentshub.ai is a live product.** [agentshub.ai](https://agentshub.ai/) sells an “agentic AI platform” whose headline is “Build Your Dream Team of AI Agents,” with a marketplace, thousands of integrations, and human approval before some actions. Same audience, same words. Do not use `agentshub.ai` as this product’s site, and do not imply affiliation.
2. **USPTO mark AGENTHUB, Reg. No. 7707945** (serial 98094819). Live registration, class 42, registered 25 February 2025, owner ALJ VISTIO QOZB LLC (Aurora, Illinois). The goods are online customer-service software, including AI that handles customer questions over digital and phone channels. “Agents Hub” is not the same string, and the goods are not identical, but both are class 42 software with “agent” and a hub-like product. This is the conflict to put in front of a lawyer before commercial use in the United States. Public summary: [markinton.com/trademark/agenthub-98094819](https://markinton.com/trademark/agenthub-98094819). Official status: [tsdr.uspto.gov](https://tsdr.uspto.gov/) under serial 98094819.
3. **AgentHub Inc.** appears as the owner of the Canadian registration for the mark GUMLOOP (CIPO application 2331579). That registration is for the word GUMLOOP, not for Agents Hub. The company name is still a collision in conversation and in search.
4. **GitHub `ModelEngine-Group/AgentsHub`** and other public repos use the concatenated name for unrelated agent catalogs.
5. **Upstream trademarks.** Apache-2.0 section 6 does not grant OpenMausBot, MausBot, or Maus. Agents Hub must not ship under those names. See [00-research.md](00-research.md).

## Assistants Hub (fallback)

| Name | Result | Evidence |
| --- | --- | --- |
| `assistantshub.com` | Registered | Verisign RDAP. Registered 2013-07-22, expires 2027-07-22. Registrar NameBright. |
| `assistantshub.dev` | Not registered | Google RDAP 404. DNS NXDOMAIN. |
| `assistantshub.ai` | Not registered as a domain | Identity Digital RDAP 404. DNS NXDOMAIN. The name is still in use: see GitHub below. |
| `assistantshub.app` | Not registered | Google RDAP 404. DNS NXDOMAIN. |
| `assistantshub.io` | Not registered | Identity Digital RDAP 404. |

GitHub org `assistants-hub` is taken. It publishes [assistants-hub/assistantshub.ai](https://github.com/assistants-hub/assistantshub.ai), described as an admin portal for deploying and managing AI assistants, plus `docs.assistantshub.ai`. GitHub org slug `assistantshub` returned 404.

The fallback is clearer of the USPTO AGENTHUB registration and of agentshub.ai, and it is closer to a generic phrase. It collides with an existing assistants portal and with `assistantshub.com`. Use it only if a lawyer says Agents Hub should not be the commercial name.

## Practical recommendation

Keep the product name **Agents Hub**, as decided.

For a site, `getagentshub.com` is free and says what it is. `agents-hub.dev` and `agents-hub.io` are also free and are the cleanest short forms that RDAP showed as unregistered. Do not point the product at `agentshub.ai` or `agentshub.com`.

For GitHub, `getagentshub` was free. `agentshub` and `agents-hub` were not.

Before spending on a filing or on paid ads under this name, ask counsel to look at USPTO 7707945 and at agentshub.ai.
