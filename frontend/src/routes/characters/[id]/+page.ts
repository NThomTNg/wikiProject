import { error } from '@sveltejs/kit';
import type { PageLoad } from './$types';
import type { Character } from '$lib/types';
import { API_BASE_URL } from '$lib/config/api';

export const load: PageLoad = async ({ params }) => {
    try {
        const characterId = params.id;
        const response = await fetch(`${API_BASE_URL}/api/characters/${characterId}`);
        
        if (!response.ok) {
            if (response.status === 404) {
                throw error(404, 'Character not found');
            }
            throw new Error('Failed to fetch character data');
        }
        
        const data = await response.json();
        return {
            character: data.data as Character
        };
    } catch (e) {
        console.error('Error loading character:', e);
        throw error(500, 'Failed to load character');
    }
};