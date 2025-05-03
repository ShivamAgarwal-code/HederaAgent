import React from "react";
import { Button } from "@/components/ui/button";
import { formatAddress } from "@/lib/hederaUtils";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { isWalletInstalled } from "@/lib/metamaskUtils";
import atomicWalletLogo from "../assets/atomic_wallet_logo_dark_rounded.png";

interface WalletConnectProps {
  isConnected: boolean;
  isLoading: boolean;
  onConnect: () => Promise<boolean> | boolean | void;
  onDisconnect: () => void;
  connectError?: string | null;
}

export default function WalletConnect({
  isConnected,
  isLoading,
  onConnect,
  onDisconnect,
  connectError = null,
}: WalletConnectProps) {
  // Check if wallet is installed (using MetaMask check under the hood)
  const isWalletAvailable = isWalletInstalled();

  // Atomic Wallet logo image
  const AtomicWalletLogo = () => (
    <img 
      src={atomicWalletLogo} 
      alt="Atomic Wallet Logo"
      className="h-5 w-5" 
    />
  );

  // For non-installed wallet
  if (!isWalletAvailable && !isConnected) {
    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <a 
              href="https://atomicwallet.io/downloads" 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-gray-300 hover:bg-gray-50 text-black h-10 px-4 py-2"
            >
              <AtomicWalletLogo />
              <span className="ml-2">Install Atomic Wallet</span>
            </a>
          </TooltipTrigger>
          <TooltipContent className="max-w-xs">
            <p>You need to install the Atomic Wallet to use this feature.</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  }

  return (
    <div className="relative">
      {isConnected ? (
        <Button
          onClick={onDisconnect}
          variant="outline"
          className="border-red-300 hover:bg-red-50 text-red-600 font-medium"
        >
          <AtomicWalletLogo />
          <span className="ml-2">Disconnect</span>
        </Button>
      ) : (
        <TooltipProvider>
          <Tooltip open={!!connectError}>
            <TooltipTrigger asChild>
              <Button
                onClick={onConnect}
                disabled={isLoading}
                variant="outline"
                className="border-primary border hover:bg-primary/10 text-primary font-medium"
              >
                {isLoading ? (
                  <div className="flex items-center gap-2">
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-gray-500 border-t-transparent"></div>
                    <span>Connecting...</span>
                  </div>
                ) : (
                  <>
                    <AtomicWalletLogo />
                    <span className="ml-2">Connect Atomic Wallet</span>
                  </>
                )}
              </Button>
            </TooltipTrigger>
            <TooltipContent className="max-w-xs bg-red-50 border border-red-200">
              <p className="text-red-800 text-xs">
                {connectError || "Please approve the connection request in your Atomic Wallet popup"}
              </p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      )}
      
      {/* Add wallet help text for improved UX */}
      {!isConnected && !isLoading && (
        <div className="mt-2 text-xs text-gray-500 absolute right-0 top-[100%] mt-2 bg-white p-2 rounded-md shadow-sm border border-gray-100 w-[260px]">
          <p>Click to connect your Atomic Wallet. When prompted, approve the connection request in the Atomic Wallet popup.</p>
          <a 
            href="https://atomicwallet.io/downloads" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-primary hover:underline text-xs block mt-1 font-medium"
          >
            Need Atomic Wallet? Download here →
          </a>
        </div>
      )}
    </div>
  );
}