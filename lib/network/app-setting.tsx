import { axiosInstance } from "./axiosInstance";
import { AppSettingType, CreateAppSettingType } from "../types/app-setting";

export async function getAllAppSettings() {
  const { data } = await axiosInstance.get<{ data: AppSettingType[] }>(
    "/app-settings"
  );
  return data.data;
}

export async function getAppSettingById(id: string) {
  const { data } = await axiosInstance.get<{ data: AppSettingType }>(
    "/app-settings/" + id
  );
  return data.data;
}

export async function getAppSettingByKey(key: string) {
  const { data } = await axiosInstance.get<{ data: AppSettingType }>(
    "/app-settings/key/" + key
  );
  return data.data;
}

export async function createAppSetting(values: CreateAppSettingType) {
  const { data } = await axiosInstance.post("/app-settings", values);

  return data.data;
}

export async function updateAppSetting(
  id: string,
  values: CreateAppSettingType
) {
  const { data } = await axiosInstance.put("/app-settings/" + id, values);

  return data.data;
}

export async function deleteAppSetting(id: string) {
  const { data } = await axiosInstance.delete("/app-settings/" + id);
  return data.data;
}
