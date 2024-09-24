import connect from "@/app/lib/db";
import User from "@/app/lib/modals/user";
import { NextResponse } from "next/server";
import { Types } from "mongoose";

export const GET = async () => {
  try {
    await connect();
    const users = await User.find();
    return NextResponse.json(users, { status: 200 });
  } catch (error: unknown) {
    console.error("Error in fetching users:", error);
    return NextResponse.json(
      { error: "Error in fetching users" },
      { status: 500 }
    );
  }
};

export const POST = async (request: Request) => {
  try {
    const body = await request.json();
    await connect();
    const newUser = new User(body);
    await newUser.save();
    return NextResponse.json(newUser, { status: 201 });
  } catch (error: unknown) {
    console.error("Error in posting user:", error);
    return NextResponse.json(
      { error: "Error in posting user" },
      { status: 500 }
    );
  }
};

export const PATCH = async (request: Request) => {
  try {
    const { userId, newUserName } = await request.json();
    await connect();

    if (!userId || !newUserName) {
      return NextResponse.json(
        { message: "Invalid user id or new username" },
        { status: 400 }
      );
    }

    if (!Types.ObjectId.isValid(userId)) {
      return NextResponse.json({ message: "Invalid user id" }, { status: 400 });
    }

    const updatedUser = await User.findOneAndUpdate(
      { _id: new Types.ObjectId(userId) },
      { username: newUserName },
      { new: true }
    );

    if (!updatedUser) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    return NextResponse.json(
      { message: "User is updated", user: updatedUser },
      { status: 200 }
    );
  } catch (error: unknown) {
    console.error("Error in updating user:", error);
    if (error instanceof Error) {
      return NextResponse.json(
        { error: `Error in updating user: ${error.message}` },
        { status: 500 }
      );
    }
    return NextResponse.json(
      { error: "An unexpected error occurred" },
      { status: 500 }
    );
  }
};

export const DELETE = async (request: Request) => {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");

    if (!userId) {
      return NextResponse.json(
        { message: "UserId not found" },
        { status: 400 }
      );
    }

    if (!Types.ObjectId.isValid(userId)) {
      return NextResponse.json(
        { message: "UserId is not valid" },
        { status: 400 }
      );
    }

    await connect();

    const deletedUser = await User.findByIdAndDelete(
      new Types.ObjectId(userId)
    );

    if (!deletedUser) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    return NextResponse.json(
      { message: "User deleted", user: deletedUser },
      { status: 200 }
    );
  } catch (error: unknown) {
    console.error("Error in deleting user:", error);
    return NextResponse.json(
      { error: "Error in deleting user" },
      { status: 500 }
    );
  }
};
