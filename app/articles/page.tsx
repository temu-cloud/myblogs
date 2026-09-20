"use client";
import Link from "next/link";
import { LuArrowRight } from "react-icons/lu";
import Image from "next/image";
import ContainerLayout from "../layouts/ContainerLayout";
import { useInfinitePosts } from "../custom-hooks/usePost";
import PostCardSkeleton from "../components/skeletons/PostCardSkeleton";

export default function ArticlesPage() {
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, status } =
    useInfinitePosts({ limit: 6 });

  if (status === "pending") {
    return (
      <ContainerLayout>
        <PostCardSkeleton />
      </ContainerLayout>
    );
  }

  const posts = data?.pages.flatMap((page) => page.posts) ?? [];

  return (
    <ContainerLayout>
      <div className="pb-24">
        {/* Header */}
        <div className="mb-12">
          <p className="text-indigo-400 text-sm font-semibold uppercase tracking-widest mb-2">
            Portfolio
          </p>
          <h1 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            Projects & Articles
          </h1>
          <p className="text-gray-400 max-w-xl">
            A collection of things I&apos;ve built, written about, and learned along the way.
          </p>
        </div>

        {status === "error" && (
          <p className="text-gray-400 text-center py-20">Unable to load posts.</p>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {posts.map((post) => (
            <article
              key={post.id}
              className="group flex flex-col rounded-2xl overflow-hidden bg-secondary-background border border-white/5 card-glow transition-all duration-300 hover:-translate-y-1"
            >
              <div className="relative h-48 w-full overflow-hidden">
                {post.coverImageUrl && (
                  <Image
                    src={post.coverImageUrl}
                    alt={post.title}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
              </div>

              <div className="flex flex-col flex-1 p-5 space-y-3">
                <time className="text-xs text-gray-500 font-medium">
                  {new Date(post.createdAt).toLocaleDateString("en-GB", {
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                  })}
                </time>
                <h2 className="text-base font-semibold text-white leading-snug group-hover:text-indigo-400 transition-colors line-clamp-2">
                  {post.title}
                </h2>
                <p className="text-sm text-gray-400 leading-relaxed line-clamp-3 flex-1">
                  {post.excerpt}
                </p>
                <Link
                  href={`/articles/${post.slug}`}
                  className="inline-flex items-center gap-1 text-sm font-medium text-indigo-400 hover:text-indigo-300 transition-colors mt-auto"
                >
                  Read more <LuArrowRight size={14} />
                </Link>
              </div>
            </article>
          ))}
        </div>

        {hasNextPage && (
          <div className="flex justify-center mt-12">
            <button
              onClick={() => fetchNextPage()}
              disabled={isFetchingNextPage}
              className="px-8 py-3 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 text-white text-sm font-medium transition-all duration-200 disabled:opacity-50"
            >
              {isFetchingNextPage ? "Loading..." : "Load more"}
            </button>
          </div>
        )}
      </div>
    </ContainerLayout>
  );
}
