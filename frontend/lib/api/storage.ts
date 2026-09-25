import { fetchApi } from "../api";

/**
 * Upload a file to the backend storage provider.
 * Scoped to the page's folder — old files are auto-cleared on the backend.
 * Returns the public URL of the uploaded file.
 */
export async function uploadFile(file: File, pageId?: string): Promise<string> {
  const formData = new FormData();
  formData.append("file", file);

  const url = pageId
    ? `/storage/upload?page_id=${encodeURIComponent(pageId)}`
    : "/storage/upload";

  const data = await fetchApi(url, {
    method: "POST",
    body: formData,
  });

  return data.data; // The returned file URL
}

/**
 * Delete a file from the backend storage provider.
 */
export async function deleteFile(filename: string): Promise<void> {
  await fetchApi(`/storage/delete/${encodeURIComponent(filename)}`, {
    method: "DELETE",
  });
}
