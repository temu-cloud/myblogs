 
 
import { auth } from "@/app/lib/auth";
import prisma from "@/app/lib/prisma";
import {
  CloudinaryUploadResult,
  deleteFromCloudinary,
  uploadToCloudinary,
} from "@/app/services/cloudinary";
import { headers } from "next/headers";
import { NextResponse } from "next/server";
import slugify from "slugify";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ postId: string }> }
) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { postId } = await params;

    if (!postId) {
      return NextResponse.json(
        { error: "Valid post ID is required" },
        { status: 400 }
      );
    }

    const post = await prisma.post.findUnique({
      where: { id: postId },
    });

    if (!post) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }

    if (post.authorId !== session.user.id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    return NextResponse.json(post, { status: 200 });
  } catch (error) {
    console.error("FETCH_POST_ERROR:", error);
    return NextResponse.json(
      { error: "Failed to fetch post" },
      { status: 500 }
    );
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ postId: string }> }
) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { postId } = await params;

    const existingPost = await prisma.post.findUnique({
      where: { id: postId },
    });

    if (!existingPost) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }

    if (existingPost.authorId !== session.user.id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const formData = await req.formData();
    const title = formData.get("title") as string;
    const content = formData.get("content") as string;
    const excerpt = formData.get("excerpt") as string;
    const coverImage = formData.get("coverImage") as File;

    let slug = existingPost.slug;

    if (title && title !== existingPost.title) {
      const baseSlug = slugify(title, {
        lower: true,
        strict: true,
        trim: true,
      });

      let uniqueSlug = baseSlug;
      const counter = 1;

      while (
        await prisma.post.findFirst({
          where: {
            slug: uniqueSlug,
            NOT: { id: postId },
          },
        })
      ) {
        uniqueSlug = `${baseSlug}-${counter}`;
      }

      slug = uniqueSlug;
    }

    let imageData: CloudinaryUploadResult | null = null;

    if (coverImage) {
      imageData = await uploadToCloudinary(coverImage);

      if (imageData && existingPost.coverImagePublicId) {
        await deleteFromCloudinary(existingPost.coverImagePublicId);
      }
    }

    const updatedPost = await prisma.post.update({
      where: { id: postId },
      data: {
        title: title ?? existingPost.title,
        slug,
        content: content ?? existingPost.content,
        excerpt: excerpt ?? existingPost.excerpt,
        ...(imageData && {
          coverImageUrl: imageData.secure_url,
          coverImagePublicId: imageData.public_id,
        }),
      },
    });

    return NextResponse.json(updatedPost, { status: 200 });
  } catch (error) {
    console.error("UPDATE_POST_ERROR:", error);
    return NextResponse.json(
      { error: "Failed to update post" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ postId: string }> }
) {
  try {
    const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { postId } = await params;

  const post = await prisma.post.findUnique({
    where: { id: postId },
  });

  if (!post) {
    return NextResponse.json({ error: "Post not found" }, { status: 404 });
  }

  if (post.coverImagePublicId) {
    await deleteFromCloudinary(post.coverImagePublicId);
  }

  await prisma.post.delete({
    where: { id: postId },
  });

  return NextResponse.json(
    { message: "Post deleted successfully" },
    { status: 200 }
  );
  } catch (error) {
     console.error("DELETE_POST_ERROR:", error);

    return NextResponse.json(
      { error: "Failed to delete post" },
      { status: 500 }
    );   
  }
}