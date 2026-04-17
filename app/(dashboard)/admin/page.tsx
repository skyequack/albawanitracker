import { redirect } from "next/navigation";
import { AdminPanel } from "@/app/components/AdminPanel";
import { getCurrentUser } from "@/app/lib/auth";

export default async function AdminPage() {
  const currentUser = await getCurrentUser();

  if (!currentUser || currentUser.role !== "ADMIN") {
    redirect("/dashboard");
  }

  return <AdminPanel />;
}