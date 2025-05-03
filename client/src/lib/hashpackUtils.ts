/**
 * Simplified HashPack utilities for hackathon demonstration
 * 
 * This implementation provides a realistic HashPack wallet connection
 * experience without the complex API dependencies that can cause issues.
 */

// HashPack connection state
export interface HashPackConnectionState {
  topic: string;
  pairingString: string;
  pairedAccounts: string[];
  isConnected: boolean;
  accountId: string;
  network: string;
  error: string | null;
}

// Initialize with default values
const initialState: HashPackConnectionState = {
  topic: '',
  pairingString: '',
  pairedAccounts: [],
  isConnected: false,
  accountId: '',
  network: 'testnet',
  error: null
};

// Saved connection state in localStorage
const STORAGE_KEY = 'hederaguard-wallet-connection';

// Read connection from storage
const getStoredConnection = (): HashPackConnectionState | null => {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (data) {
      return JSON.parse(data);
    }
  } catch (e) {
    console.error('Error reading stored connection:', e);
  }
  return null;
};

// Save connection to storage
const saveConnection = (state: HashPackConnectionState): void => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (e) {
    console.error('Error saving connection:', e);
  }
};

// Clear stored connection
const clearStoredConnection = (): void => {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (e) {
    console.error('Error clearing connection:', e);
  }
};

/**
 * Initialize HashPack connection
 * @returns Promise with HashPackConnectionState
 */
export const initializeHashConnect = async (): Promise<HashPackConnectionState> => {
  // Check for existing connection
  const storedConnection = getStoredConnection();
  if (storedConnection && storedConnection.isConnected) {
    notifyConnectionUpdate(storedConnection);
    return storedConnection;
  }
  
  return {
    ...initialState
  };
};

/**
 * Connect to HashPack wallet
 * @returns Promise with HashPackConnectionState
 */
export const connectToHashPack = async (): Promise<HashPackConnectionState> => {
  try {
    // Check for existing connection first
    const storedConnection = getStoredConnection();
    if (storedConnection && storedConnection.isConnected) {
      notifyConnectionUpdate(storedConnection);
      return storedConnection;
    }
    
    // For hackathon demonstration - simulate connection
    // In a production app, you would:
    // 1. Check if HashPack extension is installed
    // 2. Connect to the extension via its API
    // 3. Get account details
    
    // Simulate connection delay for realism
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Create a connection with the Hedera Testnet account
    const connection: HashPackConnectionState = {
      topic: 'hashpack-connection-' + Date.now(),
      pairingString: '',
      pairedAccounts: ['0.0.5798618'],
      isConnected: true,
      accountId: '0.0.5798618',
      network: 'testnet',
      error: null
    };
    
    // Save the connection
    saveConnection(connection);
    
    // Notify UI components about the connection
    notifyConnectionUpdate(connection);
    
    return connection;
  } catch (error) {
    console.error('Error connecting to HashPack:', error);
    return { 
      ...initialState, 
      error: 'Failed to connect to HashPack wallet'
    };
  }
};

/**
 * Disconnect from HashPack wallet
 */
export const disconnectFromHashPack = async (): Promise<boolean> => {
  try {
    // Clear stored connection
    clearStoredConnection();
    
    // Notify UI about disconnection
    const disconnectEvent = new CustomEvent('hashpack-session-update', {
      detail: {
        isConnected: false
      }
    });
    window.dispatchEvent(disconnectEvent);
    
    return true;
  } catch (error) {
    console.error('Error disconnecting from HashPack:', error);
    return false;
  }
};

/**
 * Notify UI components about connection updates
 */
const notifyConnectionUpdate = (connection: HashPackConnectionState): void => {
  if (connection.isConnected) {
    const updateEvent = new CustomEvent('hashpack-session-update', {
      detail: {
        accountId: connection.accountId,
        balance: "100.0", // For hackathon demo
        network: connection.network,
        isConnected: true
      }
    });
    window.dispatchEvent(updateEvent);
  }
};

/**
 * Check if HashPack extension is installed
 */
export const isHashPackInstalled = (): boolean => {
  // For hackathon demonstration
  return true;
};

/**
 * Get Hedera account info
 */
export const getHashPackAccountInfo = async (
  accountId: string
): Promise<any> => {
  if (!accountId) return null;
  
  // For hackathon demonstration
  return {
    accountId,
    network: 'testnet'
  };
};

/**
 * Get account balance
 */
export const getHashPackBalance = async (
  accountId: string
): Promise<string | null> => {
  if (!accountId) return null;
  
  // For hackathon demonstration
  return "100.0";
};