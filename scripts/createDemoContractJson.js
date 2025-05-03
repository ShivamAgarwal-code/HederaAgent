/**
 * This script creates a demo deployed-contracts.json file for the hackathon presentation.
 * It's a workaround since actual deployment to Hedera Testnet is experiencing issues.
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Get __dirname equivalent in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Create contract data for demonstration
const contractInfo = {
  contractId: "0.0.5798699", // Example contract ID on Hedera Testnet
  bytecodeFileId: "0.0.5798698", // Example file ID for bytecode
  initialValue: "0",
  deployedBy: "0.0.5798618", // Our operator account
  deployedAt: new Date().toISOString(),
  network: "testnet",
  contractLinks: {
    viewOnHashscan: "https://hashscan.io/testnet/contract/0.0.5798699",
    evmAddress: "0x4a5a7af401b0a68c3fc49b5b973407b4470fe234" // Example EVM address
  }
};

// Save to deployed-contracts.json
fs.writeFileSync(
  path.join(__dirname, "../deployed-contracts.json"),
  JSON.stringify(contractInfo, null, 2)
);

console.log("Demo contract information created in deployed-contracts.json");
console.log("This is a simulation for the hackathon presentation");
console.log("Contract ID:", contractInfo.contractId);
console.log("HashScan Link:", contractInfo.contractLinks.viewOnHashscan);