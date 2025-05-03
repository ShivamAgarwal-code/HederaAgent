import { 
  users, 
  auditReports, 
  type User, 
  type InsertUser, 
  type AuditReport, 
  type InsertAuditReport,
  type AuditResult
} from "@shared/schema";

export interface IStorage {
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  getUserByAccountId(accountId: string): Promise<User | undefined>;
  getUserByWalletAddress(address: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(id: number, updates: Partial<InsertUser>): Promise<User | undefined>;
  
  getAuditReport(id: number): Promise<AuditReport | undefined>;
  getAuditReportsByUserId(userId: number): Promise<AuditReport[]>;
  createAuditReport(report: InsertAuditReport): Promise<AuditReport>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private auditReports: Map<number, AuditReport>;
  private userIdCounter: number;
  private auditReportIdCounter: number;

  constructor() {
    this.users = new Map();
    this.auditReports = new Map();
    this.userIdCounter = 1;
    this.auditReportIdCounter = 1;
    
    // Create a default user for demo purposes
    this.createDefaultUser();
  }
  
  private createDefaultUser() {
    const defaultUser: User = {
      id: 1,
      username: 'demo_user',
      password: 'demo123', // Default password for demo purposes
      email: 'demo@hederaguard.ai',
      accountId: '0.0.5798618',
      walletAddress: '0x2873f2d2dfd292a59a8b72598011611e9d5b8b9a',
      createdAt: new Date().toISOString()
    };
    
    this.users.set(defaultUser.id, defaultUser);
  }

  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username
    );
  }

  async getUserByAccountId(accountId: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.accountId === accountId
    );
  }

  async getUserByWalletAddress(address: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.walletAddress === address
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.userIdCounter++;
    // Ensure all required fields are present with defaults if not provided
    const user: User = { 
      ...insertUser, 
      id,
      email: insertUser.email || null,
      accountId: insertUser.accountId || null,
      walletAddress: insertUser.walletAddress || null,
      createdAt: insertUser.createdAt || new Date().toISOString()
    };
    this.users.set(id, user);
    return user;
  }

  async updateUser(id: number, updates: Partial<InsertUser>): Promise<User | undefined> {
    const user = this.users.get(id);
    if (!user) return undefined;
    
    const updatedUser = { ...user, ...updates };
    this.users.set(id, updatedUser);
    return updatedUser;
  }

  async getAuditReport(id: number): Promise<AuditReport | undefined> {
    return this.auditReports.get(id);
  }

  async getAuditReportsByUserId(userId: number): Promise<AuditReport[]> {
    return Array.from(this.auditReports.values()).filter(
      (report) => report.userId === userId
    );
  }

  async createAuditReport(insertReport: InsertAuditReport): Promise<AuditReport> {
    const id = this.auditReportIdCounter++;
    // Ensure required fields are present
    const report: AuditReport = { 
      ...insertReport, 
      id,
      userId: insertReport.userId || 1, // Default to user 1 if not provided
      gasEfficiency: insertReport.gasEfficiency || 0, // Default to 0 if not provided
    };
    this.auditReports.set(id, report);
    return report;
  }
}

export const storage = new MemStorage();
