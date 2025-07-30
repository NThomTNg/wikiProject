import type { PageLoad } from './$types';
import { API_BASE_URL } from '$lib/config/api';

export const load: PageLoad = async ({ fetch }) => {
    try {
        const nationsResponse = await fetch(`${API_BASE_URL}/api/nations`);
        const nationsData = await nationsResponse.json();
        const nations = nationsData.data || nationsData || [];
        
        return { nations };
    } catch (err) {
        console.error('Error loading nations for new history entry:', err);
        return { nations: [] };
    }
};
