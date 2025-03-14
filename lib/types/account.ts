import { ProjectType } from "./project";
import { ReportType } from "./report";

export interface CreateAccountType {
  fullname: string;
  email: string;
  role?: string;
  image?: string;
}

export interface AccountType extends CreateAccountType {
  id: number;
  createdAt: Date;
  updatedAt: Date;
  Reports?: ReportType[];
  Projects?: ProjectType[];
}
