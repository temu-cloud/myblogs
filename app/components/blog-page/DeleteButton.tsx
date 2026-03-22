import {useDeletePost}from "@/app/custom-hooks/usePost"
 
import toast from "react-hot-toast";
import { LuTrash } from "react-icons/lu";

export default function DeleteButton({ postId }: { postId: string }) {
  const { mutate: deletePostMutation, isPending } = useDeletePost();

  const handleDelete = () => {
    const confirmed = confirm("Are you sure you want to delete this post!");

    if (confirmed) {
      deletePostMutation(postId, {
        onSuccess: () => {
          toast("Article deleted successfully", {
            style: {
              color: "white",
              background: "#1e3a8a",
            },
          });
        },
      });
    }
  };
  return (
    <button
    onClick={handleDelete}
    disabled={isPending}
      type="button"
      className="  inline-flex items-center gap-2
             px-3 py-1.5 rounded-full
             text-sm font-medium
             text-red-400
             border border-red-400/20
             hover:border-red-400/40
             hover:bg-red-400/10
             transition cursor-pointer
             disabled:cursor-not-allowed"
    >
      <LuTrash />
      Delete
    </button>
  );
}