// Enhanced storage system for Vercel deployment
class MemoryStorage {
  private shares: Map<string, any> = new Map();

  saveShare(shareData: any): void {
    this.shares.set(shareData.code, shareData);
    console.log('Saved share:', shareData.code, 'Total shares:', this.shares.size);
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
      console.log('Updated share:', code);
    }
  }

  deleteShare(code: string): void {
    this.shares.delete(code.toUpperCase());
  }

  // Clean up expired shares
  cleanupExpired(): void {
    const now = new Date();
    for (const [code, share] of this.shares.entries()) {
      if (new Date(share.expiresAt) < now) {
        this.shares.delete(code);
        console.log('Cleaned up expired share:', code);
      }
    }
  }
}

// Create a singleton instance
const memoryStorage = new MemoryStorage();

// Clean up expired shares every 5 minutes
if (typeof window !== 'undefined') {
  setInterval(() => {
    memoryStorage.cleanupExpired();
  }, 5 * 60 * 1000);
}

// Enhanced storage interface that works both locally and on Vercel
export const storage = {
  saveShare: (shareData: any) => {
    // Always save to memory storage first
    memoryStorage.saveShare(shareData);
    
    try {
      // Try localStorage as backup (for local development)
      if (typeof window !== 'undefined' && window.localStorage) {
        const existingShares = JSON.parse(localStorage.getItem('file_shares') || '[]');
        // Remove any existing share with the same code
        const filteredShares = existingShares.filter((s: any) => s.code !== shareData.code);
        filteredShares.push(shareData);
        localStorage.setItem('file_shares', JSON.stringify(filteredShares));
        console.log('Also saved to localStorage');
      }
    } catch (e) {
      console.log('localStorage not available, using memory storage only');
    }
  },

  getShare: (code: string) => {
    // First try memory storage (primary for Vercel)
    let share = memoryStorage.getShare(code);
    if (share) return share;
    
    try {
      // Fallback to localStorage (for local development)
      if (typeof window !== 'undefined' && window.localStorage) {
        const existingShares = JSON.parse(localStorage.getItem('file_shares') || '[]');
        share = existingShares.find((s: any) => s.code === code.toUpperCase());
        if (share) {
          // Also save to memory storage for faster access
          memoryStorage.saveShare(share);
          return share;
        }
      }
    } catch (e) {
      console.log('localStorage not available');
    }
    
    return null;
  },

  getAllShares: () => {
    // Get from memory storage first
    let shares = memoryStorage.getAllShares();
    
    try {
      // Merge with localStorage if available
      if (typeof window !== 'undefined' && window.localStorage) {
        const localShares = JSON.parse(localStorage.getItem('file_shares') || '[]');
        // Merge shares, preferring memory storage
        const allCodes = new Set([...shares.map(s => s.code), ...localShares.map((s: any) => s.code)]);
        shares = Array.from(allCodes).map(code => {
          return shares.find(s => s.code === code) || localShares.find((s: any) => s.code === code);
        }).filter(Boolean);
      }
    } catch (e) {
      console.log('localStorage not available');
    }
    
    return shares;
  },

  updateShare: (code: string, updates: any) => {
    // Update memory storage first
    memoryStorage.updateShare(code, updates);
    
    try {
      // Update localStorage if available
      if (typeof window !== 'undefined' && window.localStorage) {
        const existingShares = JSON.parse(localStorage.getItem('file_shares') || '[]');
        const updatedShares = existingShares.map((s: any) => 
          s.code === code.toUpperCase() ? { ...s, ...updates } : s
        );
        localStorage.setItem('file_shares', JSON.stringify(updatedShares));
      }
    } catch (e) {
      console.log('localStorage not available');
    }
  },

  // Debug function to check storage state
  getStorageInfo: () => {
    const memoryShares = memoryStorage.getAllShares();
    let localShares = [];
    
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        localShares = JSON.parse(localStorage.getItem('file_shares') || '[]');
      }
    } catch (e) {
      // ignore
    }
    
    return {
      memory: memoryShares.length,
      localStorage: localShares.length,
      memoryShares: memoryShares.map(s => ({ code: s.code, expires: s.expiresAt })),
      localShares: localShares.map((s: any) => ({ code: s.code, expires: s.expiresAt }))
    };
  }
};