import { HederaAgentKit } from 'hedera-agent-kit';

/**
 * Service for interacting with Hedera network
 */
export class HederaService {
  private hederaAgentKit: HederaAgentKit | null = null;
  
  /**
   * Creates an instance of HederaAgentKit
   */
  initialize(accountId: string, privateKey: string, network: string): boolean {
    try {
      this.hederaAgentKit = new HederaAgentKit(
        accountId,
        privateKey,
        network as 'mainnet' | 'testnet' | 'previewnet'
      );
      return true;
    } catch (error) {
      console.error('Failed to initialize Hedera Agent Kit:', error);
      return false;
    }
  }
  
  /**
   * Checks if the service is initialized
   */
  isInitialized(): boolean {
    return this.hederaAgentKit !== null;
  }
  
  /**
   * Get HBAR balance for an account
   */
  async getHbarBalance(accountId: string): Promise<string | null> {
    if (!this.hederaAgentKit) {
      return null;
    }
    
    try {
      const balanceResponse = await this.hederaAgentKit.getHbarBalance(accountId);
      return balanceResponse;
    } catch (error) {
      console.error('Error fetching HBAR balance:', error);
      return null;
    }
  }
  
  /**
   * Get account details
   */
  async getAccountInfo(accountId: string): Promise<any | null> {
    if (!this.hederaAgentKit) {
      return null;
    }
    
    try {
      // This is a placeholder - getAccountInfo isn't explicitly shown in the provided docs
      // In a real implementation, we would need to implement or find the appropriate method
      // from the HederaAgentKit or HashConnect SDK
      // For now, we'll just return the HBAR balance
      const balance = await this.hederaAgentKit.getHbarBalance(accountId);
      return {
        accountId,
        balance
      };
    } catch (error) {
      console.error('Error fetching account info:', error);
      return null;
    }
  }
}

// Singleton instance
export const hederaService = new HederaService();
