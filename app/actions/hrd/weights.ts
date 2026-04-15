"use server";

import prisma from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import { revalidatePath } from "next/cache";

export async function getWeights() {
  const session = await getSession();
  if (!session || session.nama_peran.toLowerCase() !== "hrd") throw new Error("Unauthorized");

  return await prisma.bobotKriteria.findMany({
    orderBy: { kode_kriteria: 'asc' }
  });
}

export async function updateWeights(weightsData: { id_bobot: string, bobot: number }[]) {
  const session = await getSession();
  if (!session || session.nama_peran.toLowerCase() !== "hrd") throw new Error("Unauthorized");

  // Validate total weights
  const total = weightsData.reduce((acc, curr) => acc + curr.bobot, 0);
  if (Math.abs(total - 1.0) > 0.01) {
    return { error: "Total bobot harus sama dengan 1.0 (100%)" };
  }

  try {
    for (const data of weightsData) {
      await prisma.bobotKriteria.update({
        where: { id_bobot: data.id_bobot },
        data: { bobot: data.bobot, keterangan: `Bobot ${data.bobot * 100}%` }
      });
    }

    revalidatePath("/dashboard/weights");
    return { success: true };
  } catch (error: any) {
    console.error("Error updating weights:", error);
    return { error: "Gagal menyimpan bobot kriteria." };
  }
}
