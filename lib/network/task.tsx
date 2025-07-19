import { axiosInstance } from "./axiosInstance";
import { TaskType, CreateTaskType } from "../types/task";
import { CreateTaskEvidenceType } from "../types/task-evidence";
import * as FileSystem from "expo-file-system";

// Fetch all tasks
export async function getAllTasks(getToken: () => Promise<string | null>) {
  const token = await getToken();
  const { data } = await axiosInstance.get<{ data: TaskType[] }>("/tasks", {
    headers: { Authorization: `Bearer ${token}` },
  });
  return data.data;
}

// Fetch a Task by ID
export async function getTaskById(
  id: string,
  getToken: () => Promise<string | null>
) {
  const token = await getToken();
  const { data } = await axiosInstance.get<{ data: TaskType }>(`/tasks/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return data.data;
}

export async function getTaskReportEvidences(
  id: string,
  getToken: () => Promise<string | null>
) {
  const token = await getToken();
  const { data } = await axiosInstance.get<{ data: string }>(
    `/tasks/generate-evidence/${id}`,
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );
  return data.data;
}

export async function createTask(values: CreateTaskType) {
  const { data } = await axiosInstance.post("/tasks", values);
  return data.data;
}

export async function createTasks(values: CreateTaskType[]) {
  const { data } = await axiosInstance.post("/tasks/generate", values);
  return data.data;
}

// Update a Task
export async function updateTask(
  id: string,
  values: CreateTaskType,
  getToken: () => Promise<string | null>
) {
  const token = await getToken();
  const { data } = await axiosInstance.put(`/tasks/${id}`, values, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return data.data;
}

// Delete a Task
export async function deleteTask(
  id: string,
  getToken: () => Promise<string | null>
) {
  const token = await getToken();
  const { data } = await axiosInstance.delete(`/tasks/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return data.data;
}
