import type { PageLoad } from './$types';
import type { Nation } from '$lib/types';

export const load: PageLoad = async () => {
    const response = await fetch('http://localhost:5000/api/nations');
    if (!response.ok) {
        throw new Error('Failed to fetch nations');
    }
    const data = await response.json();
    return {
        nations: data.data as Nation[],
    };
};
