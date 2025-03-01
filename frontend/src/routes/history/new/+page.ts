import type { PageLoad } from './$types';

export const load: PageLoad = async ({ fetch }) => {
    try {
        const nationsResponse = await fetch('http://localhost:5000/api/nations');
        const nationsData = await nationsResponse.json();
        const nations = nationsData.data || nationsData || [];
        
        return { nations };
    } catch (err) {
        console.error('Error loading nations for new history entry:', err);
        return { nations: [] };
    }
};
