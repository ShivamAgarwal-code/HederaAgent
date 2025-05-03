import React from "react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Shield } from "lucide-react";
import { useWallet } from "@/hooks/useWallet";
import WalletConnect from "@/components/WalletConnect";
import atomicWalletLogo from "../assets/atomic_wallet_logo_dark_rounded.png";

export default function Header() {
  const { wallet, isLoading, connectError, connectWallet, disconnectWallet } = useWallet();

  // Atomic Wallet logo
  const AtomicWalletLogo = () => (
    <img 
      src={atomicWalletLogo} 
      alt="Atomic Wallet Logo"
      className="h-5 w-5" 
    />
  );

  return (
    <header className="sticky top-0 z-50 w-full bg-white border-b border-gray-200 shadow-sm">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-2">
          <Link href="/">
            <div className="flex items-center gap-2">
              <Shield className="h-8 w-8 text-primary" />
              <span className="text-xl font-bold bg-gradient-to-r from-primary/90 to-primary/70 bg-clip-text text-transparent">
                HederaGuard
              </span>
            </div>
          </Link>
        </div>
        
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            className="border-primary hover:bg-primary/10 text-primary"
            onClick={() => window.location.href = '/trial'}
          >
            Start Free Trial
          </Button>
          <WalletConnect
            isConnected={wallet.isConnected}
            isLoading={isLoading}
            connectError={connectError}
            onConnect={connectWallet}
            onDisconnect={disconnectWallet}
          />
        </div>
      </div>
    </header>
  );
}