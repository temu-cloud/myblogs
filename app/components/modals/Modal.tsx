import React from 'react'
import { LuX } from 'react-icons/lu'

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

export default function Modal({ isOpen, onClose, children }: ModalProps) {
  return (
    <div
      aria-hidden={!isOpen}
      className={`fixed inset-0 z-50 flex items-center justify-center px-4 transition-opacity duration-300 ${isOpen ? "opacity-100" : "opacity-0 pointer-events-none"}`}
    >
      <div
        onClick={onClose}
        className={`absolute inset-0 bg-black/70 backdrop-blur-sm transition-opacity duration-300 ${isOpen ? "opacity-100" : "opacity-0"}`}
      />
      <div
        className={`relative z-10 w-full max-w-md rounded-2xl bg-secondary-background border border-white/10 px-6 py-8 shadow-2xl transform transition-all duration-300 ${isOpen ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"}`}
      >
        <button
          className="absolute right-4 top-4 cursor-pointer text-gray-500 hover:text-white transition"
          aria-label="Close modal"
          onClick={onClose}
        >
          <LuX size={18} />
        </button>
        {children}
      </div>
    </div>
  );
}
