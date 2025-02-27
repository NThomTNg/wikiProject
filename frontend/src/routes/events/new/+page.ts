import type { PageLoad } from './$types';
import type { Nation, Location } from '$lib/types';

export const load: PageLoad = async ({ fetch }) => {
    try {
        const [locationsRes, nationsRes] = await Promise.all([
            fetch('http://localhost:5000/api/locations'),
            fetch('http://localhost:5000/api/nations')
        ]);

        if (!locationsRes.ok || !nationsRes.ok) {
            throw new Error('Failed to load form data');
        }

        const locationsData = await locationsRes.json();
        const nationsData = await nationsRes.json();

        return {
            locations: locationsData.data as Location[],
            nations: nationsData.data as Nation[],
            status: 'success'
        };
    } catch (error) {
        console.error('Error loading form data:', error);
        return {
            locations: [],
            nations: [],
            status: 'error',
            error: error instanceof Error ? error.message : 'Unknown error'
        };
    }
};
