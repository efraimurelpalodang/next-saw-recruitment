'use server';

import { deleteSession as deleteSessionFromLib } from "@/lib/auth";
import { redirect } from "next/navigation";

export async function logoutAction() {
  await deleteSessionFromLib();
  redirect("/login");
}
