import { axiosInstance } from "./axiosInstance";
import { DailyReportType, CreateDailyReportType } from "../types/daily-report";

export async function getAllDailyReports() {
  const { data } = await axiosInstance.get<{ data: DailyReportType[] }>(
    "/daily-reports"
  );
  return data.data;
}

export async function getDailyReportsByAccountId(accountId: string) {
  const { data } = await axiosInstance.get<{ data: DailyReportType[] }>(
    "/daily-reports/account/" + accountId
  );
  return data.data;
}

export async function getDailyReportById(id: string) {
  const { data } = await axiosInstance.get<{ data: DailyReportType }>(
    "/daily-reports/" + id
  );
  return data.data;
}

export async function createDailyReport(values: CreateDailyReportType) {
  const { data } = await axiosInstance.post("/daily-reports", values);

  return data.data;
}

export async function updateDailyReport(
  id: string,
  values: CreateDailyReportType
) {
  const { data } = await axiosInstance.put("/daily-reports/" + id, values);

  return data.data;
}

export async function deleteDailyReport(id: string) {
  const { data } = await axiosInstance.delete("/daily-reports/" + id);
  return data.data;
}
