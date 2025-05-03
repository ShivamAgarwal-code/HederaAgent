import React from "react";
import { WalletInfo } from "@/lib/types";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatAddress, formatAccountId, formatHbarBalance } from "@/lib/hederaUtils";

interface WalletCardProps {
  wallet: WalletInfo;
}

export default function WalletCard({ wallet }: WalletCardProps) {
  if (!wallet.isConnected) {
    return null;
  }
  
  const isDemoWallet = wallet.accountId === "0.0.5798618" && wallet.balance === "150";
  
  return (
    <Card className="mb-6">
      <CardContent className="pt-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium">Connected Wallet</h3>
          {isDemoWallet ? (
            <Badge variant="outline" className="bg-amber-100 text-amber-800 hover:bg-amber-100">Demo Mode</Badge>
          ) : (
            <Badge variant="outline" className="bg-emerald-100 text-emerald-800 hover:bg-emerald-100">Atomic Wallet</Badge>
          )}
        </div>
        <div className="flex items-center space-x-3 mb-4">
          <div className="h-10 w-10 bg-neutral-100 rounded-full flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-neutral-700" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M18 8a6 6 0 01-7.743 5.743L10 14l-1 1-1 1H6v-1l1-1 1-1 .257-.257A6 6 0 1118 8zm-6-4a1 1 0 100 2h2a1 1 0 100-2h-2z" clipRule="evenodd" />
            </svg>
          </div>
          <div>
            <p className="font-medium text-sm">{formatAddress(wallet.address || '')}</p>
            <p className="text-xs text-neutral-700">Account ID: {formatAccountId(wallet.accountId || '')}</p>
          </div>
        </div>
        <div className="pt-4 border-t border-neutral-200">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm text-neutral-700">Network</span>
            <span className="text-sm font-medium">{wallet.network}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-neutral-700">Balance</span>
            <span className="text-sm font-medium">{formatHbarBalance(wallet.balance || '0')} HBAR</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
