import { NextResponse } from "next/server";
import { getNotesUsersCollection } from "@/lib/mongodb";
import { comparePassword, signNotesToken, createNotesSessionCookie } from "@/lib/auth";

export async function POST(request: Request) {
  try {
    const { username, password } = await request.json();

    if (!username || !password) {
      return NextResponse.json(
        { error: "Username and password are required" },
        { status: 400 }
      );
    }

    const trimmedUsername = typeof username === "string" ? username.trim() : "";
    const usersCollection = await getNotesUsersCollection();

    const user = await usersCollection.findOne({
      username: { $regex: new RegExp(`^${trimmedUsername}$`, "i") },
    });

    if (!user) {
      return NextResponse.json(
        { error: "Invalid username or password" },
        { status: 401 }
      );
    }

    const isValid = await comparePassword(password, user.password_hash);
    if (!isValid) {
      return NextResponse.json(
        { error: "Invalid username or password" },
        { status: 401 }
      );
    }

    const token = await signNotesToken(
      user._id!.toString(),
      user.username
    );
    const cookie = createNotesSessionCookie(token);

    const response = NextResponse.json(
      {
        success: true,
        message: "Logged in successfully",
        user: { username: user.username },
      },
      { status: 200 }
    );
    response.cookies.set(cookie);
    return response;
  } catch (error) {
    console.error("Notes login error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
