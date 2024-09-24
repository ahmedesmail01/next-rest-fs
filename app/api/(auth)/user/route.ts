import connect from "@/app/lib/db";
import User from "@/app/lib/modals/user";
import { Types } from "mongoose";
import { NextResponse } from "next/server";

export const GET = async (request: Request) => {
  try {
    const { searchParams } = new URL(request.url);

    const userId = searchParams.get("userId");

    if (!userId) {
      return NextResponse.json({ message: "userId not sent" }, { status: 400 });
    }

    if (!Types.ObjectId.isValid(userId)) {
      return NextResponse.json(
        {
          message: "Invalid userId",
        },
        {
          status: 400,
        }
      );
    }

    await connect();
    const user = await User.findById(new Types.ObjectId(userId));

    return NextResponse.json(
      {
        message: "get user successfully ",
        user: user,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("error in getting user ", error);
    return NextResponse.json(
      { error: "error in getting user" },
      { status: 500 }
    );
  }
};
