/**
 * Utility functions for interacting with MetaMask and Hedera Wallet Snap
 */

// Hedera Snap ID
export const HEDERA_SNAP_ID = 'npm:@hashgraph/hedera-wallet-snap';

/**
 * Checks if the browser has MetaMask Flask installed
 */
export const isFlask = async (): Promise<boolean> => {
  try {
    if (typeof window.ethereum === 'undefined') {
      return false;
    }

    // Check for Flask by getting provider information
    const ethereum = window.ethereum;
    const clientVersion = await ethereum.request({
      method: 'web3_clientVersion',
    });

    if (typeof clientVersion === 'string') {
      const isFlaskDetected = clientVersion.includes('Flask');
      return isFlaskDetected;
    }
    return false;
  } catch (error) {
    console.error('Failed to detect MetaMask Flask:', error);
    return false;
  }
};

/**
 * Detects installed snaps in MetaMask
 */
export const detectSnaps = async (): Promise<Record<string, any>> => {
  try {
    if (typeof window.ethereum === 'undefined') {
      return {};
    }

    const ethereum = window.ethereum;
    const snaps = await ethereum.request({
      method: 'wallet_getSnaps',
    });

    return snaps || {};
  } catch (error) {
    console.error('Failed to retrieve installed snaps:', error);
    return {};
  }
};

/**
 * Gets the proper ID of the Hedera snap
 */
export const getSnapId = (): string => {
  return HEDERA_SNAP_ID;
};

/**
 * Enables access to MetaMask
 */
export const connectToMetaMask = async (): Promise<string[]> => {
  try {
    if (typeof window.ethereum === 'undefined') {
      throw new Error('MetaMask is not installed');
    }

    const ethereum = window.ethereum;
    const accounts = await ethereum.request({
      method: 'eth_requestAccounts',
    });

    return accounts;
  } catch (error) {
    console.error('Failed to connect to MetaMask:', error);
    throw error;
  }
};

/**
 * Installs the Hedera Wallet Snap in MetaMask
 */
export const installHederaSnap = async (): Promise<void> => {
  try {
    if (typeof window.ethereum === 'undefined') {
      throw new Error('MetaMask is not installed');
    }

    const ethereum = window.ethereum;
    await ethereum.request({
      method: 'wallet_requestSnaps',
      params: {
        [HEDERA_SNAP_ID]: {},
      },
    });
  } catch (error) {
    console.error('Failed to install Hedera Wallet Snap:', error);
    throw error;
  }
};

/**
 * Retrieves account information from the Hedera Wallet Snap
 */
export const getAccountInfo = async (network: 'testnet' | 'mainnet' = 'testnet') => {
  try {
    if (typeof window.ethereum === 'undefined') {
      throw new Error('MetaMask is not installed');
    }

    const ethereum = window.ethereum;
    const response = await ethereum.request({
      method: 'wallet_invokeSnap',
      params: {
        snapId: HEDERA_SNAP_ID,
        request: {
          method: 'hedera_getAccountInfo',
          params: {
            network,
          },
        },
      },
    });

    return response;
  } catch (error) {
    console.error('Failed to get account info from Hedera Wallet Snap:', error);
    throw error;
  }
};

/**
 * Transfers HBAR to a receiver
 */
export const transferHBAR = async (
  receiverAddress: string,
  amount: string,
  network: 'testnet' | 'mainnet' = 'testnet'
) => {
  try {
    if (typeof window.ethereum === 'undefined') {
      throw new Error('MetaMask is not installed');
    }

    const ethereum = window.ethereum;
    const receiver = receiverAddress.startsWith("0x") 
      ? { evmAddress: receiverAddress } 
      : { accountId: receiverAddress };

    const response = await ethereum.request({
      method: 'wallet_invokeSnap',
      params: {
        snapId: HEDERA_SNAP_ID,
        request: {
          method: 'hedera_transferCrypto',
          params: {
            network,
            assetType: 'HBAR',
            receiver,
            amount
          },
        },
      },
    });

    return response;
  } catch (error) {
    console.error('Failed to transfer HBAR:', error);
    throw error;
  }
};