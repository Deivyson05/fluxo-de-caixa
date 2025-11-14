import { NextResponse } from "next/server";
import { getServicos, setServicos } from "@/lib/db";

export async function GET() {
    const servicos = await getServicos();
    return NextResponse.json(servicos);
}

export async function POST(req: Request) {
  try {
    const novoArray = await req.json();

    if (!Array.isArray(novoArray)) {
      return NextResponse.json(
        { ok: false, error: "O corpo precisa ser um array" },
        { status: 400 }
      );
    }

    await setServicos(novoArray);

    return NextResponse.json({ ok: true, servicos: novoArray });
  } catch (error) {
    console.error("Erro ao salvar clientes:", error);
    return NextResponse.json(
      { ok: false, error: "Erro ao salvar servicos" },
      { status: 500 }
    );
  }
}