"use server";

import { CLODUINARY_CONFIG, UploadPreset } from "../types";

export const uploadFileToCloudinary = async (
  file: File,
  preset: UploadPreset
): Promise<string> => {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", preset);
  formData.append("folder", CLODUINARY_CONFIG[preset]);

  const res = await fetch(
    `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`,
    {
      method: "POST",
      body: formData,
    }
  );

  const result = await res.json();

  if (!res.ok) {
    throw new Error(`Cloudinary upload failed: ${JSON.stringify(result)}`);
  }

  return result.secure_url as string;
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
