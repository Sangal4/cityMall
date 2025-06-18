const URL = import.meta.env.VITE_BACKEND_URL || "https://citymall-ql76.onrender.com";

// Helper function to ensure proper URL construction
const getApiUrl = (endpoint) => {
  const baseUrl = URL.endsWith('/') ? URL.slice(0, -1) : URL;
  const path = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
  return `${baseUrl}${path}`;
};

export async function addMeme(form, tagsArray) {
  try {
    // console.log(form);

    const res = await fetch(getApiUrl('memes'), {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        title: form.title,
        image_url: form.image_url,
        tags: tagsArray,
      }),
    });

    return res;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export async function getAllMemes() {
  try {
    // console.log(form);

    const res = await fetch(getApiUrl('memes'), {
      method: "GET",
    });

    return res;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export async function voteMeme(id, type) {
  try {
    const res = await fetch(getApiUrl(`memes/${id}/vote`), {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({type}),
    });

    return res;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export async function fetchLeaderboard() {
  try {
    
    const res = await fetch(getApiUrl('leaderboard?top=10'), {
      method: "GET",
    });

    return res;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export async function updateBid(id,bid) {

  
  try {
    const res = await fetch(getApiUrl(`memes/${id}/bid`), {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({credits: parseInt(bid)}),
    });

    return res;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export async function generateCaption(id) {
  try {
    const res = await fetch(getApiUrl(`memes/${id}/caption`), {
      method: "POST"
    });

    return res;
  } catch (error) {
    console.error(error);
    throw error;
  }
}
