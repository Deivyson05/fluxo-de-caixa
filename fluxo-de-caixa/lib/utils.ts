import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { SetStateAction } from "react";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function setData(key: string, data: any) {
  localStorage.setItem(key, JSON.stringify(data));
}

export function getData(key: string) {
  const data = localStorage.getItem(key);
  return data ? JSON.parse(data) : null;
}

export async function fetchData(key: string, setState: SetStateAction<any>) {
  const data = await getData(key);
  if (Array.isArray(data)) {
    setState(data);
  }else {
    setData(key, []);
    setState([]);
  }
}