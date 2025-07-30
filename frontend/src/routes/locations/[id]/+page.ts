import { error } from '@sveltejs/kit';
import type { PageLoad } from './$types';
import type { Location } from '$lib/types';
import { API_BASE_URL } from '$lib/config/api';

export const load: PageLoad = async ({ params }) => {
    try {
        const locationId = params.id;
        const response = await fetch(`${API_BASE_URL}/api/locations/${locationId}`);
        
        if (!response.ok) {
            if (response.status === 404) {
                throw error(404, 'Location not found');
            }
            throw new Error('Failed to fetch location data');
        }
        
        const data = await response.json();
        return {
            location: data.data as Location
        };
    } catch (e) {
        console.error('Error loading location:', e);
        throw error(500, 'Failed to load location');
    }
};
