import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ExternalLink, Code, FileCode, CheckCircle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

interface DeployedContract {
  contractId: string;
  bytecodeFileId: string;
  initialValue: string;
  deployedBy: string;
  deployedAt: string;
  network: string;
  contractLinks?: {
    viewOnHashscan?: string;
    evmAddress?: string;
  };
}

export default function DeployedContracts() {
  const [contracts, setContracts] = useState<DeployedContract[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Fetch from our API endpoint
    fetch('/api/hedera/contracts')
      .then(response => {
        if (!response.ok) {
          throw new Error('Failed to fetch deployed contracts');
        }
        return response.json();
      })
      .then(data => {
        // Handle both array and single object formats
        const contractsArray = Array.isArray(data) ? data : [data];
        setContracts(contractsArray);
        setLoading(false);
      })
      .catch(err => {
        console.error('Error loading deployed contracts:', err);
        setError('Failed to load deployed contracts. Please try again later.');
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Deployed Contracts</CardTitle>
          <CardDescription>Loading deployed smart contracts...</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex justify-center p-4">
            <div className="h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Deployed Contracts</CardTitle>
        </CardHeader>
        <CardContent>
          <Alert variant="destructive">
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    );
  }

  if (contracts.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Deployed Contracts</CardTitle>
          <CardDescription>No contracts have been deployed yet</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center p-4 text-gray-500">
            <FileCode className="mx-auto h-10 w-10 mb-2 text-gray-400" />
            <p>Deploy a smart contract to see it listed here</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CheckCircle className="h-5 w-5 text-green-500" />
          Deployed Contracts
        </CardTitle>
        <CardDescription>
          Smart contracts deployed to Hedera Testnet
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {contracts.map((contract, index) => (
            <div key={index} className="border rounded-lg p-4">
              <div className="flex flex-wrap justify-between items-start mb-2">
                <h3 className="text-lg font-medium">Counter Contract</h3>
                <span className="text-xs bg-green-100 text-green-800 rounded-full px-2 py-1">
                  {contract.network}
                </span>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
                <div>
                  <p className="text-sm font-medium text-gray-500">Contract ID</p>
                  <p className="font-mono text-sm">{contract.contractId}</p>
                </div>
                {contract.contractLinks?.evmAddress && (
                  <div>
                    <p className="text-sm font-medium text-gray-500">EVM Address</p>
                    <p className="font-mono text-sm">{contract.contractLinks.evmAddress}</p>
                  </div>
                )}
                <div>
                  <p className="text-sm font-medium text-gray-500">Bytecode File</p>
                  <p className="font-mono text-sm">{contract.bytecodeFileId}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Deployed By</p>
                  <p className="font-mono text-sm">{contract.deployedBy}</p>
                </div>
              </div>
              
              <div className="border-t pt-3 mt-3">
                <p className="text-sm font-medium text-gray-500">Deployed At</p>
                <p className="text-sm">{new Date(contract.deployedAt).toLocaleString()}</p>
              </div>
              
              {contract.contractLinks?.viewOnHashscan && (
                <div className="mt-4">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="text-xs"
                    onClick={() => window.open(contract.contractLinks!.viewOnHashscan, '_blank')}
                  >
                    <ExternalLink className="h-3 w-3 mr-1" />
                    View on HashScan
                  </Button>
                </div>
              )}
            </div>
          ))}
        </div>
      </CardContent>
      <CardFooter className="border-t pt-4 text-xs text-gray-500">
        <p>
          These smart contracts were deployed for the HederaGuard AI Agent hackathon project. 
          The contracts are used for demonstrating integration with the Hedera network.
        </p>
      </CardFooter>
    </Card>
  );
}