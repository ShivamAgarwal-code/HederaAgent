import React from "react";

interface HeroSectionProps {
  onStartAuditing: () => void;
  onLearnMore: () => void;
}

export default function HeroSection({ onStartAuditing, onLearnMore }: HeroSectionProps) {
  return (
    <section className="mb-10">
      <div className="bg-gradient-to-r from-primary to-primary-light rounded-2xl p-8 text-white">
        <div className="max-w-2xl">
          <h2 className="text-3xl font-semibold mb-4">Automatic Smart Contract Auditing for Hedera</h2>
          <p className="text-white/90 mb-6">
            Enhance the security and reliability of your decentralized applications with AI-powered smart contract analysis. 
            Identify vulnerabilities, inefficiencies, and compliance issues before deployment.
          </p>
          <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4">
            <button
              onClick={onStartAuditing}
              className="px-6 py-3 bg-white text-primary rounded-lg font-medium hover:bg-neutral-100 transition-colors"
            >
              Start Auditing
            </button>
            <button
              onClick={onLearnMore}
              className="px-6 py-3 bg-primary-dark/30 text-white rounded-lg border border-white/30 font-medium hover:bg-primary-dark/50 transition-colors"
            >
              Learn More
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
