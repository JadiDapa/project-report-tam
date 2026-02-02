import { TaskEvidenceType } from "./task-evidence";
import { AccountType } from "./account";

export interface CreateTaskEvidenceImageType {
  id?: number;
  baseImage: string;
  image: string;
  date: string;
  latitude: string;
  longitude: string;
  description?: string;
  taskEvidenceId: number;
  accountId?: number;
}

export interface TaskEvidenceImageType extends CreateTaskEvidenceImageType {
  id: number;
  createdAt: Date;
  updatedAt: Date;
  TaskEvidence: TaskEvidenceType;
  Account?: AccountType;
}
