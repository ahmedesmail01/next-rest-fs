import connect from "@/app/lib/db";
import Blog from "@/app/lib/modals/blog";
import { Types } from "mongoose";
import { NextResponse } from "next/server";

interface Context {
  params: {
    blog: string;
  };
}

export const GET = async (request: Request, context: Context) => {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");
    const categoryId = searchParams.get("categoryId");
    const blogId = context.params.blog;

    if (
      !userId ||
      !Types.ObjectId.isValid(userId) ||
      !categoryId ||
      !Types.ObjectId.isValid(categoryId) ||
      !Types.ObjectId.isValid(blogId) ||
      !blogId
    ) {
      return NextResponse.json(
        { message: "Invalid or missing userId or categoryId or blogId" },
        { status: 400 }
      );
    }

    await connect();
    const blog = await Blog.findOne({
      _id: blogId,
      user: userId,
      category: categoryId,
    });

    if (!blog) {
      return NextResponse.json({ message: "Blog not found" }, { status: 404 });
    }

    return NextResponse.json(blog, { status: 200 });
  } catch (error) {
    console.error("Error: " + error);
    return NextResponse.json(
      { message: "Error in fetching blog" },
      { status: 500 }
    );
  }
};

export const PATCH = async (request: Request, context: Context) => {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");
    const categoryId = searchParams.get("categoryId");
    const blogId = context.params.blog;
    const body = await request.json();
    const { title, decription } = body;

    if (
      !userId ||
      !Types.ObjectId.isValid(userId) ||
      !categoryId ||
      !Types.ObjectId.isValid(categoryId) ||
      !Types.ObjectId.isValid(blogId) ||
      !blogId
    ) {
      return NextResponse.json(
        { message: "Invalid or missing userId or categoryId or blogId" },
        { status: 400 }
      );
    }

    await connect();
    const updatedBlog = await Blog.findByIdAndUpdate(
      blogId,
      {
        title,
        decription,
      },
      { new: true }
    );

    if (!updatedBlog) {
      return NextResponse.json({ message: "Blog not found" }, { status: 404 });
    }

    return NextResponse.json(
      { message: "Blog is updated", blog: updatedBlog },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error: " + error);
    return NextResponse.json(
      { message: "Error in updating blog" },
      { status: 500 }
    );
  }
};

export const DELETE = async (request: Request, context: Context) => {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");
    const blogId = context.params.blog;
    if (
      !userId ||
      !Types.ObjectId.isValid(userId) ||
      !blogId ||
      !Types.ObjectId.isValid(blogId)
    ) {
      return NextResponse.json(
        { message: "Invalid or missing userId or blogId" },
        { status: 400 }
      );
    }

    await connect();
    const deletedBlog = await Blog.findByIdAndDelete(blogId);
    if (!deletedBlog) {
      return NextResponse.json({ message: "Blog not found" }, { status: 404 });
    }
    return NextResponse.json(
      { message: "Blog is deleted", deletedBlog },
      { status: 200 }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "Error in deleting  blog" },
      { status: 500 }
    );
  }
};
