import { ReportType } from "./report";

export interface CreateReportEvidenceType {
  image: string;
  description?: string;
}

export interface ReportEvidenceType extends CreateReportEvidenceType {
  id: number;
  reportId: number;
  Report: ReportType;
  createdAt: Date;
  updatedAt: Date;
}
