import type { PageLoad } from './$types';
import type { Nation } from '$lib/types';

export const load: PageLoad = async () => {
    try {
        const locationsResponse = await fetch('http://localhost:5000/api/locations');
        if (!locationsResponse.ok) {
            throw new Error('Failed to fetch locations');
        }
        const locationsData = await locationsResponse.json();

        const religionsResponse = await fetch('http://localhost:5000/api/religions');
        if (!religionsResponse.ok) {
            throw new Error('Failed to fetch religions');
        }
        const religionsData = await religionsResponse.json();

        const nationsResponse = await fetch('http://localhost:5000/api/nations');
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
