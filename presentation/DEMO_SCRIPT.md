# ARCENT DEMO VIDEO SCRIPT
## Duration: 5 minutes
## For: Arc Network Hackathon Submission

---

## [0:00-0:30] INTRO

"Hi, I'm presenting Arcent — the first x402 payment implementation 
on Arc Network with Pay-on-Success atomic settlement.

Arcent enables AI agents to autonomously pay for API services 
using Circle Wallets and USDC micropayments — with zero human intervention."

---

## [0:30-1:00] PROBLEM

"Here's the problem: AI agents can't participate in the digital economy.

They can't have bank accounts. They can't pass KYC checks. 
They can't use credit cards or manage subscriptions.

The entire internet economy was built for humans — 
not for the billions of autonomous agents that will power the future."

---

## [1:00-1:30] SOLUTION

"Arcent solves this with native agent economy.

Using Circle's developer-controlled wallets and x402 protocol,
agents can now make real USDC micropayments on Arc Network.

No API keys needed. No rate limits. Just HTTP requests and crypto payments."

---

## [1:30-2:00] ARCHITECTURE

"Let me show you how it works.

For this demo and initial phase, our gateway runs three provider nodes:
Intelligence Node for AI-powered tasks like translation and summarization,
Market Data Node for real-time crypto prices from CoinGecko,
and Utility Node for weather data.

In the future, any developer can register their own x402-compliant API
and start earning USDC from agent traffic.

Each node returns HTTP 402 when payment is required."

---

## [2:00-3:00] DEMO - LIVE TASK

**[Screen: arcent.vercel.app - Agent Demo page]**

"Watch this agent execute a real task.

I'll ask: 'What is the current Bitcoin price?'

The agent analyzes the task, routes it to our Market Data Node,
receives a 402 Payment Required response,
evaluates the cost using AI reasoning,
signs a USDC payment authorization,
and executes the API call.

Notice the terminal: you can see each decision step,
the payment amount, and the transaction confirmation.

The whole flow takes under 2 seconds."

---

## [3:00-3:30] ATOMIC SETTLEMENT

"Here's our key innovation: Pay-on-Success.

Unlike standard x402 implementations that pay before service delivery,
Arcent's executor holds the payment signature 
until the API confirms successful response.

If the API fails or returns an error — no payment is executed.
Your funds are protected."

---

## [3:30-4:00] CIRCLE CONSOLE

**[Screen: Circle Developer Console + ArcScan]**

"Let me verify this transaction in Circle Developer Console.

Here's the transaction we just made — you can see the wallet,
the amount, and the timestamp matching our demo.

And here it is on ArcScan — confirmed on-chain in under one second
with a network fee of less than one cent."

---

## [4:00-4:30] TECHNICAL INNOVATION

"To summarize our technical innovations:

First: Atomic Settlement with service-first, payment-second architecture.
Second: Multi-provider routing with reliability scoring.
Third: Gasless transactions for agents — the executor pays network fees.
Fourth: Real-time AI decision-making for payment approval."

---

## [4:30-5:00] CLOSE

"Arcent makes AI agents first-class economic participants 
on Circle's Arc Network.

The code is open source on GitHub.
Live demo is running at arcent.vercel.app.

Thank you for watching. I'm excited to see what you'll build 
with agentic commerce."

---

## LINKS

- **GitHub:** https://github.com/cutepawss/arcent
- **Live Demo:** https://arcent.vercel.app
- **ArcScan:** https://testnet.arcscan.app

---

## VOICE-OVER TIPS

1. ElevenLabs recommended voices: "Adam" or "Antoni" (professional, clear)
2. Generate each section separately for better timing control
3. Export as MP3 and sync with screen recording
4. Total word count: ~450 words (approximately 4-5 minutes at natural pace)
