import type { PageLoad } from './$types';
import type { Location } from '$lib/types';

export const load: PageLoad = async () => {
    const [locationsResponse, nationsResponse] = await Promise.all([
        fetch('http://localhost:5000/api/locations'),
        fetch('http://localhost:5000/api/nations')
    ]);

    const locationsData = await locationsResponse.json();
    const nationsData = await nationsResponse.json();

    return {
        locations: locationsData.data as Location[],
        nations: nationsData.data
    };
};
