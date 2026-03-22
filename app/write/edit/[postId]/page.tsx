"use client";
import EditPageSkeleton from "@/app/components/skeletons/EditPageSkeleton";
import axios from "axios";
import dynamic from "next/dynamic";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
import toast from "react-hot-toast";

const JoditEditor = dynamic(() => import("jodit-react"), {
  ssr: false,
});

export default function EditPage() {
  const editor = useRef(null);
  const [content, setContent] = useState("");
  const [title, setTitle] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [coverImage, setCoverImage] = useState<null | File>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [previewImage, setPreviewImage] = useState("");
  const [loading, setLoading] = useState(true);
  const { postId } = useParams();
  const router = useRouter();

  const config = useMemo(
    () => ({
      placeholder: "Start writing your article...",
      theme: "dark",
      style: {
        background: "#121212",
        color: "#d1d5dc",
      },
    }),
    []
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      if (!title || !excerpt || !content) {
        toast("Title, Excerpt and Content are required!", {
          style: {
            color: "white",
            background: "#1e3a8a",
          },
        });
        return;
      }

      setIsSubmitting(true);

      const formData = new FormData();
      formData.append("title", title);
      formData.append("excerpt", excerpt);
      formData.append("content", content);
      if (coverImage) {
        formData.append("coverImage", coverImage);
      }

      const response = await axios.patch(`/api/posts/${postId}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      

      toast("Article updated successfully", {
        style: {
          color: "white",
          background: "#1e3a8a",
        },
      });

      const slug = response.data.slug

      router.replace(`/articles/${slug}`)
    } catch (error) {
      if (axios.isAxiosError(error)) {
        //toast to the user about the error

        toast(error.response?.data.error, {
          style: {
            color: "white",
            background: "#1e3a8a",
          },
        });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const { data } = await axios.get(`/api/posts/${postId}`);

        setTitle(data.title);
        setContent(data.content);
        setExcerpt(data.excerpt);
        setPreviewImage(data.coverImageUrl);
      } catch (error) {
        if (axios.isAxiosError(error)) {
          console.error("AXIOS_ERROR:", error.response?.data);
          alert(error.response?.data?.error || "Failed to load post");
        } else {
          console.error("UNKNOWN_ERROR:", error);
          alert("An unexpected error occurred");
        }
      } finally {
        setLoading(false);
      }
    };

    if (postId) {
      fetchPost();
    }
  }, [postId]);

  if (loading) return <EditPageSkeleton />;
  return (
    <section className="max-w-3xl mx-auto py-20 px-6">
      {/* page title */}
      <h1 className="text-3xl font-bold text-white mb-10">Edit your article</h1>

      <form onSubmit={handleSubmit}>
        {/* title */}
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          type="text"
          placeholder="Article title"
          className="w-full bg-transparent text-4xl font-bold text-white placeholder-gray-500 outline-none mb-6"
        />

        {/* excerpt */}
        <textarea
          value={excerpt}
          onChange={(e) => setExcerpt(e.target.value)}
          placeholder="Write a short excerpt (1–2 sentences)"
          rows={3}
          className=" w-full bg-secondary-background
          text-gray-200 placeholder-gray-500
          rounded-xl p-4 mb-8
          outline-none resize-none
          border border-white/10
          focus:border-indigo-500/50"
        />

        {/* image upload */}
        <div className="mb-10">
          <label className="block text-gray-400 mb-2">Cover Image</label>
          <input
            onChange={(e) => setCoverImage(e.target.files?.[0] || null)}
            type="file"
            accept="image/*"
            className="block w-full text-sm text-gray-400
            file:mr-4 file:py-2 file:px-4
            file:rounded-full
            file:border-0
            file:bg-primary
            file:text-white
            hover:file:bg-indigo-500"
          />
        </div>

        {/* image-preview */}
        <div className="my-8">
          <Image
            src={previewImage}
            alt="image-preview"
            width={300}
            height={300}
            className="object-cover"
          />
        </div>

        {/* editor */}
        <div className="rounded-2xl overflow-hidden border border-white/10 mb-10">
          <JoditEditor
            ref={editor}
            value={content}
            config={config}
            onChange={(newContent) => setContent(newContent)}
          />
        </div>

        <div className="flex justify-end">
          <button className="px-6 py-3 rounded-full bg-primary cursor-pointer text-white font-semibold transition-colors">
            {isSubmitting ? "Updating..." : "Update"}
          </button>
        </div>
      </form>
    </section>
  );
}