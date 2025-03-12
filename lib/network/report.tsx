import { axiosInstance } from "./axiosInstance";
import { ReportType, CreateReportType } from "../types/report";
import * as FileSystem from "expo-file-system";

// Fetch all reports
export async function getAllReports(getToken: () => Promise<string | null>) {
  const token = await getToken();
  const { data } = await axiosInstance.get<{ data: ReportType[] }>("/reports", {
    headers: { Authorization: `Bearer ${token}` },
  });
  return data.data;
}

// Fetch a Report by ID
export async function getReportById(
  id: string,
  getToken: () => Promise<string | null>
) {
  const token = await getToken();
  const { data } = await axiosInstance.get<{ data: ReportType }>(
    `/reports/${id}`,
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );
  return data.data;
}

export async function createReport(
  values: CreateReportType,
  getToken: () => Promise<string | null>
) {
  const token = await getToken();
  const formData = new FormData();

  formData.append("title", values.title);
  formData.append("description", values.description || "");
  formData.append("serialNumber", values.serialNumber || "");
  formData.append("location", values.location || "");
  formData.append("projectId", values.projectId as string);
  formData.append("accountId", values.accountId as string);

  console.log("Evidence list:", values.ReportEvidences);

  if (values.ReportEvidences && values.ReportEvidences.length > 0) {
    await Promise.all(
      values.ReportEvidences.map(async (evidence: any, index: number) => {
        const fileUri = evidence.image;
        const fileInfo = await FileSystem.getInfoAsync(fileUri);

        if (fileInfo.exists) {
          const fileBlob = {
            uri: fileUri,
            type: evidence.mimeType || "image/jpeg",
            name: evidence.fileName || `file_${index}.jpg`,
          };

          formData.append("ReportEvidences", fileBlob as any);
        } else {
          console.warn(`File not found: ${fileUri}`);
        }
      })
    );
  }

  try {
    const { data } = await axiosInstance.post("/reports", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
        Authorization: `Bearer ${token}`,
      },
    });

    return data.data;
  } catch (error) {
    console.error("Upload error:", error);
    throw error;
  }
}

// Update a Report
export async function updateReport(
  id: string,
  values: CreateReportType,
  getToken: () => Promise<string | null>
) {
  const token = await getToken();
  const { data } = await axiosInstance.put(`/reports/${id}`, values, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return data.data;
}

// Delete a Report
export async function deleteReport(
  id: string,
  getToken: () => Promise<string | null>
) {
  const token = await getToken();
  const { data } = await axiosInstance.delete(`/reports/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return data.data;
}
