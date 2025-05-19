import { AccountType } from "./account";

export interface CreateTicketType {
  title: string;
  description?: string;
  response?: string;
  status?: string;
  requester: number;
  handler?: number;
}

export interface TicketType extends CreateTicketType {
  id: number;
  code: string;
  Requester: AccountType;
  Handler?: AccountType;
  createdAt: Date;
  updatedAt: Date;
}
