import { createContext, useContext, useState, useCallback } from 'react';

const MemeContext = createContext();

export function MemeProvider({ children }) {
  const [memes, setMemes] = useState([]);
  const [topMemes, setTopMemes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const updateMemeVotes = useCallback((memeId, newVotes) => {
    setMemes(prev => 
      prev.map(meme => 
        meme.id === memeId 
          ? { ...meme, upvotes: newVotes }
          : meme
      )
    );
    setTopMemes(prev => 
      prev.map(meme => 
        meme.id === memeId 
          ? { ...meme, upvotes: newVotes }
          : meme
      )
    );
  }, []);

  const updateMemeBid = useCallback((memeId, newBid) => {
    setMemes(prev => 
      prev.map(meme => 
        meme.id === memeId 
          ? { ...meme, topBid: newBid }
          : meme
      )
    );
    setTopMemes(prev => 
      prev.map(meme => 
        meme.id === memeId 
          ? { ...meme, topBid: newBid }
          : meme
      )
    );
  }, []);

  const value = {
    memes,
    setMemes,
    topMemes,
    setTopMemes,
    isLoading,
    setIsLoading,
    updateMemeVotes,
    updateMemeBid
  };

  return (
    <MemeContext.Provider value={value}>
      {children}
    </MemeContext.Provider>
  );
}

export function useMeme() {
  const context = useContext(MemeContext);
  if (!context) {
    throw new Error('useMeme must be used within a MemeProvider');
  }
  return context;
} 