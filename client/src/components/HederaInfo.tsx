import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";

export default function HederaInfo() {
  return (
    <Card className="mb-6">
      <CardContent className="pt-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium">Hedera Network</h3>
          <Badge variant="outline" className="text-xs bg-primary/10 text-primary">
            Deep Integration
          </Badge>
        </div>
        <p className="text-sm text-neutral-700 mb-4">
          Hedera is a public network that offers developers a blockchain alternative that eliminates the need to choose between performance and security. 
        </p>
        
        <Accordion type="single" collapsible className="w-full">
          <AccordionItem value="connecting">
            <AccordionTrigger className="text-sm font-medium">
              Connecting to Hedera
            </AccordionTrigger>
            <AccordionContent className="text-sm">
              <p className="mb-2">For this demo, you can connect using:</p>
              <ul className="list-disc pl-5 space-y-1">
                <li>MetaMask with Hedera Snap (Recommended)</li>
                <li>Atomic Wallet (Alternative)</li>
                <li>Demo Wallet (For hackathon testing)</li>
              </ul>
              <p className="mt-2">The app is connected to Hedera Testnet.</p>
              <div className="mt-3 text-xs">
                <a 
                  href="https://docs.tuum.tech/hedera-wallet-snap" 
                  target="_blank" 
                  rel="noreferrer"
                  className="text-primary hover:underline flex items-center"
                >
                  Learn about Hedera Wallet Snap →
                </a>
              </div>
            </AccordionContent>
          </AccordionItem>
          
          <AccordionItem value="network">
            <AccordionTrigger className="text-sm font-medium">
              Network Information
            </AccordionTrigger>
            <AccordionContent className="text-sm">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Network Name:</span>
                  <span className="font-medium">Hedera Testnet</span>
                </div>
                <div className="flex justify-between">
                  <span>Chain ID:</span>
                  <span className="font-medium">0x128 (296)</span>
                </div>
                <div className="flex justify-between">
                  <span>RPC URL:</span>
                  <span className="font-medium">https://testnet.hashio.io/api</span>
                </div>
                <div className="flex justify-between">
                  <span>Explorer:</span>
                  <a 
                    href="https://hashscan.io/testnet" 
                    target="_blank" 
                    rel="noreferrer"
                    className="font-medium text-primary hover:underline"
                  >
                    HashScan Testnet
                  </a>
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>
          
          <AccordionItem value="deepIntegration">
            <AccordionTrigger className="text-sm font-medium">
              Deep Hedera Integration
            </AccordionTrigger>
            <AccordionContent className="text-sm">
              <div className="space-y-3">
                <div>
                  <h4 className="font-medium mb-1">Hedera Consensus Service (HCS)</h4>
                  <p className="text-neutral-700">
                    We utilize HCS for real-time event logging of security vulnerabilities, providing 
                    an immutable and transparent record of detected issues.
                  </p>
                </div>
                
                <div>
                  <h4 className="font-medium mb-1">Hedera Token Service (HTS)</h4>
                  <p className="text-neutral-700">
                    Our incentive-based reward system leverages HTS to distribute bug bounty rewards 
                    for detected vulnerabilities, encouraging community participation in security audits.
                  </p>
                </div>
                
                <div>
                  <h4 className="font-medium mb-1">Mirror Nodes</h4>
                  <p className="text-neutral-700">
                    We track and analyze historical smart contract performance using Hedera's Mirror Nodes, 
                    helping identify patterns in vulnerabilities and providing insights for improved security.
                  </p>
                </div>

                <div className="pt-2">
                  <a 
                    href="https://docs.hedera.com/hedera/sdks-and-apis/sdks" 
                    target="_blank" 
                    rel="noreferrer"
                    className="text-primary hover:underline text-xs flex items-center"
                  >
                    Learn more about Hedera's services →
                  </a>
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </CardContent>
    </Card>
  );
}