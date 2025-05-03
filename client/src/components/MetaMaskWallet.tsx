import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useWallet } from "@/hooks/useWallet";
import { formatAddress } from "@/lib/hederaUtils";

interface MetaMaskWalletProps {
  isConnected: boolean;
}

export default function MetaMaskWallet({ isConnected }: MetaMaskWalletProps) {
  const { wallet, disconnectWallet } = useWallet();

  // MetaMask logo SVG
  const MetaMaskLogo = () => (
    <svg 
      className="h-5 w-5" 
      viewBox="0 0 35 33" 
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M32.9582 1L19.8241 10.7183L22.2667 4.99099L32.9582 1Z" fill="#E17726" stroke="#E17726" strokeWidth="0.25" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M2.66699 1L15.6636 10.8511L13.3603 4.99098L2.66699 1Z" fill="#E27625" stroke="#E27625" strokeWidth="0.25" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M28.2222 23.5283L24.6977 28.8912L32.0182 30.9352L34.1613 23.6536L28.2222 23.5283Z" fill="#E27625" stroke="#E27625" strokeWidth="0.25" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M1.4707 23.6536L3.60046 30.9352L10.9117 28.8912L7.39649 23.5283L1.4707 23.6536Z" fill="#E27625" stroke="#E27625" strokeWidth="0.25" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M10.5128 14.5089L8.44688 17.6803L15.6634 18.023L15.4049 10.1916L10.5128 14.5089Z" fill="#E27625" stroke="#E27625" strokeWidth="0.25" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M24.9863 14.509L20.0127 10.0586L19.824 18.0229L27.0523 17.6802L24.9863 14.509Z" fill="#E27625" stroke="#E27625" strokeWidth="0.25" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M10.9116 28.8916L15.1784 26.7208L11.485 23.6969L10.9116 28.8916Z" fill="#E27625" stroke="#E27625" strokeWidth="0.25" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M19.4209 26.7208L23.6975 28.8916L23.1144 23.6969L19.4209 26.7208Z" fill="#E27625" stroke="#E27625" strokeWidth="0.25" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );

  if (!isConnected) {
    return null;
  }

  return (
    <Card className="mt-8">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg font-semibold">
          <MetaMaskLogo />
          MetaMask Wallet
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {wallet.isConnected && (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-500">Connected Address</span>
                <Badge variant="outline" className="font-mono text-xs">
                  {formatAddress(wallet.address)}
                </Badge>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-500">Balance</span>
                <Badge variant="outline" className="text-xs">
                  {wallet.balance} ETH
                </Badge>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-500">Network</span>
                <Badge variant="outline" className="text-xs">
                  {wallet.network === 'testnet' ? 'Testnet' : 'Mainnet'}
                </Badge>
              </div>
              
              <div className="flex justify-between mt-4">
                <Button
                  variant="outline"
                  size="sm"
                  className="gap-1 text-xs"
                  onClick={() => window.open(`https://etherscan.io/address/${wallet.address}`, '_blank')}
                >
                  View in Explorer
                  <ExternalLink className="h-3 w-3" />
                </Button>
                
                <Button
                  variant="destructive"
                  size="sm"
                  className="gap-1 text-xs"
                  onClick={disconnectWallet}
                >
                  Disconnect
                </Button>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}