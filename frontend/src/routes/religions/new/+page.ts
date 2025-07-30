import type { PageLoad } from './$types';
import type { Religion } from '$lib/types';
import { API_BASE_URL } from '$lib/config/api';

export const load: PageLoad = async () => {
    const response = await fetch(`${API_BASE_URL}/api/religions`);
    if (!response.ok) {
        throw new Error('Failed to fetch nations');
    }
    const data = await response.json();
    return {
        religions: data.data as Religion[],
    };

};