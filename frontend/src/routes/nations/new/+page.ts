import type { PageLoad } from './$types';
import { API_BASE_URL } from '$lib/config/api';

export const load: PageLoad = async () => {
    try {
        const locationsResponse = await fetch(`${API_BASE_URL}/api/locations`);
        if (!locationsResponse.ok) {
            throw new Error('Failed to fetch locations');
        }
        const locationsData = await locationsResponse.json();

        const religionsResponse = await fetch(`${API_BASE_URL}/api/religions`);
        if (!religionsResponse.ok) {
            throw new Error('Failed to fetch religions');
        }
        const religionsData = await religionsResponse.json();

        const nationsResponse = await fetch(`${API_BASE_URL}/api/nations`);
        if (!nationsResponse.ok) {
            throw new Error('Failed to fetch nations');
        }
        const nationsData = await nationsResponse.json();

        return {
            locations: locationsData.data || locationsData,
            religions: religionsData.data || religionsData,
            nations: nationsData.data || nationsData
        };
    } catch (error) {
        console.error('Error loading data:', error);
        return {
            locations: [],
            religions: [],
            nations: [],
            error: 'Failed to load necessary data'
        };
    }
};
