import { useState } from "react";
import { generateCaption, updateBid, voteMeme } from "../services";
import { useMeme } from "../context/MemeContext";

export default function MemeCard({ meme, refresh, latestBid }) {
  const [bid, setBid] = useState("");
  const [loading, setLoading] = useState(false);
  const [isVoting, setIsVoting] = useState(false);
  const { updateMemeVotes, updateMemeBid } = useMeme();

  const placeBid = async () => {
    if (!bid) return;

    const numericBid = parseInt(bid);

    if (isNaN(numericBid) || numericBid < 1000) {
      alert("🚫 Minimum bid is 1000 credits.");
      return;
    }

    if (meme.topBid && numericBid <= meme.topBid.credits) {
      alert(`🚫 New bid must be higher than current (${meme.topBid.credits}).`);
      return;
    }

    // Optimistically update the bid
    const optimisticBid = {
      credits: numericBid,
      user_id: "You",
      meme_id: meme.id
    };
    updateMemeBid(meme.id, optimisticBid);
    setBid("");

    try {
      const data = await updateBid(meme.id, bid);
      updateMemeBid(meme.id, data.topBid);
    } catch (error) {
      // Revert optimistic update on error
      updateMemeBid(meme.id, meme.topBid);
      console.error('Error placing bid:', error);
      alert("Failed to place bid. Please try again.");
    }
  };

  const generateAI = async () => {
    if (loading) return;
    setLoading(true);
    try {
      await generateCaption(meme.id);
      refresh();
    } catch (error) {
      console.error('Error generating AI captions:', error);
      alert("Error generating AI captions");
    } finally {
      setLoading(false);
    }
  };

  const vote = async (type) => {
    if (isVoting) return;
    setIsVoting(true);

    // Optimistically update the vote count
    const voteChange = type === "up" ? 1 : -1;
    const newVotes = meme.upvotes + voteChange;
    updateMemeVotes(meme.id, newVotes);

    try {
      const data = await voteMeme(meme.id, type);
      updateMemeVotes(meme.id, data.upvotes);
    } catch (error) {
      // Revert optimistic update on error
      updateMemeVotes(meme.id, meme.upvotes);
      console.error('Error voting:', error);
      alert("Failed to vote. Please try again.");
    } finally {
      setIsVoting(false);
    }
  };

  return (
    <div className="cyberpunk-card cyberpunk-container w-full min-h-[700px] flex flex-col p-4">
      <div className="relative w-full h-[250px] mb-3">
        <img
          src={meme.image_url}
          alt={meme.title}
          className="rounded-md w-full h-full object-cover border border-[var(--neon-pink)]"
        />
      </div>

      <div className="text-center">
        <h3 className="cyberpunk-text text-xl font-bold mb-2">{meme.title}</h3>

        <p className="text-sm text-[var(--neon-blue)] italic mb-2">
          Tags: {meme.tags.join(", ")}
        </p>

        <div className="flex items-center justify-center gap-4 mb-3">
          <p className="text-[var(--neon-green)] text-base">🔼 {meme.upvotes}</p>

          <div className="flex gap-2">
            <button
              onClick={() => vote("up")}
              disabled={isVoting}
              className={`cyberpunk-btn px-3 py-1 text-base transition-all duration-300 ${
                isVoting ? 'opacity-50 cursor-not-allowed' : 'hover:scale-110'
              }`}
            >
              ▲
            </button>
            <button
              onClick={() => vote("down")}
              disabled={isVoting}
              className={`cyberpunk-btn px-3 py-1 text-base bg-gradient-to-r from-[var(--neon-pink)] to-[var(--neon-blue)] transition-all duration-300 ${
                isVoting ? 'opacity-50 cursor-not-allowed' : 'hover:scale-110'
              }`}
            >
              ▼
            </button>
          </div>
        </div>
      </div>

      <hr className="my-3 border-[var(--neon-pink)]" />

      <div className="text-[var(--neon-yellow)] text-base mb-3">
        💰 Highest Bid:{" "}
        {meme.topBid
          ? `${meme.topBid.credits} (by ${meme.topBid.user_id})`
          : "—"}
      </div>

      <div className="flex gap-2 mb-3">
        <input
          type="number"
          value={bid}
          onChange={(e) => setBid(e.target.value)}
          className="cyberpunk-input flex-1 text-base"
          placeholder="Enter credits"
        />
        <button
          onClick={placeBid}
          className="cyberpunk-btn px-4 py-1 text-base whitespace-nowrap hover:scale-105 transition-transform duration-300"
        >
          Bid
        </button>
      </div>

      <div className="mb-3">
        <button
          onClick={generateAI}
          disabled={loading}
          className={`cyberpunk-btn w-full py-2 text-base transition-all duration-300 ${
            loading ? "opacity-50 cursor-not-allowed" : "hover:scale-105"
          }`}
        >
          {loading ? "⚙️ Generating..." : "✨ Generate AI Caption & Vibe"}
        </button>
      </div>

      <div className="space-y-2">
        {meme.caption && (
          <div className="bg-black/30 p-2 rounded-lg border border-[var(--neon-blue)]">
            <p className="text-[var(--neon-blue)] text-sm">
              🧠 <strong>Caption:</strong> {meme.caption}
            </p>
          </div>
        )}
        {meme.vibe && (
          <div className="bg-black/30 p-2 rounded-lg border border-[var(--neon-pink)]">
            <p className="text-[var(--neon-pink)] text-sm italic">
              🌈 <strong>Vibe:</strong> {meme.vibe}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
