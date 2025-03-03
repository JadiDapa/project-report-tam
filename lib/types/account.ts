import { ReportType } from "./report";

export interface AccountType {
  id: number;
  fullname: string;
  email: string;
  password: string;
  role: string;
  image?: string;
  createdAt: Date;
  updatedAt: Date;
  Reports?: ReportType[];
}
