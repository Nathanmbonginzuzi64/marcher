const MAX_WIDTH = 800;
const JPEG_QUALITY = 0.82;
const MAX_FILE_SIZE = 5 * 1024 * 1024;

export function isDataImage(src: string): boolean {
  return src.startsWith("data:");
}

function readFileAsDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

function compressDataUrl(dataUrl: string): Promise<string> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      let { width, height } = img;

      if (width > MAX_WIDTH) {
        height = Math.round((height * MAX_WIDTH) / width);
        width = MAX_WIDTH;
      }

      const canvas = document.createElement("canvas");
      canvas.width = width;
      canvas.height = height;

      const ctx = canvas.getContext("2d");
      if (!ctx) {
        reject(new Error("Canvas non disponible"));
        return;
      }

      ctx.drawImage(img, 0, 0, width, height);
      resolve(canvas.toDataURL("image/jpeg", JPEG_QUALITY));
    };
    img.onerror = reject;
    img.src = dataUrl;
  });
}

export async function processImageFile(file: File): Promise<string> {
  if (!file.type.startsWith("image/")) {
    throw new Error("Le fichier doit être une image");
  }
  if (file.size > MAX_FILE_SIZE) {
    throw new Error("Image trop volumineuse (max 5 Mo)");
  }

  const dataUrl = await readFileAsDataUrl(file);
  return compressDataUrl(dataUrl);
}
