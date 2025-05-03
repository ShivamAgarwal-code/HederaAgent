import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";

// Import wallet utilities
import { 
  connectWallet, 
  disconnectWallet as disconnectWalletFunc, 
  setupWalletEvents, 
  isWalletInstalled,
  type WalletConnectionState
} from "@/lib/metamaskUtils";

interface Wallet {
  isConnected: boolean;
  address: string;
  accountId: string;
  balance: string;
  network: string;
}

// Default wallet state
const defaultWalletState: Wallet = {
  isConnected: false,
  address: "",
  accountId: "",
  balance: "0",
  network: "testnet",
};

export function useWallet() {
  const [wallet, setWallet] = useState<Wallet>(defaultWalletState);
  const [isLoading, setIsLoading] = useState(false);
  const [connectError, setConnectError] = useState<string | null>(null);
  const { toast } = useToast();

  // Try to restore session from storage
  useEffect(() => {
    const restoreSession = () => {
      try {
        const savedSession = sessionStorage.getItem('atomic_wallet_connection');
        if (savedSession) {
          const session = JSON.parse(savedSession) as WalletConnectionState;
          if (session.isConnected && session.address) {
            setWallet({
              isConnected: true,
              address: session.address,
              accountId: "",
              balance: session.balance || "0",
              network: session.chainId === '0x2a' ? 'testnet' : 'mainnet',
            });
            return true;
          }
        }
        return false;
      } catch (e) {
        console.error("Error restoring session:", e);
        return false;
      }
    };

    const sessionRestored = restoreSession();
    
    // If session not restored, try auto-connect
    if (!sessionRestored) {
      // Auto-connect if Atomic Wallet is already connected
      if (isWalletInstalled() && window.ethereum) {
        window.ethereum.request({ method: 'eth_accounts' })
          .then((accounts: string[]) => {
            if (accounts && accounts.length > 0) {
              connectUserWallet();
            }
          })
          .catch(console.error);
      }
    }
  }, []);

  useEffect(() => {
    // Set up event listener for wallet connection updates
    const handleSessionUpdate = (e: CustomEvent) => {
      const { isConnected, address, balance, chainId } = e.detail;
      
      if (isConnected) {
        setWallet({
          isConnected: true,
          address: address,
          accountId: "", // Will be filled if using Hedera
          balance: balance || "0",
          network: chainId === '0x2a' ? 'testnet' : 'mainnet',
        });
      } else {
        setWallet(defaultWalletState);
      }
    };

    // Setup Atomic Wallet event listeners
    setupWalletEvents();
    
    window.addEventListener('atomic-wallet-session-update', handleSessionUpdate as EventListener);
    
    return () => {
      window.removeEventListener('atomic-wallet-session-update', handleSessionUpdate as EventListener);
    };
  }, []);

  const connectUserWallet = async () => {
    try {
      setIsLoading(true);
      setConnectError(null);
      
      const walletState = await connectWallet();
      
      if (walletState.isConnected) {
        setWallet({
          isConnected: true,
          address: walletState.address,
          accountId: "", // Will be filled if using Hedera
          balance: walletState.balance,
          network: walletState.chainId === '0x2a' ? 'testnet' : 'mainnet',
        });
        
        toast({
          title: "Wallet Connected",
          description: "Successfully connected to Atomic Wallet",
        });
        
        return true;
      } else if (walletState.error) {
        // Special handling for user rejection
        if (walletState.error.includes("rejected")) {
          setConnectError(walletState.error);
          toast({
            variant: "destructive",
            title: "Connection Rejected",
            description: "You need to approve the connection request in Atomic Wallet. Please try again.",
          });
        } else {
          setConnectError(walletState.error);
          throw new Error(walletState.error);
        }
      }
      
      return false;
    } catch (error) {
      console.error("Error connecting wallet:", error);
      setConnectError(error instanceof Error ? error.message : "Failed to connect wallet");
      
      toast({
        variant: "destructive",
        title: "Connection Failed",
        description: error instanceof Error ? error.message : "Failed to connect wallet",
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const disconnectUserWallet = async () => {
    try {
      setIsLoading(true);
      setConnectError(null);
      
      const success = await disconnectWalletFunc();
      
      if (success) {
        setWallet(defaultWalletState);
        
        toast({
          title: "Wallet Disconnected",
          description: "Successfully disconnected wallet",
        });
      }
    } catch (error) {
      console.error("Error disconnecting wallet:", error);
      toast({
        variant: "destructive",
        title: "Disconnection Failed",
        description: error instanceof Error ? error.message : "Failed to disconnect wallet",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return {
    wallet,
    isLoading,
    connectError,
    connectWallet: connectUserWallet,
    disconnectWallet: disconnectUserWallet,
  };
}