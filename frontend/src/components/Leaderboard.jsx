import { useEffect, useState } from "react";
import { fetchLeaderboard } from "../services";
import { formatNumber } from "../utils/formatNumber";
import { getRandomName } from "../utils/randomNames";
import { useMeme } from "../context/MemeContext";

export default function Leaderboard() {
  const [bidderNames, setBidderNames] = useState({});
  const { topMemes, setTopMemes, isLoading, setIsLoading } = useMeme();

  const getLeaderboard = async () => {
    try {
      const data = await fetchLeaderboard();
      // Generate random names for new bidders
      const newBidderNames = { ...bidderNames };
      data.forEach(meme => {
        if (meme.topBid && meme.topBid.user_id && !bidderNames[meme.topBid.user_id]) {
          newBidderNames[meme.topBid.user_id] = getRandomName();
        }
      });
      setBidderNames(newBidderNames);
      setTopMemes(data);
    } catch (error) {
      console.error('Error fetching leaderboard:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getLeaderboard();
    const interval = setInterval(() => getLeaderboard(), 10000);
    return () => clearInterval(interval);
  }, []);

  // Optimistically update a meme's bid in the leaderboard
  const updateMemeBid = (memeId, newBid) => {
    setTopMemes(prev => 
      prev.map(meme => 
        meme.id === memeId
          ? {
              ...meme,
              topBid: {
                ...meme.topBid,
                credits: newBid.credits,
                user_id: newBid.user_id
              }
            }
          : meme
      )
    );
  };

  return (
    <div className="cyberpunk-card cyberpunk-container w-sm mx-auto mt-10">
      <div>
        <h2 className="cyberpunk-text text-2xl mb-4 font-bold">
          🚀 Trending Memes
        </h2>
      </div>
      <div className="overflow-y-auto">
        {isLoading ? (
          <div className="flex justify-center items-center py-8">
            <div className="animate-spin text-2xl">⚡</div>
          </div>
        ) : (
          <ol className="space-y-2">
            {topMemes.map((meme, idx) => (
              <li
                key={meme.id}
                className="cyberpunk-card p-3 hover:scale-[1.02] transition-transform duration-300"
              >
                <span className="cyberpunk-text font-semibold text-lg">
                  {idx + 1}. {meme.title}
                </span>
                <div className="text-sm mt-1 flex justify-between">
                  <span className="text-[var(--neon-green)]">
                    🔼 {formatNumber(meme.upvotes)} votes
                  </span>
                  <span className="text-[var(--neon-yellow)]">
                    💰 {formatNumber(meme.topBid?.credits || 0)} (by {bidderNames[meme.topBid?.user_id] || 'Anonymous'})
                  </span>
                </div>
              </li>
            ))}
          </ol>
        )}
      </div>
    </div>
  );
}
