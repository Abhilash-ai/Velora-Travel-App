import React, { createContext, useContext, useState, useEffect } from 'react';

interface TravelContextType {
  savedDestinationIds: string[];
  toggleSaveDestination: (id: string) => void;
  isDestinationSaved: (id: string) => boolean;
}

const TravelContext = createContext<TravelContextType | undefined>(undefined);

export const TravelProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [savedDestinationIds, setSavedDestinationIds] = useState<string[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem('velora_v2_saved_destinations');
    if (stored) {
      try {
        setSavedDestinationIds(JSON.parse(stored));
      } catch (e) {
        console.error("Failed to parse saved destinations", e);
      }
    }
  }, []);

  const toggleSaveDestination = (id: string) => {
    setSavedDestinationIds(prev => {
      const isSaved = prev.includes(id);
      const newSaved = isSaved ? prev.filter(destId => destId !== id) : [...prev, id];
      localStorage.setItem('velora_v2_saved_destinations', JSON.stringify(newSaved));
      return newSaved;
    });
  };

  const isDestinationSaved = (id: string) => savedDestinationIds.includes(id);

  return (
    <TravelContext.Provider value={{
      savedDestinationIds,
      toggleSaveDestination,
      isDestinationSaved
    }}>
      {children}
    </TravelContext.Provider>
  );
};

export const useTravel = () => {
  const context = useContext(TravelContext);
  if (!context) throw new Error('useTravel must be used within TravelProvider');
  return context;
};
