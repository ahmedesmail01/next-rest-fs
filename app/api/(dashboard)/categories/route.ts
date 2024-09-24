import connect from "@/app/lib/db";
import Category from "@/app/lib/modals/category";
import User from "@/app/lib/modals/user";
import { Types } from "mongoose";
import { NextResponse } from "next/server";

export const GET = async (request: Request) => {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");

    if (!userId || !Types.ObjectId.isValid(userId)) {
      return NextResponse.json(
        { message: "Invalid or missing userId " },
        { status: 400 }
      );
    }

    await connect();

    const user = await User.findById(new Types.ObjectId(userId));

    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    const categories = await Category.find({
      user: new Types.ObjectId(userId),
    });

    return NextResponse.json(
      { message: "Category  found", categories },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error: " + error);
    return NextResponse.json(
      { message: "Error in getting categories" },
      { status: 500 }
    );
  }
};

export const POST = async (request: Request) => {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");

    const { title } = await request.json();

    if (!userId || !Types.ObjectId.isValid(userId)) {
      return NextResponse.json(
        { message: "Invalid or missing userId " },
        { status: 400 }
      );
    }

    await connect();

    const user = await User.findById(new Types.ObjectId(userId));

    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    const newCategory = new Category({
      title,
      user: new Types.ObjectId(userId),
    });

    await newCategory.save();

    return NextResponse.json(
      { message: "new category posted", newCategory },
      {
        status: 200,
      }
    );
  } catch (error) {
    console.error("Error: " + error);
    return NextResponse.json(
      { message: "Error in posting category" },
      { status: 500 }
    );
  }
};
