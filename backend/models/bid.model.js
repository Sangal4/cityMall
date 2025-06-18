const supabase = require("../services/supabaseClient");

class Bid {
  constructor({ id, meme_id, user_id, credits }) {
    this.id = id;
    this.meme_id = meme_id;
    this.user_id = user_id;
    this.credits = credits;
  }

  static async create({ meme_id, user_id, credits }) {
    const { data, error } = await supabase
      .from('bids')
      .insert([{ meme_id, user_id, credits }])
      .select()
      .single();

    if (error) throw error;
    return new Bid(data);
  }

  static async getHighestBid(meme_id) {
    const { data, error } = await supabase
      .from('bids')
      .select('credits, user_id')
      .eq('meme_id', meme_id)
      .order('credits', { ascending: false })
      .limit(1)
      .single();

    if (error) return null;
    return data;
  }

  static async getBidsByMeme(meme_id) {
    const { data, error } = await supabase
      .from('bids')
      .select('*')
      .eq('meme_id', meme_id)
      .order('credits', { ascending: false });

    if (error) throw error;
    return data.map(bid => new Bid(bid));
  }

  static async getUserBids(user_id) {
    const { data, error } = await supabase
      .from('bids')
      .select('*')
      .eq('user_id', user_id)
      .order('credits', { ascending: false });

    if (error) throw error;
    return data.map(bid => new Bid(bid));
  }

  static async getBidHistory(meme_id) {
    const { data, error } = await supabase
      .from('bids')
      .select('*')
      .eq('meme_id', meme_id)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data.map(bid => new Bid(bid));
  }
}

module.exports = Bid;
