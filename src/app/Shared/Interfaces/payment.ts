import { PaymentMethod } from "./payment-method";

export interface Payment {
     id: number;
  amount: number;
  date: Date;
  transactionId: string;
  paymentMethod: PaymentMethod;
  transactionType: string;
  userId: string;
}
