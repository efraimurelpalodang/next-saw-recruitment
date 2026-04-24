import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { createSession } from "@/lib/auth";

export async function POST(req: Request) {
  try {
    const { email, kata_sandi } = await req.json();

    if (!email || !kata_sandi) {
      return NextResponse.json(
        { error: "Email dan kata sandi wajib diisi" },
        { status: 400 }
      );
    }

    const pengguna = await prisma.pengguna.findUnique({
      where: { email },
      include: { peran: true },
    });

    if (!pengguna || !pengguna.status_aktif) {
      return NextResponse.json(
        { error: "Email tidak ditemukan atau akun telah dinonaktifkan" },
        { status: 401 }
      );
    }

    // Compare Hash
    const isMatch = await bcrypt.compare(kata_sandi, pengguna.kata_sandi);

    if (!isMatch) {
      return NextResponse.json({ error: "Kata sandi yang Anda masukkan salah" }, { status: 401 });
    }

    // Set JWT Session Cookie
    await createSession({
      id_pengguna: pengguna.id_pengguna,
      email: pengguna.email,
      id_peran: pengguna.id_peran,
      nama_peran: pengguna.peran.nama_peran,
    });

    return NextResponse.json(
      { message: "Login berhasil", peran: pengguna.peran.nama_peran },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Login API Error:", error);
    return NextResponse.json({ error: "Terjadi kesalahan server" }, { status: 500 });
  }
}
