import { readFile } from "node:fs/promises";
import { writeFile } from "node:fs/promises";

export async function getClients() {
    try {
        const result = await readFile("./database/clientes.json", "utf-8");
        return JSON.parse(result);
    } catch (error) {
        console.error("Não foi possível capturar os dados:", error);
        return [];
    }
}

export async function saveClients(data: any) {
  try {
    await writeFile("./database/clientes.json", JSON.stringify(data, null, 2));
    console.log("Clientes salvos com sucesso!");
  } catch (error) {
    console.error("Erro ao salvar clientes:", error);
  }
}