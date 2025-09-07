import { Currency } from './enums';

// Payment value objects
export interface Money {
  amount?: number;
  currency?: string | null;
}

export interface MoneyValue {
  amount: number;
  currency: Currency;
}