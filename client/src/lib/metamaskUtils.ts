/**
 * Utility functions for interacting with Atomic Wallet
 * (Using MetaMask under the hood for the hackathon demo)
 */

export interface WalletConnectionState {
  isConnected: boolean;
  address: string;
  chainId: string;
  balance: string;
  error: string | null;
}

const initialState: WalletConnectionState = {
  isConnected: false,
  address: '',
  chainId: '',
  balance: '0',
  error: null
};

/**
 * Check if Atomic Wallet is installed
 * (Using MetaMask check under the hood for the hackathon demo)
 */
export const isWalletInstalled = (): boolean => {
  return typeof window !== 'undefined' && 
    typeof window.ethereum !== 'undefined' && 
    window.ethereum.isMetaMask === true;
};

/**
 * Connect to Atomic Wallet
 */
export const connectWallet = async (): Promise<WalletConnectionState> => {
  try {
    // Check if wallet is installed
    if (!isWalletInstalled()) {
      return {
        ...initialState,
        error: 'Atomic Wallet is not installed. Please install Atomic Wallet first.'
      };
    }

    // Request accounts
    const accounts = await window.ethereum?.request({
      method: 'eth_requestAccounts'
    }) as string[] || [];

    if (accounts.length === 0) {
      return {
        ...initialState,
        error: 'No accounts found. Please make sure Atomic Wallet is unlocked and has at least one account.'
      };
    }

    // Get chain ID
    const chainId = await window.ethereum?.request({
      method: 'eth_chainId'
    }) as string || '';

    // Get balance
    const balance = await window.ethereum?.request({
      method: 'eth_getBalance',
      params: [accounts[0], 'latest']
    }) as string || '0x0';

    const balanceInEth = parseInt(balance, 16) / 1e18;

    const connectionState: WalletConnectionState = {
      isConnected: true,
      address: accounts[0],
      chainId: chainId,
      balance: balanceInEth.toFixed(4),
      error: null
    };

    // Notify UI components
    notifyConnectionUpdate(connectionState);
    
    // Save connection state to session storage
    sessionStorage.setItem('atomic_wallet_connection', JSON.stringify(connectionState));
    
    return connectionState;
  } catch (error: any) {
    console.error('Error connecting to Atomic Wallet:', error);
    
    // Handle user rejection explicitly (code 4001)
    if (error && error.code === 4001) {
      return {
        ...initialState,
        error: 'Atomic Wallet connection was rejected. Please approve the connection request in the Atomic Wallet popup.'
      };
    }
    
    return {
      ...initialState,
      error: error instanceof Error ? error.message : 'Failed to connect to Atomic Wallet'
    };
  }
};

/**
 * Disconnect from Atomic Wallet
 */
export const disconnectWallet = async (): Promise<boolean> => {
  try {
    // Clear session storage
    sessionStorage.removeItem('atomic_wallet_connection');
    
    // Notify UI
    const disconnectEvent = new CustomEvent('atomic-wallet-session-update', {
      detail: {
        isConnected: false
      }
    });
    window.dispatchEvent(disconnectEvent);
    
    return true;
  } catch (error) {
    console.error('Error disconnecting from Atomic Wallet:', error);
    return false;
  }
};

/**
 * Send transaction using Atomic Wallet
 */
export const sendTransaction = async (
  to: string,
  value: string
): Promise<string | null> => {
  try {
    if (!isWalletInstalled()) {
      throw new Error('Atomic Wallet is not installed');
    }

    const accounts = await window.ethereum?.request({
      method: 'eth_accounts'
    }) as string[] || [];

    if (accounts.length === 0) {
      throw new Error('No accounts found. Please connect to Atomic Wallet first.');
    }

    // Convert value to wei (1 ETH = 10^18 wei)
    const valueInWei = `0x${(parseFloat(value) * 1e18).toString(16)}`;

    const txHash = await window.ethereum?.request({
      method: 'eth_sendTransaction',
      params: [{
        from: accounts[0],
        to,
        value: valueInWei,
        gas: '0x5208', // 21000 gas
      }],
    }) as string || '';

    return txHash;
  } catch (error) {
    console.error('Error sending transaction:', error);
    return null;
  }
};

/**
 * Notify UI components about connection updates
 */
const notifyConnectionUpdate = (connection: WalletConnectionState): void => {
  if (connection.isConnected) {
    const updateEvent = new CustomEvent('atomic-wallet-session-update', {
      detail: {
        address: connection.address,
        balance: connection.balance,
        chainId: connection.chainId,
        isConnected: true
      }
    });
    window.dispatchEvent(updateEvent);
  }
};

/**
 * Set up Atomic Wallet event listeners
 */
export const setupWalletEvents = (): void => {
  if (typeof window !== 'undefined' && window.ethereum) {
    // Listen for account changes
    window.ethereum.on('accountsChanged', async (accounts: string[]) => {
      if (accounts.length === 0) {
        // User disconnected their account
        disconnectWallet();
      } else {
        // Account changed, update connection
        await connectWallet();
      }
    });

    // Listen for chain changes
    window.ethereum.on('chainChanged', async () => {
      // Chain changed, update connection
      await connectWallet();
    });
  }
};