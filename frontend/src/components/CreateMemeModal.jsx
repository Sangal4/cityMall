import React from "react";
import MemeForm from "./MemeForm";
import cross from '../assets/cross.png'

export default function CreateMemeModal({ open, onClose, onSubmit }) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center animate-fadeIn">
      {/* Overlay Blur */}
      <div
        className="absolute inset-0 backdrop-blur-md bg-cyan-400/10 animate-pulse"
        onClick={onClose}
      />

      {/* Modal Box */}
      <div className="relative z-10 bg-black border-2 border-[var(--neon-pink)] p-6 rounded-xl w-[90%] max-w-xl shadow-2xl text-white neon-glow animate-slideIn">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-center cyberpunk-text">
            <span className="text-[var(--neon-pink)]">Create</span>{" "}
            <span className="text-[var(--neon-blue)]">Meme</span>
          </h2>
          <img 
            src={cross} 
            alt="Close" 
            className="w-[20px] h-[20px] hover:scale-110 transition-transform duration-300 cursor-pointer" 
            onClick={onClose} 
          />
        </div>
        <MemeForm onClose={onClose} onSubmit={onSubmit} />
      </div>
    </div>
  );
}
