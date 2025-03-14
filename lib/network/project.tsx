import { axiosInstance } from "./axiosInstance";
import { CreateProjectType, ProjectType } from "../types/project";

// Fetch all projects
export async function getAllProjects(getToken: () => Promise<string | null>) {
  const token = await getToken();
  const { data } = await axiosInstance.get<{ data: ProjectType[] }>(
    "/projects",
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );
  return data.data;
}

// Fetch a project by ID
export async function getProjectById(
  id: string,
  getToken: () => Promise<string | null>
) {
  const token = await getToken();
  const { data } = await axiosInstance.get<{ data: ProjectType }>(
    `/projects/${id}`,
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );
  return data.data;
}

export async function getProjectReportEvidences(
  id: string,
  getToken: () => Promise<string | null>
) {
  const token = await getToken();
  const { data } = await axiosInstance.get<{ data: string }>(
    `/projects/generate-report/${id}`,
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );
  return data.data;
}

// Create a project
export async function createProject(
  values: CreateProjectType,
  getToken: () => Promise<string | null>
) {
  const token = await getToken();
  const { data } = await axiosInstance.post("/projects", values, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return data.data;
}

// Update a project
export async function updateProject(
  id: string,
  values: CreateProjectType,
  getToken: () => Promise<string | null>
) {
  const token = await getToken();
  const { data } = await axiosInstance.put(`/projects/${id}`, values, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return data.data;
}

// Delete a project
export async function deleteProject(
  id: string,
  getToken: () => Promise<string | null>
) {
  const token = await getToken();
  const { data } = await axiosInstance.delete(`/projects/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return data.data;
}
