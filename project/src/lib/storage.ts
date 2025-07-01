// Simple in-memory storage for demo purposes
// In production, you'd want to use a proper database
class MemoryStorage {
  private shares: Map<string, any> = new Map();

  saveShare(shareData: any): void {
    this.shares.set(shareData.code, shareData);
    console.log('Saved share:', shareData.code);
  }

  getShare(code: string): any | null {
    const share = this.shares.get(code.toUpperCase());
    console.log('Retrieved share for code:', code, share ? 'found' : 'not found');
    return share || null;
  }

  getAllShares(): any[] {
    return Array.from(this.shares.values());
  }

  updateShare(code: string, updates: any): void {
    const existing = this.shares.get(code.toUpperCase());
    if (existing) {
      this.shares.set(code.toUpperCase(), { ...existing, ...updates });
    }
  }

  deleteShare(code: string): void {
    this.shares.delete(code.toUpperCase());
  }
}

// Create a singleton instance
const memoryStorage = new MemoryStorage();

// Storage interface that works both locally and on Vercel
export const storage = {
  saveShare: (shareData: any) => {
    try {
      // Try localStorage first (for local development)
      if (typeof window !== 'undefined' && window.localStorage) {
        const existingShares = JSON.parse(localStorage.getItem('file_shares') || '[]');
        existingShares.push(shareData);
        localStorage.setItem('file_shares', JSON.stringify(existingShares));
      }
    } catch (e) {
      console.log('localStorage not available, using memory storage');
    }
    
    // Always save to memory storage as backup
    memoryStorage.saveShare(shareData);
  },

  getShare: (code: string) => {
    try {
      // Try localStorage first
      if (typeof window !== 'undefined' && window.localStorage) {
        const existingShares = JSON.parse(localStorage.getItem('file_shares') || '[]');
        const share = existingShares.find((s: any) => s.code === code.toUpperCase());
        if (share) return share;
      }
    } catch (e) {
      console.log('localStorage not available, using memory storage');
    }
    
    // Fallback to memory storage
    return memoryStorage.getShare(code);
  },

  getAllShares: () => {
    try {
      // Try localStorage first
      if (typeof window !== 'undefined' && window.localStorage) {
        return JSON.parse(localStorage.getItem('file_shares') || '[]');
      }
    } catch (e) {
      console.log('localStorage not available, using memory storage');
    }
    
    // Fallback to memory storage
    return memoryStorage.getAllShares();
  },

  updateShare: (code: string, updates: any) => {
    try {
      // Try localStorage first
      if (typeof window !== 'undefined' && window.localStorage) {
        const existingShares = JSON.parse(localStorage.getItem('file_shares') || '[]');
        const updatedShares = existingShares.map((s: any) => 
          s.code === code.toUpperCase() ? { ...s, ...updates } : s
        );
        localStorage.setItem('file_shares', JSON.stringify(updatedShares));
      }
    } catch (e) {
      console.log('localStorage not available, using memory storage');
    }
    
    // Always update memory storage
    memoryStorage.updateShare(code, updates);
  }
};