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
        return `http://localhost:5000${imageURL}`;
    }
    return imageURL;
}
