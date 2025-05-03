import React from "react";

export default function Footer() {
  return (
    <footer className="bg-neutral-900 text-neutral-300 py-8">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <div className="flex items-center space-x-2">
              <svg className="h-7 w-7 text-primary" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2L4 5v14l8 3 8-3V5l-8-3zm1 15.82l-2-.75V16.5h2v1.32zm0-3.32h-2V9.5h2v5z"/>
              </svg>
              <div>
                <h2 className="text-lg font-semibold text-white">HederaGuard</h2>
                <p className="text-xs">AI Smart Contract Auditor</p>
              </div>
            </div>
          </div>
          <div className="text-center md:text-right">
            <p className="text-sm">Built for Hedera Hackathon</p>
            <p className="text-xs mt-1">Running on Hedera Testnet</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
