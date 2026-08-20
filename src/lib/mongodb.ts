import { MongoClient, Db, Collection } from "mongodb";

// Extend globalThis to cache the MongoDB client across hot reloads in dev
declare global {
  // eslint-disable-next-line no-var
  var _mongoClientPromise: Promise<MongoClient> | undefined;
}

const MONGODB_URI = process.env.MONGODB_URI;
const MONGODB_DB = process.env.MONGODB_DB || "notes_app";

if (!MONGODB_URI) {
  throw new Error(
    "Please define the MONGODB_URI environment variable in .env"
  );
}

let clientPromise: Promise<MongoClient>;

const clientOptions = {
  tls: true,
};

if (process.env.NODE_ENV === "development") {
  // In development, use a global variable so the MongoClient is not
  // repeatedly instantiated during hot-module-replacement (HMR).
  if (!global._mongoClientPromise) {
    const client = new MongoClient(MONGODB_URI, clientOptions);
    global._mongoClientPromise = client.connect();
  }
  clientPromise = global._mongoClientPromise;
} else {
  const client = new MongoClient(MONGODB_URI, clientOptions);
  clientPromise = client.connect();
}

export async function getDb(): Promise<Db> {
  const client = await clientPromise;
  return client.db(MONGODB_DB);
}

export interface NoteDocument {
  _id?: import("mongodb").ObjectId;
  title: string;
  content: string;
  color: string;
  pinned: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export async function getNotesCollection(): Promise<Collection<NoteDocument>> {
  const db = await getDb();
  const collection = db.collection<NoteDocument>("notes");

  // Ensure indexes (MongoDB is idempotent on createIndex)
  await collection.createIndex({ pinned: -1, updatedAt: -1 });
  await collection.createIndex({ title: "text", content: "text" });

  return collection;
}
