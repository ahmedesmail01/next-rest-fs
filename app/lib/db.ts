import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error("Please define the MONGODB_URI environment variable");
}

const connect = async (): Promise<void> => {
  const connectionState = mongoose.connection.readyState;

  if (connectionState === 1) {
    console.log("Database is already connected");
    return;
  }

  if (connectionState === 2) {
    console.log("Connecting to database...");
    return;
  }

  try {
    await mongoose.connect(MONGODB_URI, {
      dbName: "next-rest-fs",
      bufferCommands: true,
    });
    console.log("Connected to database");
  } catch (error) {
    console.error("Error connecting to database:", error);
    throw error; // Re-throw the error for handling by the caller
  }
};

export default connect;
