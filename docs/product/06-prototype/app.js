const VIEWS = [
  ["home", "Home"],
  ["workspaces", "Workspaces"],
  ["inbox", "Inbox", "6"],
  ["ledger", "Ledger"],
  ["bots", "Bots"],
  ["routines", "Routines"],
  ["nodes", "Nodes"],
  ["connections", "Connections"],
  ["channels", "Channels"],
  ["approvals", "Approvals", "3"],
  ["usage", "Usage"],
  ["team", "People"],
  ["invites", "Invites"],
  ["billing", "Billing"],
  ["phone", "Phone"],
  ["audit", "Audit"],
  ["settings", "Settings"],
];

const view = new URLSearchParams(location.search).get("view") || "home";

function link(id, label, badge) {
  const active = view === id || (id === "workspaces" && view === "workspace") || (id === "nodes" && view === "node");
  return `<a class="${active ? "active" : ""}" href="?view=${id}">${label}${badge ? `<span class="dot">${badge}</span>` : ""}</a>`;
}

function shell(title, sub, body, actions = "") {
  const nav = VIEWS.map(([id, label, badge]) => link(id, label, badge)).join("");
  return `<div class="app">
    <aside class="side">
      <div class="brand"><div class="mark"><i></i><i></i><i></i><i></i></div><div><b>Agents Hub</b><span>Northline</span></div></div>
      <nav class="nav">${nav}</nav>
      <div class="who"><div class="avatar">AR</div><div><b>Alex Rivera</b><div class="small">Owner</div></div></div>
    </aside>
    <main class="main">
      <div class="top"><div><h1>${title}</h1><p class="sub">${sub}</p></div><div class="row">${actions}</div></div>
      ${body}
    </main>
  </div>`;
}

const pill = (text, kind = "") => `<span class="pill ${kind}">${text}</span>`;

const pages = {
  landing() {
    return `<div class="landing">
      <div class="navtop"><div class="brand"><div class="mark"><i></i><i></i><i></i><i></i></div><b>Agents Hub</b></div>
        <div class="row"><a href="?view=signup">Sign in</a><a class="btn" href="?view=onboarding">Run it on your machine</a></div></div>
      <section class="hero">
        <div>
          <div class="kicker">Your bots, on any machine you trust</div>
          <h1>They keep working when this computer is off.</h1>
          <p class="sub" style="font-size:18px;max-width:520px">One place for workspaces, nodes, inboxes, and the decisions your main agent has learned. A homelab, a VPS, and a managed machine can all be on at once.</p>
          <div class="row" style="margin-top:18px"><a class="btn teal" href="?view=home">Open the hub</a><a class="btn quiet" href="?view=whatsnew">See the desktop hand-off</a></div>
        </div>
        <div class="card">
          <div class="kicker">This month</div>
          <h3 style="font-size:28px;margin-top:8px">128 <span style="color:var(--muted);font-size:16px">of 360 node-hours</span></h3>
          <div class="meter"><span></span></div>
          <p class="small">Resets 1 Dec. Hours on your own machines are not billed.</p>
          <table>
            <tr><td><i class="cloud-dot" style="background:#0e6e6a"></i>Home</td><td>Hub</td><td>${pill("Running")}</td></tr>
            <tr><td><i class="cloud-dot" style="background:#b54708"></i>Design Studio</td><td>AMS</td><td>${pill("Running")}</td></tr>
            <tr><td><i class="cloud-dot" style="background:#6941c6"></i>Family</td><td>Hub</td><td>${pill("Running")}</td></tr>
          </table>
        </div>
      </section>
    </div>`;
  },
  signup() {
    return `<div class="auth"><form class="card" action="?view=home">
      <div class="brand"><div class="mark"><i></i><i></i><i></i><i></i></div><b>Agents Hub</b></div>
      <h1 style="font-size:24px;margin:12px 0">Sign in</h1>
      <label>Email</label><input value="alex@northline.example" />
      <label>Password</label><input type="password" value="not-a-real-password" />
      <button class="btn" style="margin-top:16px;width:100%" type="submit">Continue</button>
      <p class="small">Self-hosted hub on this machine. No upstream account.</p>
    </form></div>`;
  },
  onboarding() {
    return `<div class="auth"><div class="card">
      <div class="steps"><i class="on"></i><i class="on"></i><i></i></div>
      <div class="kicker">Step 2 of 3</div>
      <h1 style="font-size:24px">This Mac is the hub</h1>
      <p class="sub">It will run the control plane and the first workspace. You can add the laptop and a VPS after.</p>
      <label>Organization</label><input value="Northline" />
      <label>Your name</label><input value="Alex Rivera" />
      <div class="row" style="margin-top:16px"><a class="btn quiet" href="?view=signup">Back</a><a class="btn" href="?view=whatsnew">Create hub</a></div>
    </div></div>`;
  },
  whatsnew() {
    const page = new URLSearchParams(location.search).get("slide") || "1";
    const slides = {
      "1": `<div class="kicker">What's new</div><h2 style="margin:6px 0">Your bots keep working when this computer is off.</h2>
        <p>Agents Hub puts workspaces, nodes, the inbox, and the ledger in one place. This laptop can sleep. The hub keeps the routines.</p>`,
      "2": `<div class="kicker">Node-hours</div><h2 style="margin:6px 0">Your machines are not a bill.</h2>
        <p>Hours on the hub and the laptop are shown and not charged. A managed node draws from a monthly pool, 128 of 360 used, resetting 1 Dec. You change the plan on the website, not in this window.</p>
        <div class="meter"><span></span></div>`,
      "3": `<div class="kicker">Open the hub</div><h2 style="margin:6px 0">Continue in the browser.</h2>
        <p>The desktop hands you a one-time link. Billing, the inbox, and the ledger live on the hub. This window never asks for a card.</p>
        <div class="callout">Next: open Agents Hub on the hub. Self-host has nothing to pay. A managed node is optional.</div>`,
    };
    return `<div class="modal-back"><div class="desk">
      <div class="bots"><b>Northline</b><p class="small">Chief · Inbox · Research</p><p class="small">Calendar · Finance · Family</p></div>
      <div class="chat"></div></div>
      <div class="scrim"><div class="sheet">
        <div class="preview"><div class="kicker">Hub · online</div><div class="row" style="margin-top:8px">
          <div style="flex:1;background:#fff;border:1px solid var(--line);border-radius:10px;padding:8px"><b>Home</b><div class="small">Your machine</div>${pill("Running")}</div>
          <div style="flex:1;background:#fff;border:1px solid var(--line);border-radius:10px;padding:8px"><b>Design Studio</b><div class="small">Pro · AMS</div>${pill("Running")}</div>
          <div style="flex:1;background:#fff;border:1px solid var(--line);border-radius:10px;padding:8px"><b>Family</b><div class="small">Your machine</div>${pill("Running")}</div>
        </div><p class="small">128 of 360 node-hours · resets 1 Dec · WhatsApp on Hub</p></div>
        <div style="padding:18px 20px">${slides[page] || slides["1"]}</div>
        <div class="foot">
          <a href="?view=home" style="color:var(--muted);text-decoration:none">Not now</a>
          <div class="dots">${page === "1" ? "<b></b>" : "<i></i>"}${page === "2" ? "<b></b>" : "<i></i>"}${page === "3" ? "<b></b>" : "<i></i>"}</div>
          ${page === "3" ? `<a class="btn" href="?view=home">Open Agents Hub</a>` : `<a class="btn quiet" href="?view=whatsnew&slide=${Number(page) + 1}">Next</a>`}
        </div>
      </div></div></div>`;
  },
  home() {
    return shell("Good morning, Alex", "The hub is online. The laptop is asleep. Inbox has 6 threads that need you.", `
      <div class="cards">
        <div class="card"><div class="kicker">Node-hours</div><h3>128 of 360</h3><div class="meter"><span></span></div><p class="small">Managed pool resets 1 Dec. 40 hours on your machines are not billed.</p></div>
        <div class="card"><div class="kicker">Inbox</div><h3>6 need a decision</h3><p class="small">4 important. 14 newsletters can become one rule.</p><a href="?view=inbox">Open inbox</a></div>
        <div class="card"><div class="kicker">Ledger</div><h3>42 decisions</h3><p class="small">Last: archive news@example.com, today.</p><a href="?view=ledger">Read the rules</a></div>
      </div>
      <div class="card" style="margin-top:12px">
        <div class="row" style="justify-content:space-between"><h3>Workspaces</h3><a href="?view=workspaces">View all</a></div>
        <table>
          <tr><th>Workspace</th><th>Node</th><th>Plan</th><th>Status</th><th>Renews</th></tr>
          <tr><td><i class="cloud-dot" style="background:#0e6e6a"></i><a href="?view=workspace">Home</a></td><td>Hub</td><td>Your machine</td><td>${pill("Running")}</td><td>—</td></tr>
          <tr><td><i class="cloud-dot" style="background:#b54708"></i>Design Studio</td><td>AMS</td><td>Pro</td><td>${pill("Running")}</td><td>30 Nov 2026</td></tr>
          <tr><td><i class="cloud-dot" style="background:#6941c6"></i>Family</td><td>Hub</td><td>Your machine</td><td>${pill("Running")}</td><td>—</td></tr>
        </table>
      </div>`, `<a class="btn quiet" href="?view=approvals">3 approvals</a>`);
  },
  workspaces() {
    return shell("Workspaces", "A workspace is a home for bots, mail, and a ledger. Each has one primary node.", `
      <div class="cards">
        ${[["Home", "Hub", "8 bots", "#0e6e6a"], ["Design Studio", "AMS", "4 bots", "#b54708"], ["Family", "Hub", "3 bots", "#6941c6"]].map(([n, node, bots, c]) =>
          `<a class="card" href="?view=workspace" style="text-decoration:none;color:inherit"><i class="cloud-dot" style="background:${c}"></i><h3>${n}</h3><p class="small">${node} · ${bots}</p>${pill("Running")}</a>`).join("")}
      </div>`, `<a class="btn" href="?view=workspace">New workspace</a>`);
  },
  workspace() {
    return shell("Home", "Pinned to Hub. Personal ledger. WhatsApp stays on this node.", `
      <div class="cards">
        <div class="card"><div class="kicker">Node</div><h3>Hub</h3>${pill("Online")}<p class="small">Mac mini · disk 42% free</p></div>
        <div class="card"><div class="kicker">Bots</div><h3>8 running</h3><p class="small">Chief is the main agent and the only ledger writer.</p></div>
        <div class="card"><div class="kicker">Inbox</div><h3>Gmail connected</h3><p class="small">alex@northline.example</p></div>
      </div>
      <div class="card" style="margin-top:12px"><h3>Placement</h3><p>Primary: Hub. Moving to AMS copies, checks counts, freezes Hub, then starts there. The WhatsApp session does not move.</p></div>`);
  },
  nodes() {
    return shell("Nodes", "Anything that runs the agent. The hub also runs the control plane.", `
      <div class="card"><table>
        <tr><th>Node</th><th>Kind</th><th>Labels</th><th>Heartbeat</th><th>Status</th></tr>
        <tr><td><a href="?view=node">Hub</a></td><td>Mac</td><td>whatsapp, desktop</td><td>4s ago</td><td>${pill("Online")}</td></tr>
        <tr><td>Laptop</td><td>Mac</td><td>desktop</td><td>6h ago</td><td>${pill("Offline", "bad")}</td></tr>
        <tr><td>AMS</td><td>Docker</td><td>managed</td><td>9s ago</td><td>${pill("Online")}</td></tr>
      </table></div>`, `<a class="btn" href="?view=node">Add a node</a>`);
  },
  node() {
    return shell("Hub", "Paired 12 Oct 2026 · agent 0.1.0 · arm64", `
      <div class="cards">
        <div class="card"><div class="kicker">Health</div><h3>Online</h3><p class="small">CPU 8 · 16 GB · disk 210 GB free</p></div>
        <div class="card"><div class="kicker">Workspaces</div><h3>Home, Family</h3><p class="small">Design Studio is on AMS.</p></div>
        <div class="card"><div class="kicker">Channels</div><h3>WhatsApp</h3><p class="small">Sticky. Failover will not take the session.</p></div>
      </div>
      <div class="warnbox" style="margin-top:12px">Laptop is offline. Its workspace was not placed here, so nothing is waiting to fail over.</div>`);
  },
  bots() {
    return shell("Bots", "Chief learns. The others read the ledger and ask only about new cases.", `
      <div class="card"><table>
        <tr><th>Bot</th><th>Role</th><th>Model</th><th>Workspace</th><th>Approval</th></tr>
        <tr><td>Chief</td><td>Main agent</td><td>Claude</td><td>Home</td><td>Ask</td></tr>
        <tr><td>Inbox</td><td>Mail</td><td>Claude</td><td>Home</td><td>Ask on send</td></tr>
        <tr><td>Research</td><td>Worker</td><td>Codex</td><td>Design Studio</td><td>Ask</td></tr>
        <tr><td>Family</td><td>Worker</td><td>Claude</td><td>Family</td><td>Ask</td></tr>
      </table></div>`);
  },
  routines() {
    return shell("Routines", "Schedules run on the primary node. The morning inbox pass is one of them.", `
      <div class="card"><table>
        <tr><th>Routine</th><th>When</th><th>Node</th><th>Last</th></tr>
        <tr><td>Inbox morning</td><td>07:30</td><td>Hub</td><td>${pill("Completed")}</td></tr>
        <tr><td>Design digest</td><td>Weekdays 18:00</td><td>AMS</td><td>${pill("Completed")}</td></tr>
        <tr><td>Follow-up nudges</td><td>Every 3 days</td><td>Hub</td><td>${pill("Waiting", "warn")}</td></tr>
      </table></div>`);
  },
  connections() {
    return shell("Connections", "Gmail is on your Composio project. Tokens never sit in the ledger.", `
      <div class="card"><table>
        <tr><th>App</th><th>Provider</th><th>Owner</th><th>Used by</th></tr>
        <tr><td>Gmail</td><td>Composio</td><td>Alex</td><td>Inbox</td></tr>
        <tr><td>Slack</td><td>Slack app</td><td>Alex</td><td>Chief</td></tr>
        <tr><td>Calendar</td><td>Nango</td><td>Priya</td><td>Family</td></tr>
      </table></div>`, `<a class="btn quiet" href="?view=inbox">Use Gmail as inbox</a>`);
  },
  channels() {
    return shell("Channels", "WhatsApp is the bridge on Hub. Mail is the inbox, not a second chat transport.", `
      <div class="card"><table>
        <tr><th>Channel</th><th>Node</th><th>Sticky</th><th>Status</th></tr>
        <tr><td>WhatsApp bridge</td><td>Hub</td><td>Yes</td><td>${pill("Online")}</td></tr>
        <tr><td>WhatsApp phone sheet</td><td>Phone</td><td>No</td><td>${pill("Paired")}</td></tr>
        <tr><td>Slack</td><td>Hub</td><td>No</td><td>${pill("Online")}</td></tr>
      </table></div>`);
  },
  approvals() {
    return shell("Approvals", "Sends and cleanup wait here until the ledger has earned that sender.", `
      <div class="card"><table>
        <tr><th>Request</th><th>Bot</th><th>Age</th><th></th></tr>
        <tr><td>Archive 14 from news@example.com</td><td>Inbox</td><td>20m</td><td><a class="btn" href="?view=inbox">Review</a></td></tr>
        <tr><td>Send draft to Ada Berger</td><td>Inbox</td><td>1h</td><td><a class="btn quiet" href="?view=inbox">Open draft</a></td></tr>
        <tr><td>Run a command on Hub</td><td>Chief</td><td>2h</td><td><span class="small">Allow / Deny</span></td></tr>
      </table></div>`);
  },
  inbox() {
    return shell("Inbox", "Gmail · alex@northline.example · split by the ledger", `
      <div class="callout" style="margin-bottom:12px">14 messages from news@example.com are unresolved. Approving archive writes one rule. It does not send anything.</div>
      <div class="split">
        <div class="card">
          <div class="kicker">Important</div>
          ${[["Ada Berger", "Contract notes", "Asks for the Friday draft.", "Person"],
             ["Sam Okonkwo", "Hub disk", "Wants a yes on moving Research.", "Person"],
             ["Priya Shah", "School forms", "A signature, due Thursday.", "Person"]].map(([a, s, b, t]) =>
            `<div class="mail"><div><b>${a}</b> <span class="tag">${t}</span><div><b>${s}</b></div><p>${b}</p></div></div>`).join("")}
        </div>
        <div>
          <div class="card">
            <div class="kicker">Other · needs a decision</div>
            <p><b>news@example.com</b></p>
            <p class="small">14 newsletters. No rule yet.</p>
            <div class="row"><a class="btn" href="?view=ledger">Approve archive</a><a class="btn quiet" href="?view=approvals">Not junk</a></div>
          </div>
          <div class="card" style="margin-top:12px">
            <div class="kicker">Draft waiting</div>
            <p>Reply to Ada. Sending still needs approval. Editing the draft teaches the next one.</p>
          </div>
          <div class="card" style="margin-top:12px">
            <div class="kicker">Handled by rules</div>
            <p class="small">6 receipts labeled. 0 trashed. Trash trust is still ask.</p>
          </div>
        </div>
      </div>`);
  },
  ledger() {
    return shell("Ledger", "Private git on Hub. Chief commits. Every other agent reads.", `
      <div class="split">
        <div>
          <div class="card" style="margin-bottom:12px">
            <div class="kicker">email/senders.yaml</div>
            <pre>version: 1
senders:
  news@example.com:
    action: archive
    trust: ask
    reason: Newsletter. I never open these.
    decided_by: mem_alex
    decisions: [dec_01HZX]
    updated: 2026-11-01T15:04:00Z</pre>
          </div>
          <div class="card">
            <div class="kicker">decisions.jsonl</div>
            <table>
              <tr><th>Date</th><th>Action</th><th>Reason</th><th>Decided by</th></tr>
              <tr><td>1 Nov 15:04</td><td>archive</td><td>Newsletter. I never open these.</td><td>Alex Rivera</td></tr>
              <tr><td>1 Nov 11:12</td><td>edit_draft</td><td>Shorter greeting for Ada.</td><td>Alex Rivera</td></tr>
              <tr><td>31 Oct 18:40</td><td>label</td><td>Receipts from the studio store.</td><td>Alex Rivera</td></tr>
              <tr><td>31 Oct 09:02</td><td>reject</td><td>Do not trash Priya.</td><td>Alex Rivera</td></tr>
            </table>
          </div>
        </div>
        <div class="card">
          <div class="kicker">policy.yaml</div>
          <pre>archive_trust_after: 3
trash_trust_after: 5
outgoing_trust: off</pre>
          <p class="small">Archive becomes quiet after 3 consistent decisions. Send never earns itself. Earned send is off.</p>
          <p class="small">Latest commit: archive news@example.com · dec_01HZX</p>
          <button class="btn quiet" type="button">Revert this commit</button>
        </div>
      </div>`);
  },
  usage() {
    return shell("Usage", "Node-hours are the pool. Model tokens are shown and not billed.", `
      <div class="cards">
        <div class="card"><div class="kicker">Managed</div><h3>128 of 360</h3><div class="meter"><span></span></div><p class="small">Resets 1 Dec. Design Studio on AMS.</p></div>
        <div class="card"><div class="kicker">Your machines</div><h3>40 hours</h3><p class="small">Hub and the laptop. Not billed.</p></div>
        <div class="card"><div class="kicker">Tokens</div><h3>1.2M in</h3><p class="small">Estimated provider cost, not an Agents Hub charge.</p></div>
      </div>`);
  },
  team() {
    return shell("People", "Roles apply to the ledger and the inbox too.", `
      <div class="card"><table>
        <tr><th>Person</th><th>Role</th><th>Sees</th></tr>
        <tr><td>Alex Rivera</td><td>Owner</td><td>Everything, including earned-send switch</td></tr>
        <tr><td>Sam Okonkwo</td><td>Admin</td><td>Nodes, ledger, no billing</td></tr>
        <tr><td>Priya Shah</td><td>Member</td><td>Family workspace and its ledger</td></tr>
      </table></div>`, `<a class="btn" href="?view=invites">Invite</a>`);
  },
  invites() {
    return shell("Invites", "A link lasts 7 days and works once.", `
      <div class="card">
        <label>Email</label><input value="noah@northline.example" />
        <label>Role</label><select><option>Member</option><option>Admin</option></select>
        <label>Workspace</label><select><option>Family</option><option>Home</option></select>
        <button class="btn" style="margin-top:12px" type="button">Send invite</button>
        <p class="small">Pending: none. Noah has not been invited.</p>
      </div>`);
  },
  billing() {
    return shell("Billing", "This install is self-hosted. A managed node is optional and paid on this page, not in the desktop.", `
      <div class="cards">
        ${[["Self-host", "Now", "$0", "Hub and laptop. Full product."],
           ["Pro", "Managed", "$49 / month", "1 managed node, 360 node-hours."],
           ["Team", "Later", "$99 / month", "3 managed nodes. Placeholder."]].map(([n, s, p, b]) =>
          `<div class="card"><div class="kicker">${s}</div><h3>${n}</h3><p>${p}</p><p class="small">${b}</p></div>`).join("")}
      </div>
      <p class="small">Tax is added by the processor. The desktop never collects a card. Upstream checkout is not used.</p>`);
  },
  phone() {
    return shell("Phone", "Pair the web app to Hub. It can approve cleanup. It cannot turn on sending.", `
      <div class="row">
        <div class="card"><div class="qr"></div><p class="small">Code expires in 2 minutes.</p></div>
        <div class="card" style="flex:1"><h3>Hub is online</h3><p>The phone reaches Home and Family. Design Studio is on AMS and has its own code.</p>${pill("WhatsApp sheet available")}</div>
      </div>`);
  },
  audit() {
    return shell("Audit", "Decisions in the ledger also land here as metadata. Mail bodies do not.", `
      <div class="card"><table>
        <tr><th>When</th><th>Who</th><th>Action</th><th>Target</th></tr>
        <tr><td>15:04</td><td>Alex</td><td>ledger.commit</td><td>dec_01HZX archive</td></tr>
        <tr><td>11:20</td><td>Alex</td><td>approval.decided</td><td>Draft to Ada, still unsent</td></tr>
        <tr><td>09:10</td><td>Hub</td><td>node.heartbeat</td><td>online</td></tr>
        <tr><td>Yesterday</td><td>Sam</td><td>node.pair</td><td>AMS</td></tr>
      </table></div>`);
  },
  settings() {
    return shell("Settings", "Outgoing trust stays off until you turn it on.", `
      <div class="card">
        <h3>Earned send</h3>
        <p>Off. Approving archives never teaches the agent to send. Turning this on is an owner action and still applies per sender.</p>
        <button class="btn quiet" type="button" disabled>Off</button>
      </div>
      <div class="card" style="margin-top:12px">
        <h3>Updates</h3>
        <p class="small">Feed: the fork’s releases. Upstream’s update host is not contacted.</p>
      </div>`);
  },
};

document.getElementById("app").innerHTML = (pages[view] || pages.home)();
