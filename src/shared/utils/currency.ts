import { Currency } from "@/shared/types";
import { APP_CONFIG } from "@/shared/AppConfig";

export const getCurrencySymbol = (currency: Currency = APP_CONFIG.currency): string => {
  switch (currency) {
    case Currency.GBP:
      return '£';
    case Currency.USD:
      return '$';
    case Currency.EUR:
      return '€';
    default:
      return '£';
  }
};

export const formatCurrency = (
  amount: number, 
  currency: Currency = APP_CONFIG.currency,
  showSymbol: boolean = true
): string => {
  if (!showSymbol) {
    return amount.toLocaleString();
  }
  
  const symbol = getCurrencySymbol(currency);
  return `${symbol}${amount.toLocaleString()}`;
};

export const formatCurrencyAxisValue = (
  amount: number, 
  currency: Currency = APP_CONFIG.currency
): string => {
  const symbol = getCurrencySymbol(currency);
  return `${symbol}${amount.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',')}`;
};