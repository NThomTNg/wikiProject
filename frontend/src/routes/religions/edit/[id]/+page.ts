import { error } from '@sveltejs/kit';
import type { Religion } from '$lib/types';

export async function load({ params, fetch }) {
    const id = params.id;
    
    try {
        const response = await fetch(`http://localhost:5000/api/religions/${id}`);
        
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || `Failed to load religion with ID ${id}`);
        }
        
        const { data } = await response.json();
        
        return {
            religion: data as Religion
        };
    } catch (err) {
        console.error('Error loading religion:', err);
        throw error(404, {
            message: err instanceof Error ? err.message : 'Failed to load religion'
        });
    }
}
