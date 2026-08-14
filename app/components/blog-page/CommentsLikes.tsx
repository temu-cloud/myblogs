"use client";

import { authClient } from "@/app/lib/auth-client";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import Image from "next/image";
import { useState } from "react";
import { LuHeart, LuMessageCircle } from "react-icons/lu";

interface Comment {
  id: string;
  content: string;
  createdAt: string;
  author: {
    id: string;
    name: string;
    image: string | null;
  };
}

interface LikeData {
  count: number;
  liked: boolean;
}

interface CommentsLikesProps {
  postId: string;
}

export default function CommentsLikes({ postId }: CommentsLikesProps) {
  const { data: session } = authClient.useSession();
  const queryClient = useQueryClient();
  const [commentText, setCommentText] = useState("");

  const { data: comments = [] } = useQuery<Comment[]>({
    queryKey: ["comments", postId],
    queryFn: async () => {
      const { data } = await axios.get(`/api/posts/${postId}/comments`);
      return data;
    },
  });

  const { data: likeData } = useQuery<LikeData>({
    queryKey: ["likes", postId],
    queryFn: async () => {
      const { data } = await axios.get(`/api/posts/${postId}/likes`);
      return data;
    },
  });

  const likeMutation = useMutation({
    mutationFn: async () => {
      const { data } = await axios.post(`/api/posts/${postId}/likes`);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["likes", postId] });
    },
  });

  const commentMutation = useMutation({
    mutationFn: async (content: string) => {
      const { data } = await axios.post(`/api/posts/${postId}/comments`, { content });
      return data;
    },
    onSuccess: () => {
      setCommentText("");
      queryClient.invalidateQueries({ queryKey: ["comments", postId] });
    },
  });

  const handleComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (commentText.trim()) {
      commentMutation.mutate(commentText);
    }
  };

  return (
    <div className="mt-12 space-y-10">
      {/* Like section */}
      <div className="flex items-center gap-3">
        {session ? (
          <button
            onClick={() => likeMutation.mutate()}
            disabled={likeMutation.isPending}
            className={`flex items-center gap-2 px-4 py-2 rounded-full border transition
              ${likeData?.liked
                ? "border-indigo-400 text-indigo-400 bg-indigo-400/10"
                : "border-white/20 text-gray-400 hover:border-indigo-400/40 hover:text-indigo-400"
              }`}
          >
            <LuHeart size={18} className={likeData?.liked ? "fill-indigo-400" : ""} />
            <span className="text-sm font-medium">{likeData?.count ?? 0}</span>
          </button>
        ) : (
          <div className="flex items-center gap-2 text-gray-500 text-sm">
            <LuHeart size={18} />
            <span>{likeData?.count ?? 0} likes</span>
          </div>
        )}
      </div>

      {/* Comments section */}
      <div>
        <h3 className="flex items-center gap-2 text-white font-semibold text-lg mb-6">
          <LuMessageCircle size={20} />
          Comments {comments.length > 0 && <span className="text-gray-400 font-normal text-base">({comments.length})</span>}
        </h3>

        {/* Comment input */}
        {session ? (
          <form onSubmit={handleComment} className="mb-8">
            <textarea
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              placeholder="Share your thoughts..."
              rows={3}
              className="w-full bg-secondary-background text-gray-200 placeholder-gray-500
                rounded-xl p-4 mb-3 outline-none resize-none
                border border-white/10 focus:border-indigo-500/50 transition"
            />
            <div className="flex justify-end">
              <button
                type="submit"
                disabled={!commentText.trim() || commentMutation.isPending}
                className="px-5 py-2 rounded-full bg-primary text-white text-sm font-semibold
                  disabled:opacity-50 disabled:cursor-not-allowed hover:bg-indigo-700 transition"
              >
                {commentMutation.isPending ? "Posting..." : "Post comment"}
              </button>
            </div>
          </form>
        ) : (
          <p className="text-gray-500 text-sm mb-8">
            <span
              className="text-indigo-400 cursor-pointer hover:text-indigo-300 transition"
              onClick={() => {
                // trigger sign-in modal — handled by the global modal store if needed
                document.dispatchEvent(new CustomEvent("open-signin"));
              }}
            >
              Sign in
            </span>{" "}
            to like and comment on this article.
          </p>
        )}

        {/* Comment list */}
        {comments.length === 0 ? (
          <p className="text-gray-600 text-sm">No comments yet. Be the first to share your thoughts.</p>
        ) : (
          <ul className="space-y-6">
            {comments.map((comment) => (
              <li key={comment.id} className="flex gap-3">
                <div className="relative w-9 h-9 rounded-full overflow-hidden flex-shrink-0 mt-0.5">
                  {comment.author.image ? (
                    <Image
                      src={comment.author.image}
                      alt={comment.author.name}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-indigo-900 flex items-center justify-center text-indigo-300 text-sm font-bold">
                      {comment.author.name[0]?.toUpperCase()}
                    </div>
                  )}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-white text-sm font-medium">{comment.author.name}</span>
                    <span className="text-gray-600 text-xs">
                      {new Date(comment.createdAt).toLocaleDateString("en-GB", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                      })}
                    </span>
                  </div>
                  <p className="text-gray-400 text-sm leading-relaxed">{comment.content}</p>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
