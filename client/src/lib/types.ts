export interface WalletInfo {
  isConnected: boolean;
  accountId?: string;
  address?: string;
  balance?: string;
  network?: string;
}

export interface Resource {
  id: string;
  title: string;
  description: string;
  url: string;
}

export interface AuditOption {
  id: string;
  label: string;
  description: string;
  defaultEnabled: boolean;
}

export type AuditOptions = {
  vulnerabilityScan: boolean;
  gasOptimization: boolean;
  bestPractices: boolean;
  aiRecommendations: boolean;
};

export enum SeverityLevel {
  CRITICAL = "critical",
  HIGH = "high",
  MEDIUM = "medium",
  LOW = "low",
  INFO = "info",
}

export interface Finding {
  id: string;
  title: string;
  description: string;
  severity: SeverityLevel;
  location: {
    line: number;
    code: string;
  };
  recommendation: string;
}

export interface AuditResult {
  securityScore: number;
  issuesCount: number;
  gasEfficiency: number;
  findings: Finding[];
  status: 'needs_improvement' | 'good' | 'excellent';
}