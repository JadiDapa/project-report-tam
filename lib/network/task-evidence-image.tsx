import {
  CreateTaskEvidenceImageType,
  TaskEvidenceImageType,
} from "../types/task-evidence-image";
import { axiosInstance } from "./axiosInstance";

// Fetch all task-evidence-images
export async function getAllTaskEvidenceImages() {
  const { data } = await axiosInstance.get<{ data: TaskEvidenceImageType[] }>(
    "/task-evidence-images"
  );
  return data.data;
}

// Fetch a TaskEvidenceImage by ID
export async function getTaskEvidenceImageById(id: string) {
  const { data } = await axiosInstance.get<{ data: TaskEvidenceImageType }>(
    `/task-evidence-images/${id}`
  );
  return data.data;
}

export async function createTaskEvidenceImage(
  values: CreateTaskEvidenceImageType
) {
  const formData = new FormData();

  formData.append("image", {
    uri: values.image,
    name: "evidence.jpg",
    type: "image/jpeg",
  } as any);

  formData.append("baseImage", {
    uri: values.baseImage,
    name: "evidence.jpg",
    type: "image/jpeg",
  } as any);

  formData.append("taskEvidenceId", values.taskEvidenceId.toString());
  if (values.accountId) {
    formData.append("accountId", values.accountId.toString());
  }
  if (values.description) {
    formData.append("description", values.description);
  }
  if (values.date) {
    formData.append("date", values.date);
  }
  if (values.latitude) {
    formData.append("latitude", values.latitude);
  }
  if (values.longitude) {
    formData.append("longitude", values.longitude);
  }

  const { data } = await axiosInstance.post("/task-evidence-images", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return data.data;
}

// Update a TaskEvidenceImage
export async function updateTaskEvidenceImage(
  id: string,
  values: CreateTaskEvidenceImageType
) {
  const formData = new FormData();

  // 🔥 updated rendered image (REQUIRED)
  if (values.image) {
    formData.append("image", {
      uri: values.image,
      name: "evidence.jpg",
      type: "image/jpeg",
    } as any);
  }

  // 🔥 base image (OPTIONAL, but recommended)
  if (values.baseImage) {
    formData.append("baseImage", {
      uri: values.baseImage,
      name: "base.jpg",
      type: "image/jpeg",
    } as any);
  }

  if (values.description) {
    formData.append("description", values.description);
  }

  if (values.date) {
    formData.append("date", values.date);
  }

  if (values.latitude) {
    formData.append("latitude", values.latitude);
  }

  if (values.longitude) {
    formData.append("longitude", values.longitude);
  }

  console.log(formData);

  const { data } = await axiosInstance.put(
    `/task-evidence-images/${id}`,
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );

  return data.data;
}

// Delete a TaskEvidenceImage
export async function deleteTaskEvidenceImage(id: string) {
  const { data } = await axiosInstance.delete(
    `/task-evidence-images/${id}`,
    {}
  );
  return data.data;
}
