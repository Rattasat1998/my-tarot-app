/**
 * Compresses an image file to be under a specific size.
 * @param {File} file - The original image file.
 * @param {number} maxSizeMB - The maximum size in MB (default 0.4MB = 400KB).
 * @param {number} maxWidthOrHeight - The maximum width or height of the output image (default 1024px).
 * @returns {Promise<File>} - The compressed file.
 */
export const compressImage = async (file, maxSizeMB = 0.4, maxWidthOrHeight = 1024) => {
    return new Promise((resolve, reject) => {
        const image = new Image();
        const reader = new FileReader();

        reader.onload = (e) => {
            image.src = e.target.result;
        };

        reader.onerror = (error) => reject(error);

        image.onload = () => {
            const canvas = document.createElement('canvas');
            let width = image.width;
            let height = image.height;

            // Resize logic
            if (width > height) {
                if (width > maxWidthOrHeight) {
                    height *= maxWidthOrHeight / width;
                    width = maxWidthOrHeight;
                }
            } else {
                if (height > maxWidthOrHeight) {
                    width *= maxWidthOrHeight / height;
                    height = maxWidthOrHeight;
                }
            }

            canvas.width = width;
            canvas.height = height;

            const ctx = canvas.getContext('2d');
            ctx.drawImage(image, 0, 0, width, height);

            // Compression loop
            let quality = 0.9;
            const maxSizeBytes = maxSizeMB * 1024 * 1024;

            const tryCompress = (q) => {
                canvas.toBlob((blob) => {
                    if (!blob) {
                        reject(new Error('Canvas to Blob failed'));
                        return;
                    }

                    if (blob.size <= maxSizeBytes || q <= 0.1) {
                        // Create a new File from the blob
                        const compressedFile = new File([blob], file.name, {
                            type: 'image/jpeg',
                            lastModified: Date.now(),
                        });
                        resolve(compressedFile);
                    } else {
                        // Try again with lower quality
                        tryCompress(q - 0.1);
                    }
                }, 'image/jpeg', q);
            };

            tryCompress(quality);
        };

        reader.readAsDataURL(file);
    });
};
