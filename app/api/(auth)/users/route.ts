import connect from "@/app/lib/db";
import User from "@/app/lib/modals/user";
import { NextResponse } from "next/server";
import { Types } from "mongoose";

const ObjectId = require("mongoose").Types.ObjectId;

export const GET = async () => {
  try {
    await connect();
    const users = await User.find();

    return new NextResponse(JSON.stringify(users), { status: 200 });
  } catch (error: any) {
    return new NextResponse(" Error in fetshing users" + error.message, {
      status: 500,
    });
  }
};

export const POST = async (request: Request) => {
  try {
    const body = await request.json();
    await connect();
    const newUser = new User(body);
    await newUser.save();
    return new NextResponse(JSON.stringify(newUser), { status: 200 });
  } catch (error: any) {
    return new NextResponse("Error in posting user" + error.message, {
      status: 500,
    });
  }
};

export const PATCH = async (request: Request) => {
  try {
    const body = await request.json();
    const { userId, newUserName } = body;
    await connect();

    if (!userId || !newUserName) {
      return new NextResponse(
        JSON.stringify({ message: "invalid user id or new username" }),
        { status: 400 }
      );
    }

    if (!Types.ObjectId.isValid(userId)) {
      return new NextResponse(JSON.stringify({ message: "invalid user id" }), {
        status: 400,
      });
    }

    const updatedUser = await User.findOneAndUpdate(
      { _id: new ObjectId(userId) },
      { username: newUserName },
      { new: true }
    );

    if (!updatedUser) {
      return new NextResponse(
        JSON.stringify({ message: "error in updating user" }),
        { status: 500 }
      );
    }

    return new NextResponse(
      JSON.stringify({ message: "user is updated", user: updatedUser }),
      { status: 200 }
    );
  } catch (error: unknown) {
    if (error instanceof Error) {
      return new NextResponse("Error in updating user: " + error.message, {
        status: 500,
      });
    } else {
      // Handle non-Error types or provide a generic error message
      return new NextResponse("An unexpected error occurred.", { status: 500 });
    }
  }
};

export const DELETE = async (request: Request) => {
  try {
    const body = await request.json();
    await connect();

    const { userId } = body;
    if (!userId) {
      return new NextResponse(
        JSON.stringify({ message: "user id is not sent" }),
        { status: 400 }
      );
    }

    if (!Types.ObjectId.isValid(userId)) {
      return new NextResponse(
        JSON.stringify({ message: "user id is invalid" }),
        { status: 400 }
      );
    }

    const deletedUser = await User.findByIdAndDelete(userId);

    return new NextResponse(
      JSON.stringify({ message: "user is deleted", deletedUser }),
      { status: 200 }
    );
  } catch (error) {
    return new NextResponse("Error in deleting user" + error.message, {
      status: 500,
    });
  }
};
