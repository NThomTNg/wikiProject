import type { PageLoad } from './$types';
import { API_BASE_URL } from '$lib/config/api';

export const load: PageLoad = async () => {
    try {
        const nationsResponse = await fetch(`${API_BASE_URL}/api/nations`);
        if (!nationsResponse.ok) {
            throw new Error('Failed to fetch nations');
        }
        const nationsData = await nationsResponse.json();

        const religionsResponse = await fetch(`${API_BASE_URL}/api/religions`);
        if (!religionsResponse.ok) {
            throw new Error('Failed to fetch religions');
        }
        const religionsData = await religionsResponse.json();

        const charactersResponse = await fetch(`${API_BASE_URL}/api/characters`);
        if (!charactersResponse.ok) {
            throw new Error('Failed to fetch characters');
        }
        const charactersData = await charactersResponse.json();

        return {
            nations: nationsData.data || nationsData,
            religions: religionsData.data || religionsData, 
            characters: charactersData.data || charactersData 
        };
    } catch (error) {
        console.error('Error loading data:', error);
        return {
            nations: [],
            religions: [],
            characters: [],
            error: 'Failed to load necessary data'
        };
    }
};