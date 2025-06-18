const supabase = require("../services/supabaseClient");

class Meme {
  constructor({ id, title, image_url, tags, upvotes = 0, caption = null, vibe = null }) {
    this.id = id;
    this.title = title;
    this.image_url = image_url;
    this.tags = tags;
    this.upvotes = upvotes;
    this.caption = caption;
    this.vibe = vibe;
  }

  static async create({ title, image_url, tags }) {
    const defaultImage = "https://picsum.photos/200";
    const image = image_url || defaultImage;

    const { data, error } = await supabase
      .from("memes")
      .insert([{ title, image_url: image, tags }])
      .select()
      .single();

    if (error) throw error;
    return new Meme(data);
  }

  static async findAll() {
    const { data, error } = await supabase
      .from("memes")
      .select("*")
      .order("upvotes", { ascending: false });

    if (error) throw error;
    return data.map(meme => new Meme(meme));
  }

  static async findById(id) {
    const { data, error } = await supabase
      .from("memes")
      .select("*")
      .eq("id", id)
      .single();

    if (error) throw error;
    return new Meme(data);
  }

  static async updateVotes(id, type) {
    const increment = type === "up" ? 1 : -1;
    const memeId = parseInt(id, 10);
    // fetch current upvotes
    const { data, error: fetchErr } = await supabase
      .from('memes')
      .select('upvotes')
      .eq('id', memeId)
      .single();
    if (fetchErr) throw fetchErr;
    const newCount = (data.upvotes || 0) + increment;
    const { data: updated, error: updateErr } = await supabase
      .from('memes')
      .update({ upvotes: newCount, updated_at: new Date().toISOString() })
      .eq('id', memeId)
      .select()
      .single();
    if (updateErr) throw updateErr;
    return new Meme(updated);
  }
  
  static async updateCaptionAndVibe(id, caption, vibe) {
    const { error } = await supabase
      .from("memes")
      .update({ caption, vibe })
      .eq("id", id);

    if (error) throw error;
    return this.findById(id);
  }

  static async getLeaderboard(top = 10) {
    const { data: memes, error } = await supabase
      .from('memes')
      .select('*')
      .order('upvotes', { ascending: false })
      .limit(top);

    if (error) throw error;

    const enrichedMemes = await Promise.all(memes.map(async (meme) => {
      const { data: topBid } = await supabase
        .from('bids')
        .select('credits, user_id')
        .eq('meme_id', meme.id)
        .order('credits', { ascending: false })
        .limit(1)
        .single();

      return {
        ...new Meme(meme),
        topBid: topBid || { credits: 0, user_id: '—' }
      };
    }));

    return enrichedMemes;
  }
}

module.exports = Meme;
