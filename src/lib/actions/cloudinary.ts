"use server";

import { CLOUDINARY_CONFIG, UploadPreset } from "../types";

export const uploadFileToCloudinary = async (
  file: File,
  preset: UploadPreset
): Promise<string> => {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", preset);
  formData.append("folder", CLOUDINARY_CONFIG[preset]);

  // Use "auto" to support images, videos, raw files, etc.
  const res = await fetch(
    `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/auto/upload`,
    {
      method: "POST",
      body: formData,
    }
  );

  const result = await res.json();

  if (!res.ok) {
    throw new Error(`Cloudinary upload failed: ${JSON.stringify(result)}`);
  }

  return result.secure_url;
};

export async function uploadFilesToCloudinary(
  files: File[],
  preset: UploadPreset
): Promise<string[]> {
  const uploads = await Promise.all(
    files.map((file) => uploadFileToCloudinary(file, preset))
  );
  return uploads;
}
