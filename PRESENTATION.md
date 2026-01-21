# ARCENT
## Agentic Commerce on Arc Network

---

# 🎯 Executive Summary

**Arcent** is the first x402 payment implementation on Arc Network with **Pay-on-Success Protection**.

AI agents autonomously pay for API services using USDC micropayments — no human intervention, no credit cards, no subscriptions.

**Key Innovation:** Result-Validated Payment (Atomic Settlement)
- API is called FIRST
- Response is validated
- Payment executes ONLY on success
- Failed calls = zero cost to agent

---

# 📌 The Problem

## AI Agents Cannot Participate in the Economy

| Limitation | Impact |
|------------|--------|
| ❌ No bank accounts | Cannot store or transfer value |
| ❌ No KYC verification | Excluded from financial services |
| ❌ No credit cards | Cannot pay for SaaS/APIs |
| ❌ No subscription management | Cannot handle recurring payments |

**The internet economy was built for humans, not machines.**

Every API that requires payment is inaccessible to autonomous agents.

---

# 💡 The Solution

## Give Agents a Native Economy

| Capability | Implementation |
|------------|----------------|
| ✅ Programmable wallets | Circle Developer Controlled Wallets |
| ✅ HTTP payment protocol | x402 (HTTP 402 Payment Required) |
| ✅ Micropayments | USDC on Arc Network ($0.001 gas) |
| ✅ Pay-on-Success | Atomic Settlement with validation |
| ✅ Multi-provider routing | Reliability-based selection |

**Arcent makes AI agents first-class economic participants.**

---

# 🔧 Technical Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                      ARCENT SYSTEM                          │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  ┌──────────┐     ┌──────────────┐     ┌──────────────┐    │
│  │  Agent   │────▶│   Gateway    │────▶│  Providers   │    │
│  │  Client  │     │   (x402)     │     │  (APIs)      │    │
│  └──────────┘     └──────────────┘     └──────────────┘    │
│       │                  │                    │             │
│       │                  │                    │             │
│       ▼                  ▼                    ▼             │
│  ┌──────────┐     ┌──────────────┐     ┌──────────────┐    │
│  │  Circle  │     │   SQLite     │     │  Arc Network │    │
│  │  Wallet  │     │   (Audit)    │     │  (Settlement)│    │
│  └──────────┘     └──────────────┘     └──────────────┘    │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

# 🛡️ Key Innovation: Atomic Settlement

## The Problem with Standard x402

```
STANDARD x402 FLOW:
1. Agent sends payment ──────────▶
2. API processes request ────────▶
3. If API fails ─────────────────▶ Money LOST ❌
```

**Agents pay upfront and hope the API works.**

## Arcent's Pay-on-Success Flow

```
ARCENT FLOW:
1. Payment HELD (not executed) ──▶
2. API processes request ────────▶
3. Response VALIDATED ───────────▶
4. If valid ─────────────────────▶ Payment executes ✅
5. If invalid ───────────────────▶ Payment cancelled ✅
```

**Agents only pay for successful results.**

---

# 💻 Atomic Settlement: Code Implementation

```javascript
// gateway/server.js - Result-Validated Payment

// Step 1: Call API first (payment held)
const serviceResponse = await fetch(serviceUrl, {
    method: 'POST',
    body: JSON.stringify({ prompt: task })
});
const apiResult = await serviceResponse.json();

// Step 2: Validate response content
const hasValidContent = 
    apiResult.temperature ||  // Weather API
    apiResult.price ||        // Crypto API
    apiResult.translation ||  // Translation API
    apiResult.city;           // General API

// Step 3: Check for error conditions
const isErrorResult = !hasValidContent || 
    apiResult.model === 'fallback';

// Step 4: Execute payment ONLY on success
if (isErrorResult) {
    // NO PAYMENT - Agent funds protected
    return { 
        success: false, 
        paid: false, 
        atomicProtection: true 
    };
}

// Step 5: Service succeeded - release payment
const txResult = await arcExecutor.executeSimpleTransfer(
    provider.wallet,
    amount
);
```

---

# 🔄 Agent State Machine

Arcent agents operate as **finite-state economic actors**:

```
┌──────────┐
│   HOLD   │  Payment authorization created
└────┬─────┘
     │
     ▼
┌──────────┐
│ EXECUTE  │  API service called
└────┬─────┘
     │
     ▼
┌──────────┐
│ VALIDATE │  Response quality checked
└────┬─────┘
     │
     ├──────────────┐
     ▼              ▼
┌──────────┐  ┌──────────┐
│  SETTLE  │  │   VOID   │
│    ✅    │  │    ✅    │
└──────────┘  └──────────┘
Payment       Payment
executed      cancelled
```

---

# 🌐 Why Arc Network?

## Micropayments Require Low Gas Fees

| Network | Avg Gas Cost | $0.01 API Call |
|---------|-------------|----------------|
| Ethereum Mainnet | $0.50 - $5.00 | ❌ Unviable |
| Base | $0.01 - $0.05 | ⚠️ Marginal |
| **Arc Network** | **$0.0001** | ✅ **Viable** |

**Arc's sub-cent transaction costs make per-request micropayments economically feasible.**

## Arc Network Features Used

- ✅ Sub-second finality (<1s)
- ✅ USDC native support
- ✅ Predictable gas fees
- ✅ EVM compatibility
- ✅ Circle Wallet SDK support

---

# 🔗 Circle Integration

## Products Used

| Product | Purpose |
|---------|---------|
| **Developer Controlled Wallets** | Agent custody |
| **Programmable Wallets SDK** | Transaction signing |
| **USDC** | Payment currency |
| **Arc Network** | Settlement layer |

## Implementation

```javascript
// services/circleWallet.js

import { CircleWebSdk } from '@circle-fin/circle-web3-sdk';

const initializeCircle = () => {
    return new CircleWebSdk({
        apiKey: process.env.CIRCLE_API_KEY,
        entitySecret: process.env.CIRCLE_ENTITY_SECRET
    });
};

// Agent wallet creation
const createAgentWallet = async () => {
    return await sdk.createDeveloperControlledWallet({
        blockchain: 'ARC-TESTNET',
        walletSetId: process.env.CIRCLE_WALLET_SET_ID
    });
};
```

---

# 📊 Provider Scoring System

Agents learn which providers are reliable through real-time scoring:

```javascript
// Real-time reliability scoring
function getProviderScore(provider) {
    const stats = providerStats[provider];
    const total = stats.success + stats.failure;

    // Success rate (70% weight)
    const successRate = stats.success / total;

    // Latency score (30% weight) - lower is better
    const avgLatency = stats.totalLatency / total;
    const latencyScore = Math.max(0, 1 - (avgLatency / 5000));

    return (successRate * 0.7) + (latencyScore * 0.3);
}
```

**Provider scores directly influence routing weight, reducing capital waste over time.**

---

# 🗄️ Embedded SQL Persistence

Transaction history and provider stats persist across restarts:

```javascript
// db.js - SQLite Persistence

db.exec(`
  CREATE TABLE IF NOT EXISTS transactions (
    id INTEGER PRIMARY KEY,
    timestamp TEXT NOT NULL,
    provider TEXT NOT NULL,
    amount TEXT NOT NULL,
    tx_hash TEXT,
    status TEXT NOT NULL,
    latency_ms INTEGER
  );

  CREATE TABLE IF NOT EXISTS provider_stats (
    provider TEXT PRIMARY KEY,
    success INTEGER DEFAULT 0,
    failure INTEGER DEFAULT 0,
    total_latency_ms INTEGER DEFAULT 0
  );
`);
```

**API Endpoints:**
- `GET /transactions/history` — Full audit trail
- `GET /db/stats` — Database statistics
- `GET /providers/stats` — Reliability metrics

---

# 🎮 Multi-Provider Network

## Available Providers

| Provider | Service | Price/Call |
|----------|---------|------------|
| Oracle-Price-Feed | Crypto prices (CoinGecko) | $0.002 |
| Meteorology-Relay | Weather data (wttr.in) | $0.001 |
| LLM-Reasoning-01 | AI inference (Gemini) | $0.005 |
| Translate-Engine | Translation services | $0.003 |
| Sentiment-Analyzer | Text analysis | $0.003 |

## Intelligent Routing

```javascript
function routeTask(task) {
    if (task.includes('weather')) return 'WEATHER';
    if (task.includes('bitcoin') || task.includes('price')) return 'CRYPTO';
    if (task.includes('translate')) return 'TRANSLATION';
    return 'INTELLIGENCE';
}
```

---

# 📈 Performance Benchmarks

## Real Transaction Data

| Metric | Value |
|--------|-------|
| Average API Latency | 180-350ms |
| Arc Settlement Time | 800-1200ms |
| End-to-End (API + Settlement) | ~1.5s |
| Average Gas Cost | $0.0001 |

## Atomic Settlement Protection

| Scenario | Agent Cost |
|----------|------------|
| ✅ API Success | Pays provider |
| ❌ API Timeout | $0.00 |
| ❌ Invalid Response | $0.00 |
| ❌ Rate Limited | $0.00 |

---

# 🏗️ Technology Stack

## Backend
- **Runtime:** Node.js 18+
- **Framework:** Express.js
- **Database:** SQLite (better-sqlite3)
- **Blockchain:** Arc Network (ethers.js)

## Frontend
- **Framework:** React 18 + Vite
- **Styling:** Custom CSS (Design System)
- **Wallet:** MetaMask + Circle SDK

## Integrations
- **Circle Programmable Wallets**
- **Arc Network (EVM)**
- **Google Gemini API**
- **CoinGecko API**
- **wttr.in Weather API**

---

# 💼 Business Model

## Revenue Streams

| Stream | Description | Target |
|--------|-------------|--------|
| Network Fee | 0.5% on all transactions | $50K MRR at scale |
| Premium Routing | Priority provider access | Power users |
| Provider Staking | Quality assurance bonds | Provider network |

## Target Market

- **Autonomous AI Agents** (LangGraph, CrewAI, AutoGPT)
- **AI Platforms** offering pay-per-call APIs
- **Teams** delegating tasks to agents
- **DAOs** managing agent budgets

---

# 🛣️ Roadmap

## Phase 1: Foundation ✅
- x402 Gateway implementation
- Circle Wallet integration
- Arc Network deployment
- Atomic Settlement logic
- Provider Scoring system

## Phase 2: Growth (Q2 2026)
- PostgreSQL migration
- Provider onboarding portal
- Agent SDK release
- Multi-chain support

## Phase 3: Scale (Q3 2026)
- Mainnet deployment
- Provider staking mechanism
- Advanced routing algorithms
- Enterprise partnerships

---

# 🔐 Security

## Payment Security
- Atomic Settlement prevents fund loss
- Transaction verification on-chain
- Replay protection via nonces

## Agent Security
- Circle HSM key protection
- Configurable budget limits (daily/monthly)
- Per-transaction caps

## Audit Trail
- All transactions persisted to SQLite
- Full history available via API
- ArcScan verification links

---

# 📞 Circle Product Feedback

## What Worked Well
- ✅ Wallet creation flow — Simple API
- ✅ Transaction signing — Smooth ethers integration
- ✅ Arc testnet faucet — Reliable for development
- ✅ Documentation — Clear examples

## Improvement Suggestions
- EIP-3009 `transferWithAuthorization` support
- WebSocket API for real-time balance updates
- Batch operations for multi-transfer
- Agent-optimized wallet tier

---

# 🏆 Why Arcent Wins

| Criteria | Our Strength |
|----------|--------------|
| **Innovation** | Pay-on-Success is a new x402 primitive |
| **Technical Depth** | Full stack: wallet → gateway → settlement |
| **Arc Utilization** | Micropayments only viable on Arc |
| **Circle Integration** | Developer Controlled Wallets + USDC |
| **Demo Quality** | Polished UI with live transactions |
| **Completeness** | Persistence, scoring, routing, audit |

---

# 📎 Resources

- **GitHub:** github.com/ArcAgents/arcent
- **Demo:** localhost:5175 (local) / [deployed URL]
- **x402 Protocol:** x402.org
- **Arc Network:** arc.network

---

# 🙏 Thank You

**Arcent — Give AI agents a wallet, with rules.**

*No credit cards. No subscriptions.*
*Just agents, code, and money.*

---

**Contact:** [YOUR EMAIL]
**Console Email:** [YOUR CIRCLE CONSOLE EMAIL]
