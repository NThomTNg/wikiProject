import type { PageLoad } from './$types';
import type { Religion } from '$lib/types';

export const load: PageLoad = async () => {
    const response = await fetch('http://localhost:5000/api/religions');
    if (!response.ok) {
        throw new Error('Failed to fetch religions');
    }
    const data = await response.json();
    return {
        religions: data.data as Religion[],
    };
};
