import prisma from "@/app/lib/prisma";
import { Post } from "@/app/types/post";
import Image from "next/image";
import Link from "next/link";
import { LuArrowRight } from "react-icons/lu";

export default async function RecentPosts() {
  let posts: Post[] = [];

  try {
    posts = await prisma.post.findMany({
      orderBy: { createdAt: "desc" },
      take: 6,
      select: {
        id: true,
        title: true,
        slug: true,
        excerpt: true,
        coverImageUrl: true,
        createdAt: true,
      },
    }) as unknown as Post[];
  } catch {
    // return empty list gracefully if DB is unavailable
  }

  return (
    <div className="space-y-2">
      <h1 className="text-amber-50 text-xl sm:text-2xl md:text-3xl font-semibold">
        Recent Posts
      </h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {posts.map((post) => (
          <div
            key={post.id}
            className="group relative rounded-xl overflow-hidden bg-white/10 border border-white/10 transition-all duration-300 hover:-translate-y-1 hover:border-white/30"
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
            </div>
            <div className="p-5 space-y-3">
              <time className="text-xs text-gray-400">
                {new Date(post.createdAt).toLocaleDateString("en-GB", {
                  day: "2-digit",
                  month: "short",
                  year: "numeric",
                })}
              </time>
              <h3 className="text-lg font-semibold text-white leading-snug group-hover:text-indigo-400 transition-colors">
                {post.title}
              </h3>
              <p className="text-sm text-gray-400 leading-relaxed line-clamp-3">
                {post.excerpt}
              </p>
              <Link
                href={`/articles/${post.slug}`}
                className="flex text-sm font-medium text-indigo-400 hover:underline"
              >
                Read more <LuArrowRight size={20} />
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
