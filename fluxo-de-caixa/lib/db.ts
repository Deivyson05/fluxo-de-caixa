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

export async function getOrdens() {
  try {
    const result = await readFile("./database/ordens-de-servico.json", "utf-8");
    return JSON.parse(result);
  } catch (error) {
    console.error("Não foi possível capturar os dados:", error);
    return [];
  }
}

export async function setOrdens(data: any) {
  try {
    await writeFile("./database/ordens-de-servico.json", JSON.stringify(data, null, 2));
    console.log("Ordens salvas com sucesso!");
  } catch (error) {
    console.error("Erro ao salvar ordens:", error);
  }
}

export async function getServicos() {
  try {
    const result = await readFile("./database/servicos.json", "utf-8");
    return JSON.parse(result);
  } catch (error) {
    console.error("Não foi possível capturar os dados:", error);
    return [];
  }
}

export async function setServicos(data: any) {
  try {
    await writeFile("./database/servicos.json", JSON.stringify(data, null, 2));
    console.log("Clientes salvos com sucesso!");
  } catch (error) {
    console.error("Erro ao salvar clientes:", error);
  }
}