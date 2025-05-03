import { pgTable, text, serial, integer, boolean, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  email: text("email"),
  accountId: text("account_id"),
  walletAddress: text("wallet_address"),
  createdAt: text("created_at"),
});

export const auditReports = pgTable("audit_reports", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id),
  contractSource: text("contract_source").notNull(),
  securityScore: integer("security_score").notNull(),
  issuesCount: integer("issues_count").notNull(),
  gasEfficiency: integer("gas_efficiency"),
  findings: jsonb("findings").notNull(),
  createdAt: text("created_at").notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
  email: true,
  accountId: true,
  walletAddress: true,
  createdAt: true,
});

export const insertAuditReportSchema = createInsertSchema(auditReports).pick({
  userId: true,
  contractSource: true,
  securityScore: true,
  issuesCount: true,
  gasEfficiency: true,
  findings: true,
  createdAt: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

export type InsertAuditReport = z.infer<typeof insertAuditReportSchema>;
export type AuditReport = typeof auditReports.$inferSelect;

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

export interface AuditRequest {
  contractSource: string;
  options: {
    vulnerabilityScan: boolean;
    gasOptimization: boolean;
    bestPractices: boolean;
    aiRecommendations: boolean;
  };
}
