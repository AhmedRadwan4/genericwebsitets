import axios from "axios";

export async function UploadToS3(file: File): Promise<string | null> {
  const formData = new FormData();
  formData.append("file", file);

  try {
    const response = await axios.post(
      // external express server for handling aws s3 uploading
      // https://github.com/AhmedRadwan4/express
      `https://express-ax77xwxp9-ahmedradwan4s-projects.vercel.app/upload`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );

    if (response.status === 200) {
      return response.data;
    } else {
      throw new Error("Failed to upload file.");
    }
  } catch (error) {
    console.error("Error uploading file:", error);
    return null;
  }
}

export async function DeleteFromS3(imageUrl: string): Promise<void> {
  try {
    await axios.post(
      "https://express-ax77xwxp9-ahmedradwan4s-projects.vercel.app/delete",
      { imageUrl },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  } catch (error) {
    console.error("Error deleting image from S3:", error);
  }
}
