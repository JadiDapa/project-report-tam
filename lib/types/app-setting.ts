export interface CreateAppSettingType {
  key: string;
  value: string;
  description?: string;
}

export interface AppSettingType extends CreateAppSettingType {
  id: number;
  createdAt: Date;
  updatedAt: Date;
}

export type NotificationEventType =
  | "PROJECT_ASSIGNED"
  | "REPORT_APPROVED"
  | "TICKET_SUBMITTED"
  | "OTHER";
