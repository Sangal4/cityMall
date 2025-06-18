import { useState } from "react";

export default function MemeForm({ onClose, onSubmit }) {
  const [form, setForm] = useState({ title: "", image_url: "", tags: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    const tagsArray = form.tags.split(",").map((tag) => tag.trim());

    try {
      await onSubmit(form, tagsArray);
      setForm({ title: "", image_url: "", tags: "" });
    } catch (error) {
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-6 animate-fadeIn"
    >
      <div className="space-y-2">
        <label className="block text-[var(--neon-blue)] text-sm font-bold">
          Title
        </label>
        <input
          type="text"
          placeholder="Enter meme title..."
          className="w-full p-3 bg-black/50 border-2 border-[var(--neon-pink)] rounded-lg focus:border-[var(--neon-blue)] focus:outline-none transition-colors duration-300 text-white placeholder-gray-400"
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
          required
        />
      </div>

      <div className="space-y-2">
        <label className="block text-[var(--neon-blue)] text-sm font-bold">
          Image URL
        </label>
        <input
          type="text"
          placeholder="Paste image URL here..."
          className="w-full p-3 bg-black/50 border-2 border-[var(--neon-pink)] rounded-lg focus:border-[var(--neon-blue)] focus:outline-none transition-colors duration-300 text-white placeholder-gray-400"
          value={form.image_url}
          onChange={(e) => setForm({ ...form, image_url: e.target.value })}
          required
        />
      </div>

      <div className="space-y-2">
        <label className="block text-[var(--neon-blue)] text-sm font-bold">
          Tags
        </label>
        <input
          type="text"
          placeholder="funny, meme, viral (comma-separated)"
          className="w-full p-3 bg-black/50 border-2 border-[var(--neon-pink)] rounded-lg focus:border-[var(--neon-blue)] focus:outline-none transition-colors duration-300 text-white placeholder-gray-400"
          value={form.tags}
          onChange={(e) => setForm({ ...form, tags: e.target.value })}
          required
        />
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className={`w-full cyberpunk-btn py-3 text-lg font-bold transition-all duration-300 ${
          isSubmitting 
            ? 'opacity-50 cursor-not-allowed' 
            : 'hover:scale-105 hover:shadow-[0_0_15px_var(--neon-pink)]'
        }`}
      >
        {isSubmitting ? (
          <span className="flex items-center justify-center">
            <span className="animate-spin mr-2">⚡</span>
            Creating...
          </span>
        ) : (
          '✨ Create Meme'
        )}
      </button>
    </form>
  );
}
