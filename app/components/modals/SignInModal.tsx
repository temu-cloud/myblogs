"use client";
import { useModalStore } from "@/app/store/useModalStore";
import Modal from "./Modal";
import { FaGithub, FaGoogle } from "react-icons/fa";
import { authClient } from "@/app/lib/auth-client";

export default function SignInModal() {
  const { isSignInOpen, closeSignIn } = useModalStore();

  const signInWithGoogle = async () => {
    await authClient.signIn.social({ provider: "google" });
  };

  const signInWithGitHub = async () => {
    await authClient.signIn.social({ provider: "github" });
  };

  return (
    <Modal isOpen={isSignInOpen} onClose={closeSignIn}>
      <div className="text-center mb-6">
        <h2 className="text-xl font-bold text-white mb-2">Welcome back</h2>
        <p className="text-sm text-gray-400">Sign in to like and comment on posts</p>
      </div>

      <div className="space-y-3">
        <button
          onClick={signInWithGoogle}
          className="w-full flex items-center justify-center gap-3 py-3 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 text-white font-medium text-sm transition-all"
        >
          <FaGoogle className="text-red-400" /> Continue with Google
        </button>
        <button
          onClick={signInWithGitHub}
          className="w-full flex items-center justify-center gap-3 py-3 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 text-white font-medium text-sm transition-all"
        >
          <FaGithub className="text-purple-400" /> Continue with GitHub
        </button>
      </div>

      <p className="text-xs text-gray-600 text-center mt-6">
        By signing in you agree to the site&apos;s terms of use.
      </p>
    </Modal>
  );
}
