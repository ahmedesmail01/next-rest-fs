import connect from "@/app/lib/db";
import Blog from "@/app/lib/modals/blog";
import Category from "@/app/lib/modals/category";
import User from "@/app/lib/modals/user";
import { FilterQuery, Types } from "mongoose";
import { NextResponse } from "next/server";

interface BlogDocument {
  user: Types.ObjectId;
  category: Types.ObjectId;
  title?: string;
  description?: string;
}

export const GET = async (request: Request) => {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");
    const categoryId = searchParams.get("categoryId");
    const searchKey = searchParams.get("searchKey") as string;
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "2");

    if (
      !userId ||
      !categoryId ||
      !Types.ObjectId.isValid(userId) ||
      !Types.ObjectId.isValid(categoryId)
    ) {
      return NextResponse.json(
        { message: "Invalid or missing userId or categoryId" },
        { status: 400 }
      );
    }

    await connect();
    const user = await User.findById(userId);
    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    const category = await Category.findById(categoryId);
    if (!category) {
      return NextResponse.json(
        { message: "Category not found" },
        { status: 404 }
      );
    }

    const filter: FilterQuery<BlogDocument> = {
      user: new Types.ObjectId(userId),
      category: new Types.ObjectId(categoryId),
    };

    if (searchKey) {
      filter.$or = [
        {
          title: { $regex: searchKey, $options: "i" },
        },
        {
          description: { $regex: searchKey, $options: "i" },
        },
      ];
    }

    const skip = (page - 1) * limit;
    const blogs = await Blog.find(filter)
      .sort({ createdAt: "asc" })
      .skip(skip)
      .limit(limit);

    return NextResponse.json(
      { message: "Blog found", blog: blogs },
      { status: 200 }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "Error in fetching blog" },
      { status: 500 }
    );
  }
};

export const POST = async (request: Request) => {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");
    const categoryId = searchParams.get("categoryId");

    const body = await request.json();
    const { title, description } = body;

    if (
      !categoryId ||
      !userId ||
      !Types.ObjectId.isValid(categoryId) ||
      !Types.ObjectId.isValid(userId)
    ) {
      return NextResponse.json(
        {
          message: "Invalid or missing userId or categoryId",
        },
        {
          status: 400,
        }
      );
    }

    await connect();
    const newBlog = new Blog({
      title,
      description,
      user: new Types.ObjectId(userId),
      category: new Types.ObjectId(categoryId),
    });

    await newBlog.save();

    return NextResponse.json(
      { message: "new blog added ", newBlog },
      { status: 200 }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "Error in posting blog" },
      { status: 500 }
    );
  }
};
