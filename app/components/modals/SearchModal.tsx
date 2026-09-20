"use client";
import { useModalStore } from "@/app/store/useModalStore";
import { useState } from "react";
import Modal from "./Modal";
import { useDebounce } from "@/app/custom-hooks/usePost";
import { useQuery } from "@tanstack/react-query";
import { searchPosts } from "@/app/services/post";
import { Post } from "@/app/types/post";
import { useRouter } from "next/navigation";
import { LuSearch } from "react-icons/lu";

export default function SearchModal() {
  const { isSearchOpen, closeSearch } = useModalStore();
  const [query, setQuery] = useState("");
  const debouncedQuery = useDebounce(query, 400);
  const router = useRouter();

  const { data: results = [], isLoading, isFetching } = useQuery({
    queryKey: ["search-posts", debouncedQuery],
    queryFn: () => searchPosts(debouncedQuery),
    enabled: debouncedQuery.length > 1,
  });

  const handleNavigate = (slug: string) => {
    router.push(`/articles/${slug}`);
    closeSearch();
    setQuery("");
  };

  return (
    <Modal isOpen={isSearchOpen} onClose={closeSearch}>
      <div className="space-y-4">
        <div className="relative">
          <LuSearch size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            type="search"
            placeholder="Search posts..."
            autoFocus
            className="w-full pl-10 pr-4 py-3 rounded-xl border border-white/10 bg-white/5 text-white placeholder-gray-500 outline-none focus:border-indigo-500/50 text-sm transition"
          />
        </div>

        <div className="max-h-72 overflow-y-auto rounded-xl border border-white/5 divide-y divide-white/5">
          {(isLoading || isFetching) && (
            <p className="px-4 py-3 text-gray-500 text-sm">Searching...</p>
          )}
          {!isLoading && debouncedQuery && results.length === 0 && (
            <p className="px-4 py-3 text-gray-500 text-sm">No results found.</p>
          )}
          {results.map((result: Post) => (
            <button
              key={result.id}
              onClick={() => handleNavigate(result.slug)}
              className="w-full text-left px-4 py-3 text-gray-300 hover:text-white hover:bg-white/5 transition-colors text-sm"
            >
              {result.title}
            </button>
          ))}
        </div>
      </div>
    </Modal>
  );
}
