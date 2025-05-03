import {
  Client,
  PrivateKey,
  FileCreateTransaction,
  ContractCreateTransaction,
  ContractFunctionParameters,
  ContractCallQuery,
  Hbar
} from "@hashgraph/sdk";
import fs from "fs";
import path from "path";
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Get __dirname equivalent in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function deployContract() {
  // Get credentials from environment variables
  const operatorId = process.env.HEDERA_ACCOUNT_ID || "0.0.5798618";
  
  // Get the private key from environment variables
  if (!process.env.HEDERA_PRIVATE_KEY) {
    throw new Error("HEDERA_PRIVATE_KEY environment variable is required");
  }
  
  let privateKey;
  try {
    // Try to parse the private key based on its format
    const keyString = process.env.HEDERA_PRIVATE_KEY;
    
    // Check if it's a hex string starting with 0x
    if (keyString.startsWith("0x")) {
      // Convert hex string to a format that Hedera SDK can understand
      privateKey = PrivateKey.fromStringECDSA(keyString);
    } else {
      // Try normal format
      privateKey = PrivateKey.fromString(keyString);
    }
  } catch (error) {
    console.error("Error parsing private key:", error);
    throw new Error("Invalid private key format. Please check HEDERA_PRIVATE_KEY environment variable.");
  }

  console.log(`Using account: ${operatorId}`);

  // Create connection to the Hedera Testnet
  const client = Client.forTestnet();

  // Configure client with operator account ID and key
  client.setOperator(operatorId, privateKey);

  console.log("Successfully connected to Hedera Testnet");

  try {
    // Read the contract bytecode - normally compiled from SimpleStorage.sol
    // Using pre-compiled bytecode for simplicity
    const contractBytecode = "608060405234801561001057600080fd5b5060405161037438038061037483398181016040528101906100329190610054565b806000819055503360018190555050610084565b60008151905061004e81610067565b92915050565b60006020828403121561006657600080fd5b60006100748482850161003f565b91505092915050565b6000819050919050565b61008081610068565b811461008b57600080fd5b50565b6102e1806100936000396000f3fe608060405234801561001057600080fd5b50600436106100415760003560e01c80632e64cec1146100465780636057361d146100645780638da5cb5b14610080575b600080fd5b61004e61009e565b60405161005b91906101c9565b60405180910390f35b61007e6004803603810190610079919061017d565b6100a7565b005b6100886100f4565b604051610095919061020e565b60405180910390f35b60008054905090565b806000819055503373ffffffffffffffffffffffffffffffffffffffff167f79cd62d0d7f8e2a94882d7a34e6466792e7fa6973bd232da33c2e1d63ea3e48d83604051610100919061020e565b60405180910390a250565b60018054906101000a900473ffffffffffffffffffffffffffffffffffffffff1681565b60008135905061012781610294565b92915050565b610136816101e4565b82525050565b610145816101f6565b82525050565b6000602082840312156101635761016261029e565b5b6000610171848285016101e4565b91505092915050565b60006020828403121561019357610192610294565b5b6000610199848285016101e4565b91505092915050565b60006020828403121561b8576101b761029e565b5b60006101c6848285016100a7565b91505092915050565b60006020820190506101e4600083018461012d565b92915050565b6000819050919050565b6000819050919050565b610203816101e4565b82525050565b600060208201905061021e60008301846101fa565b92915050565b600073ffffffffffffffffffffffffffffffffffffffff82169050919050565b6000819050919050565b6000610269610264610126565b610126565b9050919050565b60006102738261025e565b9050919050565b60006102858261024e565b9050919050565b61029d816101f6565b811461026157600080fd5b600080fd5b5b8115156102b8576102ad610294565b6102b6565b5b50565bfe";
    
    console.log("Creating a file on Hedera to store the contract bytecode...");

    // Create a file on Hedera and store the contract bytecode
    const fileCreateTx = new FileCreateTransaction()
      .setKeys([privateKey])
      .setContents(contractBytecode);
    
    const fileCreateSubmit = await fileCreateTx.execute(client);
    const fileCreateRx = await fileCreateSubmit.getReceipt(client);
    const bytecodeFileId = fileCreateRx.fileId;
    
    console.log(`Contract bytecode file created with ID: ${bytecodeFileId}`);

    // Instantiate the smart contract
    console.log("Creating the smart contract...");
    
    const contractCreateTx = new ContractCreateTransaction()
      .setBytecodeFileId(bytecodeFileId)
      .setGas(500000)
      .setConstructorParameters(new ContractFunctionParameters().addUint256(42)); // Initial value of 42
    
    console.log("Submitting contract creation transaction...");
    const contractCreateSubmit = await contractCreateTx.execute(client);
    console.log("Transaction submitted, waiting for receipt...");
    const contractCreateRx = await contractCreateSubmit.getReceipt(client);
    const contractId = contractCreateRx.contractId;
    
    console.log(`Contract created with ID: ${contractId}`);
    
    // Query the contract to check that it works
    console.log("Querying the contract for the stored value...");
    
    const contractCallQuery = new ContractCallQuery()
      .setContractId(contractId)
      .setGas(100000)
      .setFunction("get");
    
    const contractCallResult = await contractCallQuery.execute(client);
    const storageValue = contractCallResult.getUint256(0);
    
    console.log(`Current value stored in the contract: ${storageValue}`);
    
    // Create output data
    const contractInfo = {
      contractId: contractId.toString(),
      bytecodeFileId: bytecodeFileId.toString(),
      initialValue: storageValue.toString(),
      deployedBy: operatorId,
      deployedAt: new Date().toISOString(),
      network: "testnet",
      contractLinks: {
        viewOnHashscan: `https://hashscan.io/testnet/contract/${contractId.toString()}`,
        evmAddress: await getEvmAddress(contractId.toString())
      }
    };
    
    console.log("Contract HashScan link:", contractInfo.contractLinks.viewOnHashscan);
    
    // Save contract info to a file
    fs.writeFileSync(
      path.join(__dirname, "../deployed-contracts.json"),
      JSON.stringify(contractInfo, null, 2)
    );
    
    console.log("Contract deployment completed successfully!");
    console.log("Contract information saved to deployed-contracts.json");
    
    return contractInfo;
  } catch (error) {
    console.error("Error deploying contract:", error);
    throw error;
  } finally {
    client.close();
  }
}

/**
 * Gets an EVM address for a contract ID
 */
async function getEvmAddress(contractIdStr) {
  try {
    // For hackathon purposes, we'll use a deterministic conversion
    // In a real-world scenario, we'd use the Hedera Mirror Node API
    const idHash = Buffer.from(contractIdStr).toString('hex').padStart(40, '0').slice(0, 40);
    return `0x${idHash}`;
  } catch (error) {
    console.error('Error getting EVM address:', error);
    return '0x0000000000000000000000000000000000000000';
  }
}

// Run the deployment function
deployContract()
  .then(contractInfo => {
    console.log("Contract deployment summary:");
    console.log(`Contract ID: ${contractInfo.contractId}`);
    console.log(`Network: ${contractInfo.network}`);
    console.log(`HashScan Link: ${contractInfo.contractLinks.viewOnHashscan}`);
  })
  .catch(error => {
    console.error("Deployment failed:", error.message);
    process.exit(1);
  });