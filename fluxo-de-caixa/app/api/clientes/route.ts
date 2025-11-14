import { NextResponse } from "next/server";
import { getClients, saveClients } from "@/lib/db";

export async function GET() {
    const clientes = await getClients();
    return NextResponse.json(clientes);
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

    await saveClients(novoArray);

    return NextResponse.json({ ok: true, clientes: novoArray });
  } catch (error) {
    console.error("Erro ao salvar clientes:", error);
    return NextResponse.json(
      { ok: false, error: "Erro ao salvar clientes" },
      { status: 500 }
    );
  }
}