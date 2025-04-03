import { format, parseISO } from "date-fns";


export const formatToAngolaTime = (utcDate) => {
  const date = new Date(utcDate);
  return date.toLocaleString("pt-PT", { timeZone: "Africa/Luanda" });
};

export const getCurrentAngolaDate = () => {
  const now = new Date().toLocaleDateString("pt-PT", { 
    timeZone: "Africa/Luanda",
    year: "numeric",
    month: "2-digit",
    day: "2-digit"
  });

  return now.split("/").reverse().join("-"); // Formata para "YYYY-MM-DD"
};

//Enviar ao beck
export const convertToUtc = (localDate) => {
  if (!localDate) return null;
  
  // Formata a data para YYYY-MM-DD
  const formattedDate = format(new Date(localDate), "yyyy-MM-dd");

  return formattedDate; // Retorna apenas ano, mês e dia
};

export function receiveCentFront(cents) {
  const value = cents / 100;
  return value.toFixed(2); // Returns the formatted value with two decimal places
}

export function sendCoinBeck(cents) {
  const value = Math.round(cents * 100); // Convert to cents
  return parseInt(value); // Returns the formatted value with two decimal places
}

export function calcularPrecoReserva(precoPorHora: number, inicio: string, fim: string): number {
    // Converter horário para minutos
    const [h1, m1, s1] = inicio.split(":").map(Number);
    const [h2, m2, s2] = fim.split(":").map(Number);

    const minutosInicio = h1 * 60 + m1 + s1 / 60;
    const minutosFim = h2 * 60 + m2 + s2 / 60;

    // Calcular duração em minutos
    const duracaoMinutos = minutosFim - minutosInicio;

    // Calcular preço a pagar proporcional
    const precoTotal = (precoPorHora / 60) * duracaoMinutos;

    return precoTotal;
}
