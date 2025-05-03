import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { auditContract } from "./services/auditService";
import { hederaService } from "./services/hederaService";
import { z } from "zod";
import { AuditRequest, InsertAuditReport } from "@shared/schema";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

// Get __dirname equivalent in ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export async function registerRoutes(app: Express): Promise<Server> {
  // API prefix for all routes
  const API_PREFIX = '/api';
  
  // Get health check
  app.get(`${API_PREFIX}/health`, (req: Request, res: Response) => {
    res.status(200).json({ status: 'ok' });
  });
  
  // Get resources for security guidelines
  app.get(`${API_PREFIX}/resources`, (req: Request, res: Response) => {
    const resources = [
      {
        id: '1',
        title: 'Common Smart Contract Vulnerabilities',
        description: 'Learn about the most common security issues in smart contracts',
        url: 'https://docs.hedera.com/hedera/core-concepts/smart-contracts/security'
      },
      {
        id: '2',
        title: 'Hedera Smart Contract Best Practices',
        description: 'Official guidelines for secure smart contracts on Hedera',
        url: 'https://hedera.com/learning/smart-contracts/smart-contract-security'
      },
      {
        id: '3',
        title: 'Gas Optimization Techniques',
        description: 'How to reduce gas costs in your smart contracts',
        url: 'https://medium.com/coinmonks/8-ways-of-reducing-the-gas-consumption-of-your-smart-contracts-9a506b339c0a'
      },
      {
        id: '4',
        title: 'Hedera Token Service Integration',
        description: 'Learn how to integrate tokens with smart contracts',
        url: 'https://docs.hedera.com/hedera/sdks-and-apis/hedera-api/token-service'
      }
    ];
    
    res.status(200).json(resources);
  });
  
  // Audit contract submission endpoint
  app.post(`${API_PREFIX}/audit`, async (req: Request, res: Response) => {
    try {
      // Schema to validate the request body
      const auditRequestSchema = z.object({
        contractSource: z.string().min(1, "Contract source is required"),
        options: z.object({
          vulnerabilityScan: z.boolean().default(true),
          gasOptimization: z.boolean().default(true),
          bestPractices: z.boolean().default(true),
          aiRecommendations: z.boolean().default(true)
        })
      });
      
      // Validate request
      const auditRequest = auditRequestSchema.parse(req.body) as AuditRequest;
      
      // Perform the audit
      const auditResult = await auditContract(auditRequest);
      
      // Store audit result - for hackathon demo, we'll create a default user record
      // In a real app this would be associated with the authenticated user
      const auditReport: InsertAuditReport = {
        userId: 1, // Default user ID for demo purposes
        contractSource: auditRequest.contractSource,
        securityScore: auditResult.securityScore,
        issuesCount: auditResult.issuesCount,
        gasEfficiency: auditResult.gasEfficiency,
        findings: auditResult.findings,
        createdAt: new Date().toISOString()
      };
      
      try {
        await storage.createAuditReport(auditReport);
      } catch (error) {
        console.error('Failed to store audit report:', error);
        // Non-critical error, continue without failing the request
      }
      
      // Return the audit result
      res.status(200).json(auditResult);
    } catch (error) {
      console.error('Error processing audit request:', error);
      
      if (error instanceof z.ZodError) {
        return res.status(400).json({ 
          message: 'Invalid request data', 
          errors: error.errors 
        });
      }
      
      res.status(500).json({ message: 'Failed to process audit request' });
    }
  });
  
  // Hedera account balance endpoint
  app.get(`${API_PREFIX}/hedera/balance/:accountId`, async (req: Request, res: Response) => {
    try {
      const { accountId } = req.params;
      
      if (!accountId) {
        return res.status(400).json({ message: 'Account ID is required' });
      }
      
      // Check if Hedera service is initialized
      if (!hederaService.isInitialized()) {
        // Initialize with environment variables
        const privateKey = process.env.HEDERA_PRIVATE_KEY;
        const networkType = process.env.HEDERA_NETWORK_TYPE || 'testnet';
        
        if (!privateKey) {
          return res.status(500).json({ message: 'Hedera service not configured properly' });
        }
        
        hederaService.initialize('0.0.5798618', privateKey, networkType);
      }
      
      const balance = await hederaService.getHbarBalance(accountId);
      
      if (balance === null) {
        return res.status(404).json({ message: 'Failed to retrieve account balance' });
      }
      
      res.status(200).json({ accountId, balance });
    } catch (error) {
      console.error('Error fetching Hedera account balance:', error);
      res.status(500).json({ message: 'Failed to fetch account balance' });
    }
  });
  
  // Get deployed contracts information
  app.get(`${API_PREFIX}/hedera/contracts`, (req: Request, res: Response) => {
    try {
      const contractsFilePath = path.join(path.dirname(__dirname), 'deployed-contracts.json');
      
      // Check if the file exists
      if (!fs.existsSync(contractsFilePath)) {
        return res.status(404).json({ message: 'No deployed contracts found' });
      }
      
      // Read the file
      const contractsData = fs.readFileSync(contractsFilePath, 'utf8');
      const contracts = JSON.parse(contractsData);
      
      res.status(200).json(contracts);
    } catch (error) {
      console.error('Error fetching deployed contracts:', error);
      res.status(500).json({ message: 'Failed to fetch deployed contracts' });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
