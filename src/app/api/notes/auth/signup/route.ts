import { NextResponse } from "next/server";
import { getNotesUsersCollection } from "@/lib/mongodb";
import { hashPassword, signNotesToken, createNotesSessionCookie } from "@/lib/auth";

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
    if (trimmedUsername.length < 3 || trimmedUsername.length > 50) {
      return NextResponse.json(
        { error: "Username must be between 3 and 50 characters" },
        { status: 400 }
      );
    }

    if (typeof password !== "string" || password.length < 6) {
      return NextResponse.json(
        { error: "Password must be at least 6 characters" },
        { status: 400 }
      );
    }

    const usersCollection = await getNotesUsersCollection();

    // Check if user already exists
    const existing = await usersCollection.findOne({
      username: { $regex: new RegExp(`^${trimmedUsername}$`, "i") },
    });

    if (existing) {
      return NextResponse.json(
        { error: "Username already taken" },
        { status: 409 }
      );
    }

    const passwordHash = await hashPassword(password);
    const result = await usersCollection.insertOne({
      username: trimmedUsername,
      password_hash: passwordHash,
      createdAt: new Date(),
    });

    const token = await signNotesToken(
      result.insertedId.toString(),
      trimmedUsername
    );
    const cookie = createNotesSessionCookie(token);

    const response = NextResponse.json(
      {
        success: true,
        message: "Account created successfully",
        user: { username: trimmedUsername },
      },
      { status: 201 }
    );
    response.cookies.set(cookie);
    return response;
  } catch (error) {
    console.error("Notes signup error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
