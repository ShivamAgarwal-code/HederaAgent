import { AuditOptions, AuditResult, Finding, SeverityLevel } from './types';
import { apiRequest } from './queryClient';

/**
 * Send a smart contract for analysis
 */
export async function analyzeContract(contractSource: string, options: AuditOptions): Promise<AuditResult> {
  try {
    const response = await apiRequest<AuditResult>({
      method: 'POST',
      url: '/api/audit',
      data: {
        contractSource,
        options
      }
    });
    
    return response;
  } catch (error) {
    console.error('Failed to analyze contract:', error);
    throw error;
  }
}

/**
 * Gets severity style classes based on severity level
 */
export function getSeverityStyles(severity: SeverityLevel): {
  bg: string;
  text: string;
  border: string;
  // Additional class names for component usage
  bgClass: string;
  borderClass: string;
  iconClass: string;
  badgeClass: string;
} {
  switch (severity) {
    case SeverityLevel.CRITICAL:
      return {
        bg: 'bg-red-100',
        text: 'text-red-800',
        border: 'border-red-200',
        bgClass: 'bg-red-100',
        borderClass: 'border-red-200',
        iconClass: 'text-red-800',
        badgeClass: 'bg-red-100'
      };
    case SeverityLevel.HIGH:
      return {
        bg: 'bg-orange-100',
        text: 'text-orange-800',
        border: 'border-orange-200',
        bgClass: 'bg-orange-100',
        borderClass: 'border-orange-200',
        iconClass: 'text-orange-800',
        badgeClass: 'bg-orange-100'
      };
    case SeverityLevel.MEDIUM:
      return {
        bg: 'bg-amber-100',
        text: 'text-amber-800',
        border: 'border-amber-200',
        bgClass: 'bg-amber-100',
        borderClass: 'border-amber-200',
        iconClass: 'text-amber-800',
        badgeClass: 'bg-amber-100'
      };
    case SeverityLevel.LOW:
      return {
        bg: 'bg-blue-100',
        text: 'text-blue-800',
        border: 'border-blue-200',
        bgClass: 'bg-blue-100',
        borderClass: 'border-blue-200',
        iconClass: 'text-blue-800',
        badgeClass: 'bg-blue-100'
      };
    case SeverityLevel.INFO:
      return {
        bg: 'bg-gray-100',
        text: 'text-gray-800',
        border: 'border-gray-200',
        bgClass: 'bg-gray-100',
        borderClass: 'border-gray-200',
        iconClass: 'text-gray-800',
        badgeClass: 'bg-gray-100'
      };
    default:
      return {
        bg: 'bg-gray-100',
        text: 'text-gray-800',
        border: 'border-gray-200',
        bgClass: 'bg-gray-100',
        borderClass: 'border-gray-200',
        iconClass: 'text-gray-800',
        badgeClass: 'bg-gray-100'
      };
  }
}

/**
 * Gets status style based on security score
 */
export function getStatusStyles(score: number): {
  bgClass: string;
  textClass: string;
  label: string;
  // Keep the old fields for backward compatibility
  color: string;
  bg: string;
  text: string;
} {
  if (score >= 85) {
    return {
      bgClass: 'bg-green-100',
      textClass: 'text-green-600',
      label: 'Excellent',
      color: 'text-green-600',
      bg: 'bg-green-100',
      text: 'Excellent'
    };
  } else if (score >= 70) {
    return {
      bgClass: 'bg-blue-100',
      textClass: 'text-blue-600',
      label: 'Good',
      color: 'text-blue-600',
      bg: 'bg-blue-100',
      text: 'Good'
    };
  } else {
    return {
      bgClass: 'bg-orange-100',
      textClass: 'text-orange-600',
      label: 'Needs Improvement',
      color: 'text-orange-600',
      bg: 'bg-orange-100',
      text: 'Needs Improvement'
    };
  }
}