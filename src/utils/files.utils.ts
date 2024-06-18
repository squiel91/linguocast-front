export const resizeAndCropSquareImage = (file: File, size = 600, quality = .9): Promise<File> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');

        if (!ctx) {
          reject(new Error('Could not get canvas context'));
          return;
        }

        canvas.width = size;
        canvas.height = size;

        // Calculate the cover effect dimensions
        const scale = Math.max(size / img.width, size / img.height);
        const x = (canvas.width / 2) - (img.width / 2) * scale;
        const y = (canvas.height / 2) - (img.height / 2) * scale;

        // Draw the image with cover effect
        ctx.drawImage(img, x, y, img.width * scale, img.height * scale);

        // Convert canvas to blob and create a new file
        canvas.toBlob((blob) => {
          if (blob) {
            const newFile = new File([blob], file.name, { type: 'image/jpeg' });
            resolve(newFile);
          } else {
            reject(new Error('Canvas to Blob conversion failed'));
          }
        }, 'image/jpeg', quality);
      };
      img.onerror = (error) => {
        reject(new Error('Image loading error'));
      };
      img.src = event.target?.result as string;
    };

    reader.onerror = (error) => {
      reject(new Error('File reading error'));
    };

    reader.readAsDataURL(file);
  });
}