// Shared payment-related enums - using API consistent values
export enum PaymentMethod {
  NOT_SET = 'NotSet',
  CASH = 'Cash',
  CARD = 'Card',
  BANK_TRANSFER = 'BankTransfer',
  CHEQUE = 'Cheque',
  INSURANCE = 'Insurance',
  OTHER = 'Other'
}

export enum PaymentStatus {
  PENDING = 'pending',
  PAID = 'paid',
  PARTIAL = 'partial',
  REFUNDED = 'refunded',
  FAILED = 'failed'
}