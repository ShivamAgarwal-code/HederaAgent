/**
 * Format account ID for display
 */
export function formatAccountId(accountId: string): string {
  if (!accountId) return '';
  
  // Account ID is already in a standard format (0.0.12345)
  if (accountId.includes('.')) {
    return accountId;
  }
  
  // Try to convert to standard format if it's a number
  try {
    const num = parseInt(accountId, 10);
    return `0.0.${num}`;
  } catch (e) {
    return accountId;
  }
}

/**
 * Format wallet address for display by truncating the middle
 */
export function formatAddress(address: string): string {
  if (!address) return '';
  
  if (address.startsWith('0x') && address.length > 10) {
    return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;
  }
  
  return address;
}

/**
 * Format HBAR balance for display
 */
export function formatHbarBalance(balance: string | number): string {
  if (!balance) return '0 HBAR';
  
  let numBalance: number;
  
  if (typeof balance === 'string') {
    numBalance = parseFloat(balance);
  } else {
    numBalance = balance;
  }
  
  // Format with 4 decimal places max
  return `${numBalance.toFixed(4)} HBAR`;
}

/**
 * Get Hedera network name
 */
export function getNetworkName(networkType: string): string {
  switch (networkType.toLowerCase()) {
    case 'mainnet':
      return 'Mainnet';
    case 'testnet':
      return 'Testnet';
    case 'previewnet':
      return 'Previewnet';
    default:
      return networkType;
  }
}

/**
 * Sample smart contract for demonstration
 */
export const sampleSmartContract = `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

/**
 * @title SimpleStorage
 * @dev A simple contract to store and retrieve a value
 */
contract SimpleStorage {
    uint256 private storedValue;
    address private owner;
    mapping(address => uint256) private balances;
    
    event ValueChanged(uint256 newValue);
    event FundsDeposited(address indexed from, uint256 amount);
    event FundsWithdrawn(address indexed to, uint256 amount);
    
    constructor() {
        owner = msg.sender;
    }
    
    modifier onlyOwner() {
        require(msg.sender == owner, "Not the contract owner");
        _;
    }
    
    function setValue(uint256 value) public {
        storedValue = value;
        emit ValueChanged(value);
    }
    
    function getValue() public view returns (uint256) {
        return storedValue;
    }
    
    function deposit() public payable {
        require(msg.value > 0, "Must send some value");
        balances[msg.sender] += msg.value;
        emit FundsDeposited(msg.sender, msg.value);
    }
    
    function withdraw(uint256 amount) public {
        require(balances[msg.sender] >= amount, "Insufficient balance");
        balances[msg.sender] -= amount;
        payable(msg.sender).transfer(amount);
        emit FundsWithdrawn(msg.sender, amount);
    }
    
    function getBalance() public view returns (uint256) {
        return balances[msg.sender];
    }
    
    function getTotalContractBalance() public view onlyOwner returns (uint256) {
        return address(this).balance;
    }
}`;