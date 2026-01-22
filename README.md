<p align="center">
  <img src="https://img.shields.io/badge/Arc-Testnet-blue?style=for-the-badge" alt="Arc Testnet"/>
  <img src="https://img.shields.io/badge/USDC-Payments-green?style=for-the-badge" alt="USDC"/>
  <img src="https://img.shields.io/badge/x402-Protocol-purple?style=for-the-badge" alt="x402"/>
  <img src="https://img.shields.io/badge/Gasless-Agents-brightgreen?style=for-the-badge" alt="Gasless"/>
  <img src="https://img.shields.io/badge/Gemini-AI-orange?style=for-the-badge" alt="Gemini AI"/>
</p>

# Arcent — Agentic Commerce on Arc

> **The first x402 implementation on Arc Network with Pay-on-Success Protection**

AI agents that autonomously pay for API access. No human intervention. No credit cards. No subscriptions. Just code and money.

---

## Hackathon Submission

**Track**: Agentic Commerce on Arc  
**Demo**: [Live Application](https://arcent.vercel.app)  
**GitHub**: [github.com/cutepawss/arcent](https://github.com/cutepawss/arcent)

---

## The Problem

**AI agents can't participate in the economy.**

```
- AI agents can't have bank accounts
- AI agents can't pass KYC verification
- AI agents can't manage monthly subscriptions
- AI agents can't use credit cards
```

The internet economy was built for humans, not machines.

---

## The Solution

**Arcent gives agents a native economy.**

```
+ Programmable wallets via Circle SDK
+ HTTP 402 payment protocol (x402)
+ USDC micropayments on Arc Network
+ Pay-on-Success — agents only pay for working results
+ Gasless for agents — executor pays network fees
+ Multi-provider routing for optimal service
```

### Gasless Agent Architecture

**Agents only sign, they never pay gas.** The executor wallet covers all network fees:

```javascript
// Agent signs payment authorization
const signature = await agentWallet.signTypedData(paymentData);

// Executor submits transaction and pays gas
const tx = await executorWallet.sendTransaction({
    to: providerAddress,
    value: paymentAmount,
    // Executor pays gas, not the agent
});
```

**Why this matters:**
- Agents don't need native tokens for gas
- Simplified agent wallet management
- Predictable costs for agent operators

---

## What Makes Arcent Unique?

Most hackathon projects use blockchain for *storage* or *identity*.
Arcent uses Arc for what blockchains do best: **payments**.

We're the first to combine:
1. **HTTP 402** — The payment protocol from 1999, never widely adopted
2. **Arc Network** — Sub-second settlement with predictable fees
3. **AI Agents** — Autonomous economic decision-making
4. **Pay-on-Success** — Validate results before releasing payment

Result: AI agents that can **buy services autonomously** without human intervention or credit cards.

---

## Atomic Settlement — Pay Only on Success

**Traditional APIs charge upfront. Arcent charges on success.**

> In Arcent, "atomic" means all-or-nothing: either the service succeeds AND payment executes, or neither happens. This protects agents from paying for failed API calls.

**Agent State Machine:** Arcent agents operate as finite-state economic actors (`HOLD → EXECUTE → VALIDATE → SETTLE / VOID`).

### The Problem with Standard x402

Every x402 implementation follows this flow:
```
1. Agent pays → 2. API is called → 3. If API fails, money is lost
```

### Arcent's Innovation: Result-Validated Payment

We extend x402 with result validation before payment execution:
```
1. Call API first (payment held, not executed)
2. Validate the response
3. If valid → Execute payment
4. If invalid → Cancel payment, agent keeps funds
```

### Technical Implementation

```javascript
// server.js - Result-Validated Payment
const hasValidContent = apiResult.temperature || apiResult.price || 
                        apiResult.translation || apiResult.city;

if (!hasValidContent || apiResult.model === 'fallback') {
    // NO PAYMENT EXECUTED - Agent funds protected
    return { success: false, paid: false, atomicProtection: true };
}

// SUCCESS - Execute payment and return result
await executePayment(txHash);
return { success: true, paid: true, result: apiResult };
```

### Why This Matters

- LLM APIs fail ~5% of the time (rate limits, errors)
- Weather APIs fail with invalid locations
- Standard x402 → Agent loses 5% of funds on failures
- **Arcent → Agent protected, 0% waste**

---

## Why Arc Network is Essential

We didn't just use Arc because it's the hackathon sponsor. 
**Arc is the ONLY blockchain that makes micropayments practical.**

### The Math Behind Our Choice

For a $0.002 weather API call:

| Chain | API Call | Gas Cost | Total | Overhead |
|-------|----------|----------|-------|----------|
| **Ethereum L1** | $0.002 | $7.50 | $7.502 | 3,751x |
| **Polygon** | $0.002 | $0.15 | $0.152 | 76x |
| **Arc Network** | $0.002 | $0.0003 | **$0.0023** | **15%** |

### Arc's Killer Features for Agents

| Feature | Why It Matters |
|---------|----------------|
| **Sub-second finality** | Agents can't wait 12s (Ethereum) for payment confirmation |
| **Deterministic finality** | No risk of payment reversals |
| **USDC-native gas** | No token swaps needed |
| **Predictable fees** | $0.0001 always - enables micropayments |

---

## Performance Benchmarks

*All metrics from real Arc Testnet transactions.*

### Measured Latencies

| Operation | Time | Source |
|-----------|------|--------|
| 402 Response | **3ms** | Gateway |
| AI Decision (Gemini) | **110ms** | gemini-2.0-flash |
| Payment Authorization | **800ms** | Circle SDK |
| Pre-flight Check | **106ms** | Arc RPC |
| Weather API Call | **1.2s** | wttr.in |
| Crypto API Call | **0.8s** | CoinGecko |

### Pay-on-Success Protection

**Scenario**: Agent makes 1,000 API calls with 5% failure rate

| Metric | Without Arcent | With Arcent |
|--------|---------------|-------------|
| Failed Calls | 50 | 50 |
| Money Lost | $1.00 (50 × $0.02) | **$0.00** |
| Monthly Savings | - | **$30/agent** |

---

## Arcent vs Traditional APIs

| Feature | Traditional APIs | Arcent |
|---------|-----------------|--------|
| **Payment** | Credit card subscription | USDC micropayments |
| **Agent Access** | Requires human | Fully autonomous |
| **Failed Requests** | Still charged | Pay-on-Success (no charge) |
| **Settlement** | 2-3 days | <2 seconds (Arc) |
| **KYC Required** | Yes | No (programmatic wallet) |

---

## Architecture

### Payment Flow
```
┌─────────┐         ┌──────────────┐         ┌─────────┐
│  Agent  │         │   Arcent     │         │   API   │
│         │         │   Gateway    │         │ Provider│
└────┬────┘         └──────┬───────┘         └────┬────┘
     │                     │                      │
     │ 1. Request          │                      │
     ├────────────────────►│                      │
     │                     │                      │
     │ 2. 402 Challenge    │                      │
     │◄────────────────────┤                      │
     │                     │                      │
     │ 3. Payment Intent   │                      │
     │ (held, not sent)    │                      │
     ├────────────────────►│                      │
     │                     │                      │
     │                     │ 4. Call API          │
     │                     ├─────────────────────►│
     │                     │                      │
     │                     │ 5. Response          │
     │                     │◄─────────────────────┤
     │                     │                      │
     │                     │ 6. VALIDATE          │
     │                     │                      │
     │ 7a. Success → Pay   │                      │
     │◄────────────────────┤                      │
     │                     │                      │
     │ 7b. Failure → Keep  │                      │
     │◄────────────────────┤                      │
```

### System Components
```
┌─────────────────────────────────────────────────────────────────┐
│                         Frontend (React)                         │
│  ┌─────────────────┐  ┌──────────────────┐  ┌────────────────┐ │
│  │  Agent Console  │  │  Payment Monitor │  │ Provider Stats │ │
│  └─────────────────┘  └──────────────────┘  └────────────────┘ │
└──────────────────────────┬──────────────────────────────────────┘
                           │
┌──────────────────────────▼──────────────────────────────────────┐
│                    Backend (Node.js + Express)                   │
│  ┌──────────────┐  ┌──────────────┐  ┌─────────────────┐       │
│  │ Agent Engine │  │x402 Executor │  │ Task Router     │       │
│  │ • Gemini AI  │  │• 402 Handler │  │ • Weather       │       │
│  │ • Planning   │  │• Validation  │  │ • Crypto        │       │
│  │ • Execution  │  │• Settlement  │  │ • Intelligence  │       │
│  └──────────────┘  └──────────────┘  └─────────────────┘       │
└───────────────────────────────────────────────────────────────────┘
         │                    │                    │
    Circle Wallets       Arc Network        Multi-Provider
```

---

## Multi-Provider Network

| Node | Backing | Cost |
|------|---------|------|
| **LLM-Reasoning-01** | Google Gemini | $0.005 - $0.02 |
| **Oracle-Price-Feed** | CoinGecko | $0.005 |
| **Meteorology-Relay** | wttr.in | $0.002 |

### Intelligent Routing

```javascript
function routeTask(task) {
    if (task.includes('weather')) return 'WEATHER';
    if (task.includes('bitcoin')) return 'CRYPTO';
    return 'INTELLIGENCE';
}
```

### Provider Scoring System

Agents learn which providers are reliable. We track success/failure rates in real-time:

```javascript
// Real-time reliability scoring (from server.js)
function getProviderScore(provider) {
    const stats = providerStats[provider];
    const total = stats.success + stats.failure;
    const successRate = stats.success / total;
    const avgLatency = stats.totalLatency / total;
    const latencyScore = Math.max(0, 1 - (avgLatency / 5000));
    return (successRate * 0.7) + (latencyScore * 0.3);
}
```

**API Endpoint:** `GET /providers/stats` returns live scoring data.

*Provider scores directly influence routing weight, reducing capital waste over time.*

### Embedded SQL Persistence

Arcent uses embedded SQL persistence to store transaction history and provider reliability metrics. **This ensures agent decisions remain auditable across restarts.**

Every agent decision and payment creates a permanent audit trail:

```javascript
// Deterministic agent state - survives restarts
saveTransaction({
    timestamp: new Date().toISOString(),
    provider: selectedApi,
    amount: totalSpent.toString(),
    txHash: txResult.txHash,
    status: 'success',
    query: task  // Full audit trail
});
```

**Audit Endpoints:**
- `GET /transactions/history` — Complete payment audit trail
- `GET /db/stats` — Database health & statistics
- `GET /providers/stats` — Persisted reliability metrics

---

## Quick Start

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

```bash
git clone https://github.com/YOUR_USERNAME/arcent.git
cd arcent/x402-gateway

cd gateway && npm install
cd ../frontend && npm install
```

### Configuration

Create `gateway/.env`:

```env
CIRCLE_API_KEY=your_circle_api_key
CIRCLE_ENTITY_SECRET=your_entity_secret
GEMINI_API_KEY=your_gemini_api_key
ARC_RPC_URL=https://rpc.testnet.arc.network
PORT=3001
```

### Running

```bash
# Terminal 1
cd gateway && npm run dev

# Terminal 2
cd frontend && npm run dev
```

Open http://localhost:5175

---

## Demo Walkthrough

1. Navigate to **Agent Demo**
2. Enter a task: `"What's the price of Bitcoin?"`
3. Watch the terminal show:
   - Task analysis
   - HTTP 402 challenge
   - AI decision (APPROVE)
   - Payment execution
   - Result delivery
4. Verify on [ArcScan](https://testnet.arcscan.app/address/0x988530A4DF2fE4590DB57CFb8a6AD831C01C996a)

---

## API Reference

### x402 Protected Endpoints

| Endpoint | Cost | Description |
|----------|------|-------------|
| `POST /x402/translate` | $0.02 | AI translation |
| `POST /x402/crypto` | $0.005 | Crypto prices |
| `POST /x402/weather` | $0.002 | Weather data |

---

## Security

| Layer | Protection |
|-------|------------|
| **Pay-on-Success** | Payment only on valid response |
| **Circle HSM** | Enterprise key custody |
| **Arc Finality** | Deterministic settlement |
| **Replay Protection** | Unique nonce per TX |

---

## Spending Controls & Limits

Arcent implements transparent spending controls to protect AI agents from runaway costs.

### Default Limits

| Limit Type | Default | Environment Variable |
|------------|---------|---------------------|
| **Per-Transaction** | $0.50 | `MAX_TRANSACTION_AMOUNT` |
| **Daily** | $10.00 | `DAILY_SPENDING_LIMIT` |
| **Weekly** | $50.00 | `WEEKLY_SPENDING_LIMIT` |
| **Monthly** | $100.00 | `MONTHLY_SPENDING_LIMIT` |
| **Rate Limit** | 30 req/min | `RATE_LIMIT_MAX` |
| **Low Balance Alert** | $5.00 | `LOW_BALANCE_THRESHOLD` |

### Why These Limits?

For micropayment APIs ($0.002 - $0.02 per call):

| Scenario | Without Limits | With Arcent Limits |
|----------|---------------|-------------------|
| Bug causing infinite loop | Unlimited loss | Max $10/day |
| Compromised agent | Drain entire wallet | Max $100/month |
| Rate limit attack | 100+ req/min | 30 req/min cap |

### Monitoring Endpoint

```bash
GET /agent/limits
```

Returns current spending vs limits:
```json
{
  "limits": {
    "perTransaction": "$0.50",
    "daily": "$10.00",
    "weekly": "$50.00",
    "monthly": "$100.00"
  },
  "currentSpending": {
    "daily": "$2.50",
    "weekly": "$15.00",
    "monthly": "$45.00"
  },
  "remaining": {
    "daily": "$7.50",
    "weekly": "$35.00",
    "monthly": "$55.00"
  },
  "alerts": {
    "lowBalance": false,
    "dailyLimitNear": false
  }
}
```

### Additional Protections

| Protection | Description |
|------------|-------------|
| **AI Decision Layer** | Gemini evaluates each payment before approval |
| **Balance Check** | Agent verifies funds before signing |
| **CORS Whitelist** | Production restricts origins via `ALLOWED_ORIGINS` |
| **Request Size** | 1MB max body size |

## Business Model

Arcent is built for Day-1 monetization:

| Revenue Stream | Description |
|----------------|-------------|
| **Network Fee (1%)** | Small fee on successful settlements |
| **Premium Routing** | Priority processing for high-value agents |
| **Provider Staking** | Providers stake USDC to prove reliability (Roadmap) |

**Target Market:**
- Autonomous AI Agents (LangGraph, CrewAI, AutoGPT)
- AI SaaS platforms needing pay-per-call APIs
- Web3 infrastructure monetizing endpoints

*"Arcent is not for humans. It is for software that spends money."*

---

## Roadmap

### Phase 1: Foundation (Completed)
- [x] x402 protocol
- [x] Circle Wallets
- [x] Arc Network
- [x] Pay-on-Success
- [x] Multi-provider
- [x] Provider Scoring

### Phase 2: Persistence & Scale
- [ ] PostgreSQL transaction history
- [ ] Provider marketplace
- [ ] 10+ provider types

### Phase 3: Enterprise
- [ ] Multi-agent organizations
- [ ] Role-based budgets
- [ ] Compliance reporting

### Phase 4: Mainnet
- [ ] Arc Mainnet deployment
- [ ] $1M+ monthly volume
- [ ] 10,000+ agents

---

## License

MIT

---

## Resources

- [x402 Protocol](https://www.x402.org/)
- [Arc Network](https://www.arc.network/)
- [Circle Developers](https://developers.circle.com/)

---

<p align="center">
  <b>Arcent</b> — The economy machines were waiting for.
</p>
