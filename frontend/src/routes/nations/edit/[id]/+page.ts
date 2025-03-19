import { error } from '@sveltejs/kit';
import type { Nation } from '$lib/types';

export async function load({ params, fetch }) {
    const id = params.id;
    
    try {
        const response = await fetch(`http://localhost:5000/api/nations/${id}`);
        
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || `Failed to load nation with ID ${id}`);
        }
        
        const { data } = await response.json();
        
        return {
            nation: data as Nation
        };
    } catch (err) {
        console.error('Error loading nation:', err);
        throw error(404, {
            message: err instanceof Error ? err.message : 'Failed to load nation'
        });
    }
}
