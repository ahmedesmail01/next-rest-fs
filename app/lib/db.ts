import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI;

const connect = async () => {
  const connectionState = mongoose.connection.readyState;

  if (connectionState === 1) {
    console.log("database is connected");

    return;
  }

  if (connectionState === 2) {
    console.log("connecting to database.....");

    return;
  }

  try {
    mongoose.connect(MONGODB_URI!, {
      dbName: "next-rest-fs",
      bufferCommands: true,
    });
    console.log("connected");
  } catch (error: any) {
    console.log("Error", error);
    throw new Error("Error", error);
  }
};

export default connect;
