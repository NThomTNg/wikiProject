import { API_BASE_URL } from '$lib/config/api';

/**
 *
 * 
 * @param imageURL The raw image URL from the database
 * @returns A fully qualified URL that will work in the browser
 */
export function getImageUrl(imageURL: string | null | undefined): string | null {
    if (!imageURL) return null;

    if (imageURL.startsWith('http') || imageURL.startsWith('https')) {
        return imageURL;
    }
    if (imageURL.startsWith('/uploads/')) {
        return `${API_BASE_URL}${imageURL}`;
    }
    return imageURL;
}

/**
 * Upload an image file to the backend
 * @param file The image file to upload
 * @returns Promise with the uploaded image URL
 */
export async function uploadImage(file: File): Promise<string> {
    const formData = new FormData();
    formData.append('image', file);

    const response = await fetch(`${API_BASE_URL}/api/images/upload`, {
        method: 'POST',
        body: formData
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Image upload failed');
    }

    const data = await response.json();
    return data.filePath;
}
