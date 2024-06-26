export const UploadToS3 = async (file: File): Promise<string | null> => {
  const formData = new FormData();
  formData.append("file", file);

  try {
    const response = await fetch("http://localhost:3001/upload", {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      throw new Error("Failed to upload file");
    }

    const fileUrl = await response.text();
    console.log("File uploaded successfully:", fileUrl);
    return fileUrl; // Return the uploaded file URL
  } catch (error) {
    console.error("Error uploading file:", error);
    return null; // Return null in case of error
  }
};
