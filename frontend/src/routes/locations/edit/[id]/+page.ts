import { error } from '@sveltejs/kit';
import type { Location } from '$lib/types';

export async function load({ params, fetch }) {
    const id = params.id;
    
    try {
        const response = await fetch(`http://localhost:5000/api/locations/${id}`);
        
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || `Failed to load location with ID ${id}`);
        }
        
        const { data } = await response.json();
        
        return {
            location: data as Location
        };
    } catch (err) {
        console.error('Error loading location:', err);
        throw error(404, {
            message: err instanceof Error ? err.message : 'Failed to load location'
        });
    }
}
