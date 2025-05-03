import React, { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, Wallet, Send } from "lucide-react";
import { detectSnaps, getSnapId, isFlask } from "../lib/hederaSnapUtils";
import { useToast } from "@/hooks/use-toast";

// Hedera Snap ID
const HEDERA_SNAP_ID = 'npm:@hashgraph/hedera-wallet-snap';

interface HederaSnapWalletProps {
  isConnected: boolean;
}

export default function HederaSnapWallet({ isConnected }: HederaSnapWalletProps) {
  const [hasMetaMask, setHasMetaMask] = useState<boolean>(false);
  const [isFlaskDetected, setIsFlaskDetected] = useState<boolean>(false);
  const [isSnapInstalled, setIsSnapInstalled] = useState<boolean>(false);
  const [snapAccount, setSnapAccount] = useState<string | null>(null);
  const [snapBalance, setSnapBalance] = useState<string | null>(null);
  const [snapNetwork, setSnapNetwork] = useState<string | null>(null);
  const [receiverAddress, setReceiverAddress] = useState<string>("");
  const [hbarAmount, setHbarAmount] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { toast } = useToast();

  // Check if MetaMask is installed
  useEffect(() => {
    const checkMetaMask = async () => {
      const metaMaskInstalled = typeof window.ethereum !== 'undefined' && window.ethereum.isMetaMask;
      setHasMetaMask(metaMaskInstalled);
      
      if (metaMaskInstalled) {
        const flaskDetected = await isFlask();
        setIsFlaskDetected(flaskDetected);
        
        if (flaskDetected) {
          const snaps = await detectSnaps();
          setIsSnapInstalled(!!snaps[HEDERA_SNAP_ID]);
        }
      }
    };
    
    checkMetaMask();
  }, []);

  // Connect to MetaMask
  const connectMetaMask = async () => {
    if (!hasMetaMask) {
      toast({
        title: "MetaMask is not installed",
        description: "Please install MetaMask to use this feature",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsLoading(true);
      // Request Ethereum accounts access
      if (typeof window.ethereum === 'undefined') {
        throw new Error('MetaMask is not installed');
      }
      
      const ethereum = window.ethereum;
      await ethereum.request({ method: 'eth_requestAccounts' });
      toast({
        title: "Connected to MetaMask",
        description: "You're now connected to MetaMask",
      });
    } catch (error) {
      console.error("Failed to connect to MetaMask:", error);
      toast({
        title: "Connection Failed",
        description: "Failed to connect to MetaMask",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Install Hedera Snap
  const installHederaSnap = async () => {
    if (!isFlaskDetected) {
      toast({
        title: "MetaMask Flask is required",
        description: "Please install MetaMask Flask to use Hedera integration",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsLoading(true);
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
      
      setIsSnapInstalled(true);
      toast({
        title: "Hedera Snap Installed",
        description: "Hedera Wallet Snap has been installed successfully",
      });
    } catch (error) {
      console.error("Failed to install Hedera Snap:", error);
      toast({
        title: "Installation Failed",
        description: "Failed to install Hedera Wallet Snap",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Get Hedera Snap Account
  const getSnapAccount = async () => {
    if (!isSnapInstalled) {
      toast({
        title: "Hedera Snap not installed",
        description: "Please install Hedera Wallet Snap first",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsLoading(true);
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
              network: 'testnet',
            },
          },
        },
      });

      if (response) {
        // Set account details
        setSnapAccount(response.id || response.evmAddress);
        setSnapBalance(response.balance ? `${response.balance} HBAR` : '0 HBAR');
        setSnapNetwork('Testnet');
        
        toast({
          title: "Account Retrieved",
          description: "Successfully retrieved Hedera account information",
        });
      }
    } catch (error) {
      console.error("Failed to get Hedera account:", error);
      toast({
        title: "Account Retrieval Failed",
        description: "Failed to get Hedera account information",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Transfer HBAR
  const transferHBAR = async () => {
    if (!isSnapInstalled) {
      toast({
        title: "Hedera Snap not installed",
        description: "Please install Hedera Wallet Snap first",
        variant: "destructive",
      });
      return;
    }

    if (!receiverAddress) {
      toast({
        title: "Receiver address required",
        description: "Please enter a valid Hedera account ID or EVM address",
        variant: "destructive",
      });
      return;
    }

    if (!hbarAmount || parseFloat(hbarAmount) <= 0) {
      toast({
        title: "Invalid amount",
        description: "Please enter a valid HBAR amount",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsLoading(true);
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
              network: 'testnet',
              assetType: 'HBAR',
              receiver,
              amount: hbarAmount
            },
          },
        },
      });

      console.log("Transfer response:", response);
      toast({
        title: "Transfer Successful",
        description: `Successfully transferred ${hbarAmount} HBAR to ${receiverAddress}`,
      });
      
      // Refresh account info after transfer
      await getSnapAccount();
    } catch (error) {
      console.error("Failed to transfer HBAR:", error);
      toast({
        title: "Transfer Failed",
        description: "Failed to transfer HBAR. Please check your inputs and try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (!isConnected) {
    return (
      <Card className="mb-6">
        <CardContent className="pt-6">
          <h3 className="text-lg font-medium mb-4">Hedera MetaMask Integration</h3>
          <p className="text-sm text-neutral-700 mb-4">
            Connect your wallet first to enable Hedera integration with MetaMask Snap.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="mb-6">
      <CardContent className="pt-6">
        <h3 className="text-lg font-medium mb-4">Hedera MetaMask Integration</h3>
        
        {!hasMetaMask ? (
          <div className="text-center py-6 border border-dashed border-neutral-300 rounded-lg">
            <p className="text-sm text-neutral-700 mb-4">
              MetaMask Flask is required for Hedera Snap integration
            </p>
            <div className="flex flex-col gap-2 items-center">
              <Button 
                variant="default" 
                onClick={() => window.open("https://metamask.io/flask/", "_blank")}
                className="w-full sm:w-auto"
              >
                Install MetaMask Flask
              </Button>
              <p className="text-xs text-neutral-600 mt-2">
                For this hackathon demo, you can also use the simulated wallet experience below.
              </p>
              <Button 
                variant="outline" 
                onClick={() => {
                  setHasMetaMask(true);
                  setIsFlaskDetected(true);
                  setIsSnapInstalled(true);
                  setSnapAccount("0.0.5798618");
                  setSnapBalance("150 HBAR");
                  setSnapNetwork("Testnet");
                  toast({
                    title: "Demo Mode Active",
                    description: "Using simulated wallet for demonstration",
                  });
                }}
                className="w-full sm:w-auto mt-2"
              >
                Use Demo Wallet
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            {/* MetaMask Connection */}
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <div>
                  <h4 className="font-medium text-sm">Connect MetaMask</h4>
                  <p className="text-xs text-neutral-600">Connect to your MetaMask wallet</p>
                </div>
                <Button 
                  onClick={connectMetaMask} 
                  disabled={isLoading}
                  size="sm"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Connecting...
                    </>
                  ) : (
                    <>
                      <Wallet className="h-4 w-4 mr-2" />
                      Connect
                    </>
                  )}
                </Button>
              </div>
            </div>

            {/* Hedera Snap Installation */}
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <div>
                  <h4 className="font-medium text-sm">Install Hedera Snap</h4>
                  <p className="text-xs text-neutral-600">
                    {isFlaskDetected 
                      ? "Install Hedera Wallet Snap extension" 
                      : "Requires MetaMask Flask version"}
                  </p>
                </div>
                <Button 
                  onClick={installHederaSnap} 
                  disabled={isLoading || !isFlaskDetected || isSnapInstalled}
                  size="sm"
                  variant={isSnapInstalled ? "outline" : "default"}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Installing...
                    </>
                  ) : isSnapInstalled ? (
                    "Installed"
                  ) : (
                    "Install Snap"
                  )}
                </Button>
              </div>
              {!isFlaskDetected && (
                <p className="text-xs text-warning">
                  <a 
                    href="https://metamask.io/flask/" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="underline"
                  >
                    Install MetaMask Flask
                  </a> to use Hedera Snap features
                </p>
              )}
            </div>

            {/* Get Account Info */}
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <div>
                  <h4 className="font-medium text-sm">Get Hedera Account</h4>
                  <p className="text-xs text-neutral-600">Retrieve your Hedera account info</p>
                </div>
                <Button 
                  onClick={getSnapAccount} 
                  disabled={isLoading || !isSnapInstalled}
                  size="sm"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Loading...
                    </>
                  ) : (
                    "Get Account"
                  )}
                </Button>
              </div>
            </div>

            {/* Account Info */}
            {snapAccount && (
              <div className="bg-neutral-100 p-4 rounded-lg">
                <h4 className="font-medium text-sm mb-2">Hedera Account Info</h4>
                <div className="space-y-1 text-sm">
                  <p><span className="text-neutral-600">Account:</span> {snapAccount}</p>
                  <p><span className="text-neutral-600">Balance:</span> {snapBalance}</p>
                  <p><span className="text-neutral-600">Network:</span> {snapNetwork}</p>
                </div>
              </div>
            )}

            {/* Transfer HBAR */}
            {isSnapInstalled && (
              <div className="border-t border-neutral-200 pt-4 mt-4">
                <h4 className="font-medium text-sm mb-3">Transfer HBAR</h4>
                <div className="space-y-3">
                  <div className="space-y-1">
                    <Label htmlFor="receiver">Receiver Account ID or EVM Address</Label>
                    <Input
                      id="receiver"
                      placeholder="0.0.123456 or 0x..."
                      value={receiverAddress}
                      onChange={(e) => setReceiverAddress(e.target.value)}
                    />
                  </div>
                  <div className="space-y-1">
                    <Label htmlFor="amount">Amount (HBAR)</Label>
                    <Input
                      id="amount"
                      type="number"
                      step="0.01"
                      min="0"
                      placeholder="0.01"
                      value={hbarAmount}
                      onChange={(e) => setHbarAmount(e.target.value)}
                    />
                  </div>
                  <Button 
                    onClick={transferHBAR} 
                    disabled={isLoading || !receiverAddress || !hbarAmount}
                    className="w-full"
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Processing...
                      </>
                    ) : (
                      <>
                        <Send className="h-4 w-4 mr-2" />
                        Send HBAR
                      </>
                    )}
                  </Button>
                </div>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}