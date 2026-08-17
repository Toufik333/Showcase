import { NextRequest, NextResponse } from "next/server";
import { getNotesCollection } from "@/lib/mongodb";

// GET /api/notes — list all notes, optional ?search= query
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get("search")?.trim();

    const collection = await getNotesCollection();

    // Build query
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let query: any = {};
    if (search) {
      query = {
        $or: [
          { title: { $regex: search, $options: "i" } },
          { content: { $regex: search, $options: "i" } },
        ],
      };
    }

    const notes = await collection
      .find(query)
      .sort({ pinned: -1, updatedAt: -1 })
      .toArray();

    return NextResponse.json(notes);
  } catch (error) {
    console.error("GET /api/notes error:", error);
    return NextResponse.json(
      { error: "Failed to fetch notes" },
      { status: 500 }
    );
  }
}

// POST /api/notes — create a new note
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { title, content, color } = body;

    if (!title || typeof title !== "string" || title.trim().length === 0) {
      return NextResponse.json(
        { error: "Title is required" },
        { status: 400 }
      );
    }

    if (title.length > 200) {
      return NextResponse.json(
        { error: "Title must be 200 characters or less" },
        { status: 400 }
      );
    }

    if (content && content.length > 10000) {
      return NextResponse.json(
        { error: "Content must be 10,000 characters or less" },
        { status: 400 }
      );
    }

    const validColors = [
      "default",
      "yellow",
      "green",
      "blue",
      "purple",
      "pink",
      "orange",
      "red",
    ];
    const noteColor = validColors.includes(color) ? color : "default";

    const now = new Date();
    const note = {
      title: title.trim(),
      content: (content || "").trim(),
      color: noteColor,
      pinned: false,
      createdAt: now,
      updatedAt: now,
    };

    const collection = await getNotesCollection();
    const result = await collection.insertOne(note);

    return NextResponse.json(
      { ...note, _id: result.insertedId },
      { status: 201 }
    );
  } catch (error) {
    console.error("POST /api/notes error:", error);
    return NextResponse.json(
      { error: "Failed to create note" },
      { status: 500 }
    );
  }
}
