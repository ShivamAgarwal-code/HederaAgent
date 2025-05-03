# HederaAgent

An advanced AI-powered smart contract auditing platform that combines cutting-edge technology with user-friendly design to enhance blockchain security and developer education. Built for the Hedera Hashgraph ecosystem.



## Project Overview

HederaAgent is an AI-powered tool integrated with Hedera Testnet that automatically audits smart contracts for vulnerabilities, inefficiencies, and compliance with best practices. Designed specifically for a hackathon with focused scope, it uses Google's Gemini 2.0 Flash model for sophisticated smart contract analysis. The project aims to enhance the security and reliability of decentralized applications by providing comprehensive contract auditing services.

## Features

- **AI-Powered Smart Contract Auditing**: Automatic detection of vulnerabilities, gas inefficiencies, and best practice violations
- **Hedera Testnet Integration**: Connects to Hedera Network for seamless blockchain interaction
- **Multi-wallet Support**: Integration with MetaMask (displayed as Atomic Wallet in the UI)
- **PDF Export**: Export audit reports as PDF documents
- **Social Media Sharing**: Share audit results on Twitter
- **Free Trial Option**: Test the audit functionality without connecting a wallet

## Tech Stack

- **Frontend**: TypeScript, React, Tailwind CSS, shadcn/ui components
- **Backend**: Node.js, Express.js
- **AI Integration**: Google's Gemini 2.0 Flash model
- **Blockchain**: Hedera Hashgraph (Testnet)

## Key Integration Files

### Hedera Integration

The Hedera integration code is primarily located in the following files:

- `scripts/deploy.js` - Script for deploying smart contracts to Hedera Testnet
- `scripts/deployContract.js` - Alternative deployment script with enhanced functionality
- `server/services/hederaService.ts` - Backend service for Hedera network interactions
- `client/src/lib/hederaUtils.ts` - Utility functions for Hedera operations
- `client/src/lib/hashpackUtils.ts` - HashPack wallet integration utilities
- `client/src/lib/hederaSnapUtils.ts` - Hedera Snap wallet integration utilities

### AI Analysis Integration

The AI-powered analysis code is located in:

- `server/services/auditService.ts` - Core audit service that analyzes smart contracts
- `server/services/geminiService.ts` - Integration with Google's Gemini 2.0 Flash model
- `client/src/hooks/useAudit.tsx` - React hook for frontend audit functionality

## Hedera Account Information(Smart contract deployment link)

- **Contract Account ID**: 0.0.5798618
- **HashScan Link**: [Hedera Testnet Account](https://hashscan.io/testnet/account/0.0.5798618?ps=1&pr=1&pa=1&pf=1&ph=1&pt=1&pc=1&pn=1&p2=1&p3=1&p1=1&k1=1743431620.578161000)

## We have used HederaAgentKit and Hedera Eliza Plugin.

**It is mentioned in the file content-1743400545979.md as part of the plugin repository: The plugin is designed to interact with the Hedera blockchain. It depends on the hedera-agent-kit library, which facilitates operations with the Hedera network.**

## How It Works

1. **User Authentication**: Connect your wallet (currently displaying as "Atomic Wallet" in the UI but using MetaMask under the hood)
2. **Smart Contract Submission**: Submit your smart contract code for analysis
3. **AI Analysis**: The backend processes the contract using sophisticated AI models
4. **Results Visualization**: View detailed audit report with categorized findings
5. **Export & Share**: Export results as PDF or share on social media

## Key Components

### Frontend Components

- `client/src/components/AuditForm.tsx` - Smart contract submission form with configuration options
- `client/src/components/AuditResults.tsx` - Results display with detailed findings visualization
- `client/src/pages/Home.tsx` - Main application page with wallet integration
- `client/src/pages/Trial.tsx` - Free trial page without wallet requirement

### Backend Services

- `server/routes.ts` - API endpoints for audit requests and Hedera interactions
- `server/services/auditService.ts` - Smart contract analysis service
- `server/services/geminiService.ts` - Gemini AI model integration

## Getting Started

### Prerequisites

- Node.js (v14+)
- API keys:
  - GEMINI_API_KEY: For Google's Gemini 2.0 Flash model
  - HEDERA_ACCOUNT_ID and HEDERA_PRIVATE_KEY: For Hedera Testnet integration

### Installation

1. Clone the repository
2. Install dependencies: `npm install`
3. Create a `.env` file with required keys:
   ```
   GEMINI_API_KEY=your_gemini_api_key
   HEDERA_ACCOUNT_ID=your_hedera_account_id
   HEDERA_PRIVATE_KEY=your_hedera_private_key
   ```
4. Start the application: `npm run dev`

## Usage Guide

### Contract Auditing

1. Connect your wallet using the "Connect Atomic Wallet" button
2. Navigate to the main auditing section
3. Paste your smart contract code in the editor
4. Select the audit options you want to run
5. Click "Analyze Contract" to start the audit
6. Review the detailed findings categorized by severity
7. Export results as PDF or share them on Twitter

### Free Trial

1. Click on "Try Without Wallet" to access the trial page
2. Paste a sample smart contract or use the provided example
3. Start the audit to see a demonstration of the analysis capabilities

## Acknowledgements

- Hedera Hashgraph for the blockchain infrastructure
- Google for the Gemini 2.0 Flash model
- The entire hackathon team for their contributions
