 
import BlogView from "@/app/components/blog-page/BlogView";
import PostViewSkeleton from "@/app/components/skeletons/PostViewSkeleton";
import { getPostBySlug } from "@/app/server-actions/getPost";
import { Suspense } from "react";

export default async function PostViewPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {

  const slug = (await params).slug;
  const postPromise = getPostBySlug(slug);
  return (
    <Suspense fallback={ <PostViewSkeleton/> }>
      <BlogView postPromise={postPromise}/>
    </Suspense>
  )
}