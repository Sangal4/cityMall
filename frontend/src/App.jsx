import { useState } from "react";
import "./App.css";
import MemeCard from "./components/MemeCard";
import { useEffect } from "react";
import { getAllMemes, addMeme } from "./services";
import Leaderboard from "./components/Leaderboard";
import { useSocket } from "./hooks/useSocket";
import CreateMemeModal from "./components/CreateMemeModal";
import { MemeProvider, useMeme } from "./context/MemeContext";

function AppContent() {
  const [modalOpen, setModalOpen] = useState(false);
  const [latestBid, setLatestBid] = useState(null);
  const { memes, setMemes, isLoading, setIsLoading } = useMeme();

  const fetchMemes = () => {
    getAllMemes()
      .then((data) => {
        setMemes(data);
      })
      .catch((error) => {
        console.error('Error fetching memes:', error);
      })
      .finally(() => setIsLoading(false));
  };

  const handleCreateMeme = async (form, tagsArray) => {
    try {
      await addMeme(form, tagsArray);
      setModalOpen(false);
      fetchMemes();
    } catch (error) {
      console.error('Error creating meme:', error);
      alert('Failed to create meme. Please try again.');
    }
  };

  useEffect(() => {
    fetchMemes();
  }, []);

  useSocket({
    onNewMeme: (meme) => {
      if (meme && meme.id) {
        setMemes((prev) => {
          const exists = prev.some(m => m.id === meme.id);
          if (exists) return prev;
          return [meme, ...prev];
        });
      }
    },
    onMemeUpdated: (updatedMeme) => {
      setMemes((prev) =>
        prev.map((m) => (m.id === updatedMeme.id ? updatedMeme : m))
      );
    },
    onLatestBid: (bid) => {
      setLatestBid(bid);
    },
  });

  return (
    <div className="w-full flex flex-col h-[100vh] bg-gradient-to-r from-purple-900 via-black to-pink-900 text-white p-4">
      <div className="w-full flex justify-around xl:justify-center fixed top-0 inset-x-0 p-4 bg-gradient-to-r from-purple-900 via-black to-pink-900 z-10">
        <h1 className="text-4xl font-bold neon-glow animate-pulse hover:scale-105 transition-transform duration-300 cursor-default">
          <span className="text-[var(--neon-pink)]">Meme</span>
          <span className="text-[var(--neon-blue)]">Verse</span>
          <span className="text-[var(--neon-yellow)] text-2xl ml-2">🌌</span>
        </h1>

        <button
          onClick={() => setModalOpen(true)}
          className="cyberpunk-btn pointer-events-auto xl:relative xl:left-[30%] hover:scale-105 transition-transform duration-300"
        >
          🚀 Create Meme
        </button>
      </div>

      <div className="flex-1 flex mt-24 gap-8 h-[calc(100vh-8rem)]">
        <div className="meme-container flex-1 grid grid-cols-1 md:grid-cols-2 gap-8 px-8 overflow-y-auto max-w-[1400px] mx-auto">
          {isLoading ? (
            <div className="col-span-2 flex justify-center items-center">
              <div className="animate-spin text-4xl">⚡</div>
            </div>
          ) : (
            memes.map((meme) => (
              <MemeCard
                key={meme.id}
                meme={meme}
                refresh={fetchMemes}
                latestBid={latestBid}
              />
            ))
          )}
        </div>
        <div className="hidden xl:block h-full overflow-y-auto">
          <Leaderboard />
        </div>
      </div>

      <CreateMemeModal 
        open={modalOpen} 
        onClose={() => setModalOpen(false)}
        onSubmit={handleCreateMeme}
      />
    </div>
  );
}

function App() {
  return (
    <MemeProvider>
      <AppContent />
    </MemeProvider>
  );
}

export default App;
