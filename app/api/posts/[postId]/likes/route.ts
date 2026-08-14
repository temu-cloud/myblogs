import { auth } from "@/app/lib/auth";
import prisma from "@/app/lib/prisma";
import { headers } from "next/headers";
import { NextResponse } from "next/server";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ postId: string }> }
) {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    const { postId } = await params;

    const count = await prisma.like.count({ where: { postId } });

    const liked = session?.user.id
      ? !!(await prisma.like.findUnique({
          where: { userId_postId: { userId: session.user.id, postId } },
        }))
      : false;

    return NextResponse.json({ count, liked });
  } catch (error) {
    console.error("FETCH_LIKES_ERROR:", error);
    return NextResponse.json({ error: "Failed to fetch likes" }, { status: 500 });
  }
}

export async function POST(
  _req: Request,
  { params }: { params: Promise<{ postId: string }> }
) {
  try {
    const session = await auth.api.getSession({ headers: await headers() });

    if (!session?.user.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { postId } = await params;
    const userId = session.user.id;

    const existing = await prisma.like.findUnique({
      where: { userId_postId: { userId, postId } },
    });

    if (existing) {
      await prisma.like.delete({ where: { userId_postId: { userId, postId } } });
    } else {
      await prisma.like.create({ data: { userId, postId } });
    }

    const count = await prisma.like.count({ where: { postId } });
    return NextResponse.json({ count, liked: !existing });
  } catch (error) {
    console.error("TOGGLE_LIKE_ERROR:", error);
    return NextResponse.json({ error: "Failed to toggle like" }, { status: 500 });
  }
}
