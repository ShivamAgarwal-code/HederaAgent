import React, { useRef } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Loader2, Flame, Sparkles } from "lucide-react";
import { AuditOptions } from "@/lib/types";
import { sampleSmartContract } from "@/lib/hederaUtils";

interface AuditFormProps {
  contractSource: string;
  onContractSourceChange: (source: string) => void;
  options: AuditOptions;
  onOptionChange: (key: keyof AuditOptions, value: boolean) => void;
  isAnalyzing: boolean;
  error: string | null;
  onSubmit: () => Promise<boolean>;
}

export default function AuditForm({
  contractSource,
  onContractSourceChange,
  options,
  onOptionChange,
  isAnalyzing,
  error,
  onSubmit
}: AuditFormProps) {
  const auditOptions = [
    {
      id: "vulnerabilityScan",
      label: "Vulnerability Scan",
      description: "Check for common security vulnerabilities"
    },
    {
      id: "gasOptimization",
      label: "Gas Optimization",
      description: "Identify gas inefficiencies"
    },
    {
      id: "bestPractices",
      label: "Best Practices",
      description: "Review for coding best practices"
    },
    {
      id: "aiRecommendations",
      label: "AI Recommendations",
      description: "Use Google's Gemini AI for advanced analysis"
    }
  ];
  
  const handleOptionChange = (id: string, checked: boolean) => {
    onOptionChange(id as keyof AuditOptions, checked);
  };
  
  const handleLoadSample = () => {
    onContractSourceChange(sampleSmartContract);
  };
  
  const handleSubmit = async () => {
    await onSubmit();
  };
  
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  
  return (
    <Card id="audit-section" className="mb-8">
      <CardContent className="pt-6">
        <div className="flex items-center mb-4">
          <h2 className="text-xl font-semibold mr-2">Smart Contract Audit</h2>
          {options.aiRecommendations && (
            <Badge variant="secondary" className="bg-purple-100 text-purple-800 hover:bg-purple-200">
              <Sparkles className="h-3 w-3 mr-1" />
              AI-Powered
            </Badge>
          )}
        </div>
        
        <div className="mb-6">
          <div className="flex justify-between mb-2">
            <Label htmlFor="contract-input" className="text-sm font-medium text-neutral-700">
              Solidity Smart Contract Code
            </Label>
            <Button 
              variant="link" 
              size="sm" 
              className="text-sm text-primary hover:text-primary-dark"
              onClick={handleLoadSample}
            >
              Load Sample
            </Button>
          </div>
          <Textarea
            id="contract-input"
            ref={textareaRef}
            rows={15}
            value={contractSource}
            onChange={(e) => onContractSourceChange(e.target.value)}
            placeholder="// Paste your Solidity smart contract code here"
            className="w-full px-3 py-2 text-neutral-800 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary font-mono text-sm"
          />
          {error && (
            <p className="mt-2 text-sm text-error">{error}</p>
          )}
        </div>
        
        <div className="mb-6">
          <h3 className="text-sm font-medium text-neutral-700 mb-2">Audit Options</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {auditOptions.map((option) => (
              <div key={option.id} className="flex items-start space-x-2">
                <Checkbox
                  id={option.id}
                  checked={options[option.id as keyof AuditOptions]}
                  onCheckedChange={(checked) => 
                    handleOptionChange(option.id, checked as boolean)
                  }
                  className="mt-1"
                />
                <div>
                  <Label
                    htmlFor={option.id}
                    className="block text-sm font-medium text-neutral-800"
                  >
                    {option.label}
                  </Label>
                  <p className="text-xs text-neutral-700">{option.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        <div className="mt-6">
          <Button
            className="w-full py-6"
            onClick={handleSubmit}
            disabled={isAnalyzing || !contractSource.trim()}
          >
            {isAnalyzing ? (
              <>
                <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                Analyzing...
              </>
            ) : (
              <>
                <Flame className="h-5 w-5 mr-2" />
                Analyze Smart Contract
              </>
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
