'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { savedOfferService } from '@/services/savedOffer.service';
import { useAuth } from './AuthContext';
import { toast } from 'sonner';

interface SavedOffersContextType {
  count: number;
  refreshCount: () => Promise<void>;
  updateCount: (newCount: number) => void;
  loading: boolean;
}

const SavedOffersContext = createContext<SavedOffersContextType | undefined>(undefined);

export function SavedOffersProvider({ children }: { children: React.ReactNode }) {
  const [count, setCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const { isAuthenticated, user } = useAuth();

  const refreshCount = useCallback(async () => {
    if (!isAuthenticated || user?.role !== 'member') {
      setCount(0);
      setLoading(false);
      return;
    }

    try {
      // Ideally, we should have a lighter endpoint for just the count.
      // For now, we fetch the offers to get the length.
      const response = await savedOfferService.getSavedOffers();
      if (response.success) {
        setCount(response.data.offers.length);
      }
    } catch (error) {
      console.error('Failed to fetch saved offers count', error);
      // Don't show toast here to avoid spamming on every navigation/refresh
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated, user]);

  const updateCount = (newCount: number) => {
    setCount(newCount);
  };

  useEffect(() => {
    refreshCount();
  }, [refreshCount]);

  return (
    <SavedOffersContext.Provider value={{ count, refreshCount, updateCount, loading }}>
      {children}
    </SavedOffersContext.Provider>
  );
}

export function useSavedOffers() {
  const context = useContext(SavedOffersContext);
  if (context === undefined) {
    throw new Error('useSavedOffers must be used within a SavedOffersProvider');
  }
  return context;
}


