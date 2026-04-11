import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";

export async function POST(req: Request) {
  try {
    const { email, kata_sandi, nama_lengkap } = await req.json();

    if (!email || !kata_sandi || !nama_lengkap) {
      return NextResponse.json(
        { error: "Permintaan tidak valid, lengkapi semua field" },
        { status: 400 }
      );
    }

    const exist = await prisma.pengguna.findUnique({ where: { email } });
    if (exist) {
      return NextResponse.json({ error: "Email sudah terdaftar" }, { status: 400 });
    }

    const rolePelamar = await prisma.peran.findUnique({
      where: { nama_peran: "pelamar" },
    });

    if (!rolePelamar) {
      return NextResponse.json(
        { error: "Peran pelamar belum ada di database, harap hubungi administrator." },
        { status: 500 }
      );
    }

    const hashedPassword = await bcrypt.hash(kata_sandi, 10);

    const penggunaBaru = await prisma.pengguna.create({
      data: {
        email,
        kata_sandi: hashedPassword,
        nama_lengkap,
        id_peran: rolePelamar.id_peran,
      },
    });

    return NextResponse.json(
      { message: "Registrasi berhasil", id: penggunaBaru.id_pengguna },
      { status: 201 }
    );
  } catch (error: any) {
    return NextResponse.json({ error: "Terjadi kesalahan server" }, { status: 500 });
  }
}
