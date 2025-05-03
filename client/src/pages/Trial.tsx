import React, { useState, useRef } from "react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { sampleSmartContract } from "@/lib/hederaUtils";
import Layout from "@/components/Layout";
import { AuditResult } from "@shared/schema";
import { Shield, CheckCircle2, AlertTriangle, Sparkles, FileText, Share2 } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import html2pdf from 'html2pdf.js';

export default function Trial() {
  const [contractSource, setContractSource] = useState(sampleSmartContract);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<AuditResult | null>(null);
  const { toast } = useToast();
  const reportRef = useRef<HTMLDivElement>(null);
  
  // Function to export the report as PDF
  const exportReport = () => {
    if (!reportRef.current || !result) return;
    
    const element = reportRef.current;
    const opt = {
      margin: [10, 10, 10, 10],
      filename: `hederaguard-trial-report-${new Date().toISOString().split('T')[0]}.pdf`,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2, useCORS: true },
      jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
    };
    
    toast({
      title: "Generating PDF",
      description: "Your report is being prepared for download...",
    });
    
    html2pdf().set(opt).from(element).save().then(() => {
      toast({
        title: "Report Downloaded",
        description: "Your audit report has been successfully exported as PDF."
      });
    });
  };
  
  // Function to share on Twitter
  const shareOnTwitter = () => {
    if (!result) return;
    
    const text = `I just audited my smart contract with HederaGuard AI and got a security score of ${result.securityScore.toFixed(1)}/10 with ${result.issuesCount} issues detected. Try the free trial! #SmartContractSecurity #HederaGuard`;
    const url = "https://hederaguard-ai-agent.replit.app/";
    
    const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`;
    window.open(twitterUrl, '_blank');
    
    toast({
      title: "Share on Twitter",
      description: "Twitter sharing window has been opened.",
      variant: "default"
    });
  };

  const handleSourceChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setContractSource(e.target.value);
  };

  const handleAudit = async () => {
    try {
      setIsAnalyzing(true);
      setError(null);
      
      const response = await apiRequest<AuditResult>({
        method: "POST",
        url: "/api/audit",
        data: {
          contractSource,
          options: {
            vulnerabilityScan: true,
            gasOptimization: true,
            bestPractices: true,
            aiRecommendations: true,
          },
        },
      });
      
      setResult(response);
      
      toast({
        title: "Analysis Complete",
        description: "Smart contract analysis completed successfully.",
      });
      
      return true;
    } catch (err: any) {
      console.error("Error analyzing contract:", err);
      setError(err?.message || "Failed to analyze smart contract");
      
      toast({
        variant: "destructive",
        title: "Analysis Failed",
        description: err?.message || "Failed to analyze smart contract",
      });
      
      return false;
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <Layout>
      <div className="container py-8">
        <div className="flex flex-col items-center justify-center mb-8">
          <div className="flex items-center gap-2 mb-2">
            <Shield className="h-12 w-12 text-primary" />
            <h1 className="text-3xl font-bold bg-gradient-to-r from-primary/90 to-primary/70 bg-clip-text text-transparent">
              HederaGuard Free Trial
            </h1>
          </div>
          <p className="text-gray-600 text-center max-w-2xl">
            Try our smart contract auditing service without connecting your wallet. 
            This free trial gives you a preview of our advanced analysis capabilities.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <Card className="w-full">
            <CardHeader>
              <CardTitle>Smart Contract</CardTitle>
              <CardDescription>Paste your smart contract code below for analysis</CardDescription>
            </CardHeader>
            <CardContent>
              <Textarea
                value={contractSource}
                onChange={handleSourceChange}
                className="font-mono h-[500px]"
                placeholder="Paste your smart contract code here..."
              />
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button 
                variant="outline" 
                onClick={() => setContractSource(sampleSmartContract)}
              >
                Use Sample Contract
              </Button>
              <Button 
                onClick={handleAudit}
                disabled={isAnalyzing || !contractSource}
                className="gap-2"
              >
                {isAnalyzing ? (
                  <>
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                    <span>Analyzing...</span>
                  </>
                ) : (
                  <>Analyze Contract</>
                )}
              </Button>
            </CardFooter>
          </Card>

          <Card className="w-full">
            <CardHeader>
              <CardTitle>
                {result ? "Analysis Results" : "Results will appear here"}
              </CardTitle>
              <CardDescription>
                {result 
                  ? `Found ${result.issuesCount} issues in the contract`
                  : "Submit your contract to see the analysis results"}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md mb-4">
                  {error}
                </div>
              )}
              
              {result ? (
                <div className="space-y-4" ref={reportRef}>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-gray-50 p-4 rounded-md">
                      <p className="text-lg font-semibold">Security Score</p>
                      <div className="flex items-center gap-2">
                        <p className="text-2xl font-bold">{result.securityScore.toFixed(1)}/10</p>
                        {result.securityScore >= 7 ? (
                          <CheckCircle2 className="text-green-500 h-5 w-5" />
                        ) : (
                          <AlertTriangle className="text-amber-500 h-5 w-5" />
                        )}
                      </div>
                    </div>
                    
                    <div className="bg-gray-50 p-4 rounded-md">
                      <p className="text-lg font-semibold">Gas Efficiency</p>
                      <div className="flex items-center gap-2">
                        <p className="text-2xl font-bold">{result.gasEfficiency.toFixed(1)}/10</p>
                        {result.gasEfficiency >= 7 ? (
                          <CheckCircle2 className="text-green-500 h-5 w-5" />
                        ) : (
                          <AlertTriangle className="text-amber-500 h-5 w-5" />
                        )}
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-semibold mb-2">Key Findings Summary</h3>
                    <p className="text-gray-600">
                      {result.findings.length === 0 
                        ? "No issues found in the contract. Great job!" 
                        : `Found ${result.findings.length} issues that should be addressed.`}
                    </p>
                    
                    <div className="mt-4 space-y-3">
                      {result.findings.slice(0, 3).map((finding) => (
                        <div key={finding.id} className="border rounded-md p-3 bg-gray-50">
                          <p className="font-medium">{finding.title}</p>
                          <p className="text-sm text-gray-600 mt-1">{finding.description.substring(0, 120)}...</p>
                        </div>
                      ))}
                      
                      {result.findings.length > 3 && (
                        <p className="text-sm text-gray-500">
                          {result.findings.length - 3} more issues found. Connect your wallet for full details.
                        </p>
                      )}
                    </div>
                  </div>
                  
                  {/* AI Summary Section for Trial Version */}
                  <div className="mt-6 bg-purple-50 border border-purple-100 rounded-md p-4">
                    <div className="flex items-center space-x-2 mb-2">
                      <Sparkles className="h-4 w-4 text-purple-600" />
                      <h4 className="font-medium text-purple-800">AI Analysis Overview</h4>
                    </div>
                    <p className="text-sm text-gray-700">
                      {result.findings.length > 0 
                        ? `This contract has ${result.findings.length} issues that need attention. Based on our analysis, 
                          the most important improvements would focus on security best practices and potential vulnerability fixes.`
                        : `Your smart contract appears to be well-structured. No significant issues were detected 
                          during our trial analysis. For comprehensive security verification, use the full audit with wallet connection.`
                      }
                    </p>
                  </div>
                  
                  {/* Export info */}
                  <div className="mt-4 text-xs text-gray-500 border-t pt-4">
                    <p>Trial results can be exported and shared. For comprehensive analysis, connect your wallet for a full audit.</p>
                  </div>
                </div>
              ) : (
                <div className="h-[400px] flex items-center justify-center border border-dashed rounded-md">
                  <p className="text-gray-400">Results will appear here after analysis</p>
                </div>
              )}
            </CardContent>
            {result && (
              <CardFooter className="justify-between">
                <div className="flex gap-2">
                  <Button 
                    variant="outline" 
                    className="flex items-center gap-1 text-primary border-primary text-sm"
                    onClick={exportReport}
                  >
                    <FileText className="h-4 w-4" />
                    Export PDF
                  </Button>
                  <Button 
                    variant="outline" 
                    className="flex items-center gap-1 text-primary border-primary text-sm"
                    onClick={shareOnTwitter}
                  >
                    <Share2 className="h-4 w-4" />
                    Share
                  </Button>
                </div>
                <Link href="/">
                  <Button>
                    Connect wallet for full audit
                  </Button>
                </Link>
              </CardFooter>
            )}
          </Card>
        </div>
      </div>
    </Layout>
  );
}