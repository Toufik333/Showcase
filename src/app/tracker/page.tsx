import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { jwtVerify } from "jose";

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || "dev-secret-money-tracker-2026"
);

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
