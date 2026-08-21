import { NextRequest, NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import { getNotesCollection } from "@/lib/mongodb";
import { getNotesSession } from "@/lib/auth";

// PUT /api/notes/:id — update a note belonging to logged-in user
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getNotesSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;

    if (!ObjectId.isValid(id)) {
      return NextResponse.json({ error: "Invalid note ID" }, { status: 400 });
    }

    const body = await request.json();
    const { title, content, color, pinned } = body;

    // Build update document — only update fields that are provided
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const update: any = { updatedAt: new Date() };

    if (title !== undefined) {
      if (typeof title !== "string" || title.trim().length === 0) {
        return NextResponse.json(
          { error: "Title cannot be empty" },
          { status: 400 }
        );
      }
      if (title.length > 200) {
        return NextResponse.json(
          { error: "Title must be 200 characters or less" },
          { status: 400 }
        );
      }
      update.title = title.trim();
    }

    if (content !== undefined) {
      if (content.length > 10000) {
        return NextResponse.json(
          { error: "Content must be 10,000 characters or less" },
          { status: 400 }
        );
      }
      update.content = content.trim();
    }

    if (color !== undefined) {
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
      if (validColors.includes(color)) {
        update.color = color;
      }
    }

    if (pinned !== undefined) {
      update.pinned = Boolean(pinned);
    }

    const collection = await getNotesCollection();
    const result = await collection.findOneAndUpdate(
      { _id: new ObjectId(id), userId: session.userId },
      { $set: update },
      { returnDocument: "after" }
    );

    if (!result) {
      return NextResponse.json({ error: "Note not found" }, { status: 404 });
    }

    return NextResponse.json(result);
  } catch (error) {
    console.error("PUT /api/notes/[id] error:", error);
    return NextResponse.json(
      { error: "Failed to update note" },
      { status: 500 }
    );
  }
}

// DELETE /api/notes/:id — delete a note belonging to logged-in user
export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getNotesSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;

    if (!ObjectId.isValid(id)) {
      return NextResponse.json({ error: "Invalid note ID" }, { status: 400 });
    }

    const collection = await getNotesCollection();
    const result = await collection.deleteOne({
      _id: new ObjectId(id),
      userId: session.userId,
    });

    if (result.deletedCount === 0) {
      return NextResponse.json({ error: "Note not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("DELETE /api/notes/[id] error:", error);
    return NextResponse.json(
      { error: "Failed to delete note" },
      { status: 500 }
    );
  }
}
