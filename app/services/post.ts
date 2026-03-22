import { FetchPostsParams, FetchPostsResponse } from "@/app/types/post";
import axios from "axios";

export async function fetchPosts({
  pageParam,
  limit,
}: FetchPostsParams): Promise<FetchPostsResponse> {
  const res = await axios.get("api/posts", {
    params: {
      cursor: pageParam,
      limit,
    },
  });

  return res.data;
}


export async function deletePost(postId:string){
  const res = await axios.delete(`/api/posts/${postId}`);
  return res.data;
}

export async function searchPosts(query:string){
  if(!query) return [];

  const res = await axios.get("/api/posts/search",{
    params:{
      q:query
    }
  });

  return res.data.posts;
}