import {
  CreateTaskEvidenceType,
  TaskEvidenceType,
} from "../types/task-evidence";
import { axiosInstance } from "./axiosInstance";

// Fetch all task-evidences
export async function getAllTaskEvidences() {
  const { data } = await axiosInstance.get<{ data: TaskEvidenceType[] }>(
    "/task-evidences"
  );
  return data.data;
}

// Fetch a TaskEvidence by ID
export async function getTaskEvidenceById(id: string) {
  const { data } = await axiosInstance.get<{ data: TaskEvidenceType }>(
    `/task-evidences/${id}`
  );
  return data.data;
}

export async function createTaskEvidence(values: CreateTaskEvidenceType) {
  const { data } = await axiosInstance.post("/task-evidences", values);

  return data.data;
}

// Update a TaskEvidence
export async function updateTaskEvidence(
  id: string,
  values: CreateTaskEvidenceType
) {
  const { data } = await axiosInstance.put(`/task-evidences/${id}`, values);
  return data.data;
}

// Delete a TaskEvidence
export async function deleteTaskEvidence(
  id: string,
  getToken: () => Promise<string | null>
) {
  const token = await getToken();
  const { data } = await axiosInstance.delete(`/task-evidences/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return data.data;
}
