const { generateGeminiText } = require('../services/geminiService');
const supabase = require("../services/supabaseClient");
const Meme = require('../models/meme.model');
const Bid = require('../models/bid.model');

// POST /memes
const createMeme = async (req, res) => {
  try {
    const { title, image_url, tags } = req.body;
    // console.log("title", title);
    // console.log("image_url", image_url);
    // console.log("tags", tags);
    // Input validation
    if (!title || !tags || !Array.isArray(tags)) {
      return res.status(400).json({ 
        error: 'Invalid input. Title and tags array are required.' 
      });
    }

    // Create meme using the model
    const meme = await Meme.create({ title, image_url, tags });

    // Emit real-time update
    const io = req.app.get("io");
    io.emit("newMeme", meme);

    res.status(201).json(meme);
  } catch (error) {
    console.error("Error creating meme:", {
      error,
      message: error?.message,
      stack: error?.stack,
      full: JSON.stringify(error, Object.getOwnPropertyNames(error), 2)
    });
  }
};

//GET /memes
const getAllMemes = async (req, res) => {
  const { data, error } = await supabase
    .from("memes")
    .select("*")
    .order("upvotes", { ascending: false });

  if (error) return res.status(500).json({ error });
  res.json(data);
};

// POST /memes/:id/vote
const voteMeme = async (req, res) => {
  try {
    const { id } = req.params;
    const { type } = req.body;
//  console.log("type: ", type);
//  console.log("id: ", id);

    // Input validation
    if (!id) {
      return res.status(400).json({ error: 'Meme ID is required' });
    }

    if (!type || !['up', 'down'].includes(type)) {
      return res.status(400).json({ 
        error: 'Invalid vote type. Must be either "up" or "down"' 
      });
    }

    // Check if meme exists
    const meme = await Meme.findById(id);
    if (!meme) {
      return res.status(404).json({ error: 'Meme not found' });
    }

    // Update votes using the model
    const updatedMeme = await Meme.updateVotes(id, type);

    // Emit real-time update
    const io = req.app.get("io");
    io.emit("memeUpdated", updatedMeme);

    res.json(updatedMeme);
  } catch (error) {
    console.error('Error voting on meme:', error);
    res.status(500).json({ 
      error: 'Failed to process vote',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// GET /leaderboard?top=10
// const getLeaderboard = async (req, res) => {
//   const top = parseInt(req.query.top) || 10;
//   const { data, error } = await supabase
//     .from("memes")
//     .select("*")
//     .order("upvotes", { ascending: false })
//     .limit(top);

//   if (error) return res.status(500).json({ error });
//   res.json(data);
// };

const getLeaderboard = async (req, res) => {
  const top = parseInt(req.query.top) || 10;

  // Fetch top memes
  const { data: memes, error } = await supabase
    .from('memes')
    .select('*')
    .order('upvotes', { ascending: false })
    .limit(top);

  if (error) return res.status(500).json({ error });

  // For each meme, fetch highest bid
  const enrichedMemes = await Promise.all(memes.map(async (meme) => {
    const { data: topBid } = await supabase
      .from('bids')
      .select('credits, user_id')
      .eq('meme_id', meme.id)
      .order('credits', { ascending: false })
      .limit(1)
      .single();

    return {
      ...meme,
      topBid: topBid || { credits: 0, user_id: '—' }
    };
  }));

  res.json(enrichedMemes);
};


// POST /memes/:id/bid
const placeBid = async (req, res) => {
  const { id: meme_id } = req.params;
  const { user_id = "cyberpunk420", credits } = req.body;
  const io = req.app.get("io");

  const { data: newBid, error } = await supabase
    .from('bids')
    .insert([{ meme_id, user_id, credits }])
    .select()
    .single();

  if (error) return res.status(500).json({ error });

  // Get highest bid for this meme
  const { data: highest } = await supabase
    .from('bids')
    .select('credits, user_id')
    .eq('meme_id', meme_id)
    .order('credits', { ascending: false })
    .limit(1)
    .single();

  // Broadcast to all users
  io.emit("bidUpdate", { meme_id, ...highest });

  res.status(200).json({ success: true });
};


// POST /memes/:id/caption
const generateCaptionAndVibe = async (req, res) => {
  const { id } = req.params;

  const { data: meme, error: memeError } = await supabase
    .from('memes')
    .select('*')
    .eq('id', id)
    .single();

  if (memeError || !meme) return res.status(404).json({ error: "Meme not found" });

  const tagString = meme.tags.join(', ');

  // Prompts
  const captionPrompt = `Funny	caption	for	meme	with	tags: ${tagString} and return a single line.`;
const vibePrompt = `Give a short, 2–4 word description of the meme's vibe. Only return the vibe. Tags: ${tagString}`;


  const caption = await generateGeminiText(captionPrompt) || "YOLO to the moon!";
  const vibe = await generateGeminiText(vibePrompt) || "Retro Stonks Vibes";

  const { error: updateError } = await supabase
    .from('memes')
    .update({ caption, vibe })
    .eq('id', id);

  if (updateError) return res.status(500).json({ error: updateError });

  res.json({ caption, vibe });
};

module.exports = {
  createMeme,
  getAllMemes,
  voteMeme,
  getLeaderboard,
  placeBid,
  generateCaptionAndVibe
};
