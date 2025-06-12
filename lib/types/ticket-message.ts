import { AccountType } from "./account";
import { TicketType } from "./ticket";

export interface CreateTicketMessageType {
  content: string;
  image?: string | File;
  ticketId: number;
  accountId: number;
}

export interface TicketMessageType extends CreateTicketMessageType {
  id: number;
  Ticket: TicketType;
  Account: AccountType;
  createdAt: Date;
  updatedAt: Date;
}
