import { AccountType } from "./account";
import { ReportEvidenceType } from "./report-evidence";

export interface CreateDailyReportType {
  title: string;
  description?: string;
  accountId: number;
}

export interface DailyReportType extends CreateDailyReportType {
  id: number;
  Account: AccountType;
  createdAt: Date;
  updatedAt: Date;
  ReportEvidences: ReportEvidenceType[];
}
