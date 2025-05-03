import React, { useRef } from "react";
import Layout from "@/components/Layout";
import HeroSection from "@/components/HeroSection";
import AuditForm from "@/components/AuditForm";
import AuditResults from "@/components/AuditResults";
import ResourcesCard from "@/components/ResourcesCard";
import HederaInfo from "@/components/HederaInfo";
import DeployedContracts from "@/components/DeployedContracts";
// Now using custom inline Atomic Wallet component
import { useAudit } from "@/hooks/useAudit";
import { useWallet } from "@/hooks/useWallet";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import atomicWalletLogo from "../assets/atomic_wallet_logo_dark_rounded.png";

export default function Home() {
  const {
    contractSource,
    setContractSource,
    options,
    updateOption,
    result,
    isAnalyzing,
    error,
    analyzeSmartContract
  } = useAudit();
  
  const { wallet, isLoading, connectError, connectWallet, disconnectWallet } = useWallet();
  
  const auditSectionRef = useRef<HTMLDivElement>(null);
  const resourcesSectionRef = useRef<HTMLDivElement>(null);
  
  const scrollToAuditSection = () => {
    auditSectionRef.current?.scrollIntoView({ behavior: 'smooth' });
  };
  
  const scrollToResources = () => {
    resourcesSectionRef.current?.scrollIntoView({ behavior: 'smooth' });
  };
  
  // Atomic Wallet logo
  const AtomicWalletLogo = () => (
    <img 
      src={atomicWalletLogo} 
      alt="Atomic Wallet Logo"
      className="h-12 w-12 mb-4" 
    />
  );

  // Render the wallet connection notice if not connected
  const renderWalletConnectionNotice = () => {
    return (
      <Card className="mb-8 border-2 border-dashed border-primary/30">
        <CardContent className="pt-6 pb-6">
          <div className="flex flex-col items-center text-center">
            <AtomicWalletLogo />
            <h2 className="text-xl font-semibold mb-2">Atomic Wallet Required</h2>
            <p className="text-neutral-600 mb-4">
              Connect your Atomic Wallet to access the smart contract auditing tools.
              The audit functionality requires a wallet connection.
            </p>
            
            {connectError && (
              <div className="bg-red-50 border border-red-200 rounded p-3 mb-4 text-left w-full">
                <p className="text-red-700 text-sm font-medium">Connection Error</p>
                <p className="text-red-600 text-xs mt-1">{connectError}</p>
                <p className="text-red-500 text-xs mt-2">
                  If you rejected the connection request, please try again and approve the connection in the Atomic Wallet popup window.
                </p>
              </div>
            )}
            
            <Button 
              onClick={connectWallet} 
              disabled={isLoading}
              size="lg"
              className="gap-2 bg-neutral-900 text-white hover:bg-black shadow-md"
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
            
            <div className="mt-4 text-sm text-neutral-600">
              <p className="mb-2">When prompted, approve the connection request in your Atomic Wallet popup.</p>
              <a 
                href="https://atomicwallet.io/downloads" 
                target="_blank" 
                rel="noreferrer"
                className="text-primary underline text-sm hover:text-primary/80"
              >
                Don't have Atomic Wallet? Download it here
              </a>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };
  
  return (
    <Layout>
      <HeroSection 
        onStartAuditing={scrollToAuditSection} 
        onLearnMore={scrollToResources} 
      />
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Audit Input */}
        <div className="lg:col-span-2">
          <div ref={auditSectionRef}>
            {wallet.isConnected ? (
              <AuditForm
                contractSource={contractSource}
                onContractSourceChange={setContractSource}
                options={options}
                onOptionChange={updateOption}
                isAnalyzing={isAnalyzing}
                error={error}
                onSubmit={analyzeSmartContract}
              />
            ) : (
              renderWalletConnectionNotice()
            )}
          </div>
          
          {result && wallet.isConnected && <AuditResults result={result} />}
        </div>
        
        {/* Right Column: Resources & Info */}
        <div className="lg:col-span-1">
          <div ref={resourcesSectionRef}>
            <ResourcesCard />
          </div>
          
          <HederaInfo />
          
          {wallet.isConnected && (
            <div className="mt-6 p-4 border rounded-lg bg-white shadow-sm">
              <div className="flex items-center gap-3 mb-2">
                <img src={atomicWalletLogo} alt="Atomic Wallet" className="w-8 h-8" />
                <h3 className="text-lg font-medium">Atomic Wallet</h3>
              </div>
              <div className="text-sm text-gray-500">
                <p className="mb-1">Status: <span className="text-green-600 font-medium">Connected</span></p>
                <p className="mb-1">Address: {wallet.address.slice(0, 6)}...{wallet.address.slice(-4)}</p>
                <p>Network: <span className="text-blue-600 font-medium">testnet</span></p>
              </div>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}