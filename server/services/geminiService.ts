/**
 * Service for interacting with Google's Gemini API
 * 
 * This service handles sending requests to the Gemini API for smart contract
 * analysis and processing the responses.
 */
import fetch from 'node-fetch';
import { v4 as uuidv4 } from 'uuid';
import { AuditResult, Finding, SeverityLevel, AuditRequest } from '@shared/schema';

// Extract the options type from AuditRequest
type AuditOptions = AuditRequest['options'];

const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1/models/gemini-pro:generateContent';

// Prompt templates for Gemini
const ANALYSIS_PROMPT_TEMPLATE = `
You are a specialized smart contract security auditor with expertise in Solidity and blockchain security.
Analyze the following smart contract for security vulnerabilities, gas inefficiencies, and coding best practices.

CONTRACT CODE:
\`\`\`
$CONTRACT_CODE
\`\`\`

AUDIT OPTIONS SELECTED:
- Vulnerability Analysis: $VULNERABILITY_SCAN
- Gas Optimization: $GAS_OPTIMIZATION  
- Best Practices: $BEST_PRACTICES

Provide a comprehensive security audit with the following details for EACH finding:
1. Title (brief description of the issue)
2. Description (detailed explanation)
3. Severity (critical, high, medium, low, or info)
4. Line number where the issue occurs
5. Code snippet containing the issue
6. Recommendation for fixing the issue

Format your response as a valid JSON object with the following structure:
{
  "findings": [
    {
      "title": "Issue title",
      "description": "Detailed description explaining the problem",
      "severity": "One of: critical, high, medium, low, info",
      "location": {
        "line": <line_number>,
        "code": "The code snippet containing the vulnerability"
      },
      "recommendation": "How to fix the issue"
    }
  ]
}

Only include real issues and avoid false positives. Focus on practical, actionable findings.
`;

interface GeminiResponse {
  candidates: Array<{
    content: {
      parts: Array<{
        text: string;
      }>;
    };
  }>;
}

interface GeminiFinding {
  title: string;
  description: string;
  severity: string;
  location: {
    line: number;
    code: string;
  };
  recommendation: string;
}

interface GeminiAuditResult {
  findings: GeminiFinding[];
}

/**
 * Maps severity string from Gemini to SeverityLevel enum
 */
function mapSeverity(severity: string): SeverityLevel {
  const normalizedSeverity = severity.toLowerCase().trim();
  
  if (normalizedSeverity.includes('critical')) return SeverityLevel.CRITICAL;
  if (normalizedSeverity.includes('high')) return SeverityLevel.HIGH;
  if (normalizedSeverity.includes('medium')) return SeverityLevel.MEDIUM;
  if (normalizedSeverity.includes('low')) return SeverityLevel.LOW;
  
  // Default to INFO for any other values
  return SeverityLevel.INFO;
}

/**
 * Calculate security score based on findings
 */
function calculateSecurityScore(findings: Finding[]): number {
  if (findings.length === 0) {
    return 100; // Perfect score if no issues found
  }
  
  const severityWeights = {
    [SeverityLevel.CRITICAL]: 25,
    [SeverityLevel.HIGH]: 15,
    [SeverityLevel.MEDIUM]: 10,
    [SeverityLevel.LOW]: 5,
    [SeverityLevel.INFO]: 2
  };
  
  const totalPenalty = findings.reduce((sum, finding) => {
    return sum + severityWeights[finding.severity];
  }, 0);
  
  // Base score of 100, with deductions based on findings
  let score = 100 - totalPenalty;
  
  // Ensure score doesn't go below 0
  return Math.max(0, score);
}

/**
 * Calculate gas efficiency score
 */
function calculateGasEfficiency(findings: Finding[]): number {
  // Filter findings related to gas efficiency (typically contain keywords like "gas", "optimization", etc.)
  const gasRelatedFindings = findings.filter(f => 
    f.title.toLowerCase().includes('gas') || 
    f.description.toLowerCase().includes('gas efficiency') ||
    f.title.toLowerCase().includes('optimization')
  );
  
  // Calculate efficiency score - base of 90 with penalties for gas-related findings
  const penalty = gasRelatedFindings.length * 5;
  return Math.max(50, 90 - penalty);
}

/**
 * Determine overall status based on security score
 */
function determineStatus(securityScore: number): 'needs_improvement' | 'good' | 'excellent' {
  if (securityScore < 75) return 'needs_improvement';
  if (securityScore < 90) return 'good';
  return 'excellent';
}

/**
 * Analyze a smart contract using Google's Gemini API
 */
export async function analyzeContractWithGemini(
  contractSource: string, 
  options: AuditOptions
): Promise<AuditResult> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error('Gemini API key is not configured');
  }
  
  // Build prompt from template with contract and options
  const prompt = ANALYSIS_PROMPT_TEMPLATE
    .replace('$CONTRACT_CODE', contractSource)
    .replace('$VULNERABILITY_SCAN', options.vulnerabilityScan ? 'Yes' : 'No')
    .replace('$GAS_OPTIMIZATION', options.gasOptimization ? 'Yes' : 'No')
    .replace('$BEST_PRACTICES', options.bestPractices ? 'Yes' : 'No');
  
  try {
    // Make request to Gemini API
    const response = await fetch(`${GEMINI_API_URL}?key=${apiKey}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: prompt
          }]
        }],
        generationConfig: {
          temperature: 0.2,
          topP: 0.8,
          topK: 40,
          maxOutputTokens: 8192,
        }
      })
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Gemini API error (${response.status}): ${errorText}`);
    }
    
    const data = await response.json() as unknown as GeminiResponse;
    const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;
    
    if (!text) {
      throw new Error('No response from Gemini API');
    }
    
    // Extract JSON object from the text (in case there's additional text around it)
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error('Could not parse JSON response from Gemini API');
    }
    
    const jsonStr = jsonMatch[0];
    const geminiResult = JSON.parse(jsonStr) as GeminiAuditResult;
    
    // Transform Gemini findings to the app's Finding format
    const findings: Finding[] = geminiResult.findings.map(finding => ({
      id: uuidv4(),
      title: finding.title,
      description: finding.description,
      severity: mapSeverity(finding.severity),
      location: {
        line: finding.location.line,
        code: finding.location.code
      },
      recommendation: finding.recommendation
    }));
    
    // Calculate metrics
    const securityScore = calculateSecurityScore(findings);
    const gasEfficiency = calculateGasEfficiency(findings);
    const status = determineStatus(securityScore);
    
    let auditResult: AuditResult = {
      securityScore,
      issuesCount: findings.length,
      gasEfficiency,
      findings,
      status
    };
    
    return auditResult;
  } catch (error) {
    console.error('Error using Gemini API:', error instanceof Error ? error.message : 'Unknown error');
    throw error;
  }
}