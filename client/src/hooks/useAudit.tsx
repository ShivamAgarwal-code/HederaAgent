import { useState, useCallback } from "react";
import { AuditOptions, AuditResult } from "@/lib/types";
import { analyzeContract } from "@/lib/contractAnalysis";

// Default audit options
const defaultOptions: AuditOptions = {
  vulnerabilityScan: true,
  gasOptimization: true,
  bestPractices: true,
  aiRecommendations: true,
};

export function useAudit() {
  const [contractSource, setContractSource] = useState<string>("");
  const [options, setOptions] = useState<AuditOptions>(defaultOptions);
  const [result, setResult] = useState<AuditResult | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Update a specific option
  const updateOption = useCallback((key: keyof AuditOptions, value: boolean) => {
    setOptions(prev => ({ ...prev, [key]: value }));
  }, []);
  
  // Submit the contract for analysis
  const analyzeSmartContract = useCallback(async () => {
    if (!contractSource.trim()) {
      setError("Please enter or load a smart contract");
      return false;
    }
    
    try {
      setIsAnalyzing(true);
      setError(null);
      
      const auditResult = await analyzeContract(contractSource, options);
      setResult(auditResult);
      return true;
    } catch (err) {
      console.error("Error during contract analysis:", err);
      setError("Failed to analyze the smart contract. Please try again.");
      return false;
    } finally {
      setIsAnalyzing(false);
    }
  }, [contractSource, options]);
  
  // Reset the audit state
  const resetAudit = useCallback(() => {
    setContractSource("");
    setOptions(defaultOptions);
    setResult(null);
    setError(null);
  }, []);
  
  return {
    contractSource,
    setContractSource,
    options,
    updateOption,
    result,
    isAnalyzing,
    error,
    analyzeSmartContract,
    resetAudit,
  };
}
