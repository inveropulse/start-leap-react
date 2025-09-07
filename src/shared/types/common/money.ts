// Shared money and currency types
export interface Money {
  amount?: number;
  currency?: string | null;
}

export enum Currency {
  GBP = "GBP",
  USD = "USD",
  EUR = "EUR",
}