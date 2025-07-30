import { error } from '@sveltejs/kit';
import type { PageLoad } from './$types';
import type { Nation } from '$lib/types';
import { API_BASE_URL } from '$lib/config/api';

export const load: PageLoad = async ({ params }) => {
    try {
        const nationId = params.id;
        const response = await fetch(`${API_BASE_URL}/api/nations/${nationId}`);
        
        if (!response.ok) {
            if (response.status === 404) {
                throw error(404, 'Nation not found');
            }
            throw new Error('Failed to fetch nation data');
        }
        
        const data = await response.json();
        return {
            nation: data.data as Nation
        };
    } catch (e) {
        console.error('Error loading nation:', e);
        throw error(500, 'Failed to load nation');
    }
};
