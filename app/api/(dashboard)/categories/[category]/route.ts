import connect from "@/app/lib/db";
import User from "@/app/lib/modals/user";
import { Types } from "mongoose";
import { NextResponse } from "next/server";
import Category from "@/app/lib/modals/category";

interface Context {
  params: {
    category: string;
  };
}

export const PATCH = async (request: Request, context: Context) => {
  try {
    const categoryId = context.params.category;
    const body = await request.json();
    const { title } = body;

    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");

    if (
      !userId ||
      !categoryId ||
      !Types.ObjectId.isValid(userId) ||
      !Types.ObjectId.isValid(categoryId)
    ) {
      return NextResponse.json(
        { message: "invalid or missing userId or categoryId" },
        {
          status: 400,
        }
      );
    }

    await connect();
    const user = await User.findById(new Types.ObjectId(userId));

    if (!user) {
      return NextResponse.json({ message: "user not found" }, { status: 404 });
    }

    const category = await Category.findOne({
      _id: categoryId,
      user: userId,
    });

    if (!category) {
      return NextResponse.json(
        { message: "category not found" },
        { status: 404 }
      );
    }

    const updatedCategory = await Category.findByIdAndUpdate(
      categoryId,
      { title },
      { new: true }
    );

    return NextResponse.json(
      { message: "updated category", category: updatedCategory },
      { status: 200 }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "error in editing category name" },
      {
        status: 500,
      }
    );
  }
};

export const DELETE = async (request: Request, context: Context) => {
  try {
    const categoryId = context.params.category;
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");

    if (
      !userId ||
      !categoryId ||
      !Types.ObjectId.isValid(userId) ||
      !Types.ObjectId.isValid(categoryId)
    ) {
      return NextResponse.json(
        { message: "invalid or missing userId or categoryId" },
        {
          status: 400,
        }
      );
    }

    await connect();
    const user = await User.findById(userId);
    if (!user) {
      return NextResponse.json({ message: "user not found" }, { status: 404 });
    }

    const category = await Category.findOne({ _id: categoryId, user: userId });

    if (!category) {
      return NextResponse.json(
        { message: "category not found" },
        { status: 404 }
      );
    }

    const deletedCategory = await Category.findByIdAndDelete(categoryId);

    return NextResponse.json(
      { message: "deleted category", category: deletedCategory },
      { status: 200 }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "error in deleting category" },
      { status: 500 }
    );
  }
};
