# Flowrate Dashboard — Treasuries, Subscribers, Admins

**Principles:** Non‑custodial clarity • Institutional polish • Fast at-a-glance KPIs • Safe defaults • Observable states

---

## **Treasuries (Deploying Nodes)**

**Goal:** See capital at work, yields, risk, and manage leases/channels without LN jargon overload.

1. **Overview**
   - KPI row: **Deployed BTC**, **Gross APY**, **Net APY**, **Earned to date**, **Active leases**, **Utilization %**, **Node Uptime**.
   - Chart: **Yield over time** (stacked: routing vs lease yield).
   - Table: **Top Counterparties** (lessee, inbound size, term, days left, effective cost ppm, status).
2. **Leases**
   - Table: id, counterparty, size (BTC), term (start–end), days left, fee model (fixed/ppm), status (Active/Pending/Expired), actions (Renew, Increase, Export).
   - Drawer: lease detail with invoices/settlements timeline.
3. **Channels**
   - Table: peer, capacity, local/remote balance, **utilization %**, base/ppm, HTLC success rate, uptime, actions (View, Close\* with guard).
   - Tooltip: explain utilization.
4. **Nodes**
   - Node health cards: status pill, version, ping, last rebal, fee policy snapshot, signer presence (if remote signer), warning if outdated.
5. **Billing & Exports**
   - **Statements** (monthly): download CSV/PDF; summary of lease fees earned, routing fees, net after Flowrate margin.
   - **Payout destinations** (read-only display, managed off-dashboard for now).
6. **Alerts**
   - Expiring leases (≤14 days), utilization &lt; target, uptime drops, policy drift from recommended template.

### **Notes**

- Always show **non-custodial** badges; clarify that Flowrate margin is transparent.
- Provide glossary popovers for “routing yield”, “lease yield”, “utilization”.

---

## **Liquidity Subscribers (Exchanges/Wallets/PSPs)**

**Goal:** Guarantee inbound capacity, watch reliability & cost, manage renewals, and request scale-up.

1. **Overview**
   - KPI row: **Inbound leased (BTC)**, **Expiring (≤14d)**, **Effective cost (ppm & fixed)**, **Payment success % (7D)**, **Open incidents**.
   - Chart: **Delivered inbound vs. usage** over time; line for success rate.
2. **Leases**
   - Table: id, pool/treasury (anonymized or named), inbound size, start–end, days left, fee model, status, actions (Renew, Scale, Cancel at term).
   - Flow: **Request more capacity** (size, term, price band selector → submit ticket).
3. **Integration** (Docs/Keys)
   - **API keys** (create + label + last used; show once), **Webhook endpoints** (create/test), **IP allowlist**.
   - Sample payloads for: capacity-delivered, expiry-warning, incident.
4. **Invoices & Billing**
   - Table: invoice id, period, amount, status (paid/unpaid), link to PDF.
5. **Health**
   - Read-only: channel count, primary peers, uptime summary, last policy update.
   - Alerts: capacity under target, success% drop, nearing expiry.

### **Notes**

- Keep renewal path one click from Overview (CTA on expiring card).
- If lessee anonymization is required, display pool nickname + compliance badge.

---

## Admins (Flowrate Ops)\*\*

**Goal:** Match supply ↔ demand, manage risk/compliance, oversee orchestration, and keep books/audit tight.

1. **Command Center (Overview)**
   - KPI row: **Total supply (BTC)**, **Total active leases**, **Avg net APY to treasuries**, **SLA breaches (7D)**, **Incidents open**.
   - Queues: **New subscriber requests**, **KYC pending**, **Expiring soon**, **Reconciliation diffs**.
2. **Matchmaking**
   - Table: demand tickets (size, term, price range, counterparty risk tier) ↔ suggested treasury pools (policy, available, constraints).
   - Action: allocate capacity (partial/full), set fee terms, issue contract.
3. **Compliance & Risk**
   - KYC/KYB checklist status, documents received, risk score, sanctions checks (metadata only, no PII storage in FE).
   - Lease policy rules (min term, max single-lessee exposure, jurisdiction constraints).
4. **Orchestration**
   - Channel lifecycle states (Pending → Opening → Active → Closing/Splicing) with per-step logs.
   - Node fleet status (version drift, uptime, signer quorum, backups status).
5. **Finance**
   - Fee accruals summary, treasury payouts pending, margin capture, monthly statements tracker.
6. **Audit & Users**
   - Org & user management, roles, last login, API key counts, **Audit log** viewer with filters + export.

---
