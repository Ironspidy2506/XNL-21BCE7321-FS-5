import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    profileImage: {
      data: Buffer, // Stores image as binary data
      contentType: String, // Stores image format (JPEG, PNG, etc.)
    },
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);
export default User;
