"use client"

 
import Image from "next/image";
import Link from "next/link";
import { use } from "react";
import { LuPen  } from "react-icons/lu";
 
import { authClient } from "@/app/lib/auth-client";
import DeleteButton from "./DeleteButton";

interface BlogViewProps {
  postPromise: Promise<{
    id: string;
    title: string;
    content: string;
    excerpt: string;
    createdAt: string | Date;
    slug: string;
    coverImageUrl: string;
    author: {
      id: string;
      name: string;
      image: string | null;
    };
  } | null>;
}

export default function BlogView({ postPromise }: BlogViewProps) {
  const post = use(postPromise);
  const { data: session } = authClient.useSession();
  const userId = session?.user.id;
  return (
    <article className="max-w-3xl mx-auto py-20 px-6">
      {/* article header */}
      <header className="mb-10">
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white leading-tight mb-4">
          {post?.title}
        </h1>

        <div className="flex items-center gap-4 text-sm text-gray-400">
          <div className="relative w-10 h-10 rounded-full overflow-hidden">
            <Image
              src={post?.author.image || ""}
              alt="author-image"
              className="object-cover"
              fill
            />
          </div>
          <span>By {post?.author.name}</span>
          <span>•</span>
          <span>
            {new Date(post?.createdAt as string).toLocaleDateString("en-GB", {
              day: "2-digit",
              month: "short",
              year: "numeric",
            })}
          </span>
        </div>
      </header>

      <div className="relative w-full h-55 sm:h-80 lg:h-105 mb-12">
        <Image
          src={post?.coverImageUrl || ""}
          alt="cover-image"
          className="object-cover rounded-2xl"
          fill
        />
      </div>

      {/* article content */}
      {post?.content && (
        <div
          className="max-w-none text-gray-400 leading-relaxed tracking-wide blog-post"
          dangerouslySetInnerHTML={{ __html: post.content }}
        />
      )}

      <div className="border-t border-white/10 my-16" />

      {userId === post?.author.id && (
        <div className="flex items-center justify-end gap-2">
          <Link
            href={`/write/edit/${post?.id}`}
            className=" inline-flex items-center gap-2
          px-3 py-1.5 rounded-full
          text-sm font-medium
          text-indigo-400
          border border-indigo-400/20
          hover:border-indigo-400/40
          hover:bg-indigo-400/10
          transition"
          >
            <LuPen />
            Edit
          </Link>
        {post?.id  && <DeleteButton postId={post?.id}/>}
        </div>
      )}

      <div className="mt-16">
        <Link
          href="/articles"
          className="text-indigo-400 hover:text-indigo-300 transition-colors"
        >
          ← Back to all articles
        </Link>
      </div>
    </article>
  );
}