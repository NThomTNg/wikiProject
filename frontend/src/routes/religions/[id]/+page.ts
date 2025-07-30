import { error } from '@sveltejs/kit';
import type { PageLoad } from './$types';
import type { Religion } from '$lib/types';
import { API_BASE_URL } from '$lib/config/api';

export const load: PageLoad = async ({ params }) => {
    try {
        const religionId = params.id;
        const response = await fetch(`${API_BASE_URL}/api/religions/${religionId}`);
        
        if (!response.ok) {
            if (response.status === 404) {
                throw error(404, 'Religion not found');
            }
            throw new Error('Failed to fetch religion data');
        }
        
        const data = await response.json();
        return {
            religion: data.data as Religion
        };
    } catch (e) {
        console.error('Error loading religion:', e);
        return {
            error: e instanceof Error ? e.message : 'Failed to load religion'
        };
    }
};
