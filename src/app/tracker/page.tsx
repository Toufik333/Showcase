import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { jwtVerify } from "jose";

if (!process.env.JWT_SECRET) {
  throw new Error(
    "JWT_SECRET environment variable is not set. " +
    "Please set a strong random secret (64+ characters) in your .env file or cPanel environment variables."
  );
}

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET);

export default async function TrackerPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get("tracker_session")?.value;

  if (token) {
    try {
      await jwtVerify(token, JWT_SECRET);
      redirect("/tracker/dashboard");
    } catch {
      redirect("/tracker/login");
    }
  }

  redirect("/tracker/login");
}
