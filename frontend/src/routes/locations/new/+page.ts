import type { PageLoad } from './$types';
import type { Location } from '$lib/types';
import { API_BASE_URL } from '$lib/config/api';

export const load: PageLoad = async () => {
    const [locationsResponse, nationsResponse] = await Promise.all([
        fetch(`${API_BASE_URL}/api/locations`),
        fetch(`${API_BASE_URL}/api/nations`)
    ]);

    const locationsData = await locationsResponse.json();
    const nationsData = await nationsResponse.json();

    return {
        locations: locationsData.data as Location[],
        nations: nationsData.data
    };
};
