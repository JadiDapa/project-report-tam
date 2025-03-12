import { axiosInstance } from "./axiosInstance";
import { AccountType, CreateAccountType } from "../types/account";

export async function getAllAccounts() {
  const { data } = await axiosInstance.get<{ data: AccountType[] }>(
    "/accounts"
  );
  return data.data;
}

export async function getAccountByEmail(email: string) {
  const { data } = await axiosInstance.get<{ data: AccountType }>(
    "/accounts/email/" + email
  );
  return data.data;
}

export async function getAccountById(id: string) {
  const { data } = await axiosInstance.get<{ data: AccountType }>(
    "/accounts/" + id
  );
  return data.data;
}

export async function createAccount(values: CreateAccountType) {
  const { data } = await axiosInstance.post("/accounts", values);
  return data.data;
}

export async function updateAccount(id: string, values: CreateAccountType) {
  const { data } = await axiosInstance.put("/accounts/" + id, values);
  return data.data;
}

export async function deleteAccount(id: string) {
  const { data } = await axiosInstance.delete("/accounts/" + id);
  return data.data;
}
