import React, { useRef } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { AuditResult, Finding, SeverityLevel } from "@/lib/types";
import { AlertTriangle, Info, AlertCircle, Sparkles, FileText, Share2 } from "lucide-react";
import { getSeverityStyles, getStatusStyles } from "@/lib/contractAnalysis";
import { useToast } from "@/hooks/use-toast";
import html2pdf from 'html2pdf.js';
import { saveAs } from 'file-saver';

interface AuditResultsProps {
  result: AuditResult;
}

export default function AuditResults({ result }: AuditResultsProps) {
  if (!result) {
    return null;
  }
  
  const { securityScore, issuesCount, gasEfficiency, findings } = result;
  // Get status styles with properly mapped class names
  const statusStyles = getStatusStyles(securityScore);
  const { toast } = useToast();
  const reportRef = useRef<HTMLDivElement>(null);
  
  const getSeverityIcon = (severity: SeverityLevel) => {
    switch (severity) {
      case SeverityLevel.CRITICAL:
      case SeverityLevel.HIGH:
        return <AlertTriangle className="h-4 w-4" />;
      case SeverityLevel.MEDIUM:
        return <AlertCircle className="h-4 w-4" />;
      default:
        return <Info className="h-4 w-4" />;
    }
  };
  
  // Function to export the report as PDF
  const exportReport = () => {
    if (!reportRef.current) return;
    
    const element = reportRef.current;
    const opt = {
      margin: [10, 10, 10, 10],
      filename: `smart-contract-audit-report-${new Date().toISOString().split('T')[0]}.pdf`,
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
    const text = `I just audited my smart contract with HederaGuard AI and got a security score of ${securityScore}/100 with ${issuesCount} issues detected. #SmartContractSecurity #HederaGuard #Web3Security`;
    const url = "https://hederaguard-ai-agent.replit.app/";
    
    const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`;
    window.open(twitterUrl, '_blank');
    
    toast({
      title: "Share on Twitter",
      description: "Twitter sharing window has been opened.",
      variant: "default"
    });
  };
  
  return (
    <Card id="results-section" className="mb-8">
      <CardContent className="pt-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Audit Results</h2>
          <div className="flex space-x-2">
            <Button 
              variant="outline" 
              className="text-sm text-primary border-primary flex items-center gap-1"
              onClick={exportReport}
            >
              <FileText className="h-4 w-4" />
              Export Report
            </Button>
            <Button 
              variant="outline" 
              className="text-sm text-primary border-primary flex items-center gap-1"
              onClick={shareOnTwitter}
            >
              <Share2 className="h-4 w-4" />
              Share
            </Button>
          </div>
        </div>
        
        {/* Wrap content in a div with ref for PDF export */}
        <div ref={reportRef}>
        
        <div className="flex items-center justify-between bg-neutral-100 rounded-lg p-4 mb-6">
          <div className="flex flex-col sm:flex-row sm:space-x-5 space-y-3 sm:space-y-0">
            <div className="text-center">
              <div className="text-sm text-neutral-700">Security Score</div>
              <div className={`text-2xl font-semibold ${
                securityScore >= 90 ? "text-success" : 
                securityScore >= 75 ? "text-info" : "text-warning"
              }`}>
                {securityScore}/100
              </div>
            </div>
            <div className="text-center">
              <div className="text-sm text-neutral-700">Issues Found</div>
              <div className="text-2xl font-semibold">{issuesCount}</div>
            </div>
            <div className="text-center">
              <div className="text-sm text-neutral-700">Gas Efficiency</div>
              <div className="text-2xl font-semibold text-success">{gasEfficiency}%</div>
            </div>
          </div>
          <div className={`text-xs px-3 py-1 ${statusStyles.bgClass} ${statusStyles.textClass} rounded-full`}>
            {statusStyles.label}
          </div>
        </div>
        
        {findings.length > 0 ? (
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Identified Issues</h3>
            
            {findings.map((finding: Finding) => {
              const styles = getSeverityStyles(finding.severity);
              return (
                <div 
                  key={finding.id} 
                  className={`border ${styles.borderClass} ${styles.bgClass} rounded-lg p-4`}
                >
                  <div className="flex justify-between items-start">
                    <div className="flex items-center space-x-2">
                      <span 
                        className={`inline-block h-6 w-6 rounded-full ${styles.iconClass} flex items-center justify-center`}
                      >
                        {getSeverityIcon(finding.severity)}
                      </span>
                      <h4 className="font-medium">{finding.title}</h4>
                    </div>
                    <span 
                      className={`text-xs px-2 py-1 ${styles.badgeClass} rounded-full capitalize`}
                    >
                      {finding.severity}
                    </span>
                  </div>
                  <p className="mt-2 text-sm text-neutral-800">{finding.description}</p>
                  {finding.location && (
                    <div className="mt-2 bg-neutral-800 text-white p-3 rounded text-xs font-mono overflow-x-auto">
                      <pre>{finding.location.code}</pre>
                    </div>
                  )}
                  <div className="mt-3 text-sm">
                    <strong className="font-medium">Recommendation:</strong>
                    <p className="text-neutral-800">{finding.recommendation}</p>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <svg 
              className="h-12 w-12 text-success mb-4" 
              xmlns="http://www.w3.org/2000/svg" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="2"
            >
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
              <polyline points="22 4 12 14.01 9 11.01"></polyline>
            </svg>
            <h3 className="text-lg font-medium text-neutral-900">No Issues Found</h3>
            <p className="text-neutral-700 mt-2">
              Your smart contract passed all checks! It appears to be well-structured and secure.
            </p>
          </div>
        )}
        
        {/* AI Analysis Section */}
        <div className="mt-8 border-t border-neutral-200 pt-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium">AI Analysis & Recommendations</h3>
            <Badge variant="secondary" className="bg-purple-100 text-purple-800">
              <Sparkles className="h-3 w-3 mr-1" />
              Powered by Gemini AI
            </Badge>
          </div>
          <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
            <div className="flex items-center space-x-2 mb-3">
              <Sparkles className="h-5 w-5 text-purple-600" />
              <h4 className="font-medium text-purple-800">AI-Generated Insights</h4>
            </div>
            {findings.length > 0 ? (
              <>
                <p className="text-sm text-neutral-800">
                  This contract has {findings.length} security issues that need to be addressed before deployment. 
                  {findings.some(f => f.severity === SeverityLevel.CRITICAL) && 
                    " The most critical concern is the reentrancy vulnerability which could allow attackers to drain funds from the contract."}
                </p>
                <p className="text-sm text-neutral-800 mt-2">
                  Additionally, there are gas optimization opportunities that could reduce transaction costs by 
                  approximately {100 - gasEfficiency}% if implemented.
                </p>
              </>
            ) : (
              <p className="text-sm text-neutral-800">
                Great job! Your smart contract appears to be well-structured and secure. 
                No significant vulnerabilities were detected during our analysis. 
                Consider adding more test cases to verify the contract's functionality under different scenarios.
              </p>
            )}
            <div className="flex items-center mt-4 text-xs text-neutral-600 bg-white p-2 rounded border border-purple-100">
              <span className="mr-1">📊</span>
              <span>
                <strong>Analysis Method:</strong> Smart contract was analyzed using Google's Gemini AI with pattern-based validation.
              </span>
            </div>
          </div>
        </div>
        
        {/* Close the report ref div */}
        </div>
      </CardContent>
    </Card>
  );
}
