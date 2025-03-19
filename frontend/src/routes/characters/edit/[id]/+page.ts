import { error } from '@sveltejs/kit';
import type { Character } from '$lib/types';

export async function load({ params, fetch }) {
    const id = params.id;
    
    try {
        const response = await fetch(`http://localhost:5000/api/characters/${id}`);
        
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || `Failed to load character with ID ${id}`);
        }
        
        const { data } = await response.json();
        
        return {
            character: data as Character
        };
    } catch (err) {
        console.error('Error loading character:', err);
        throw error(404, {
            message: err instanceof Error ? err.message : 'Failed to load character'
        });
    }
}
