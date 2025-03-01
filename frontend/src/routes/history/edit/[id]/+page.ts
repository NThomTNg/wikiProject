import { error } from '@sveltejs/kit';
import type { PageLoad } from './$types';
import type { HistoryEntryWithRelations } from '$lib/types';

export const load: PageLoad = async ({ params, fetch }) => {
    try {
        const historyId = params.id;
        
        if (!historyId) {
            console.error('Missing history ID in parameters');
            throw error(400, 'History ID is required');
        }

        console.log(`Loading history entry for editing, ID: ${historyId}`);
        
        // Add timestamp to prevent caching issues
        const response = await fetch(`http://localhost:5000/api/historyEntries/${historyId}?t=${Date.now()}`);
        
        if (!response.ok) {
            const errorData = await response.json();
            throw error(response.status, errorData.message || 'Failed to fetch history entry');
        }
        
        const data = await response.json();
        const historyEntry: HistoryEntryWithRelations = data.data || data;

        // Fetch nations for dropdown
        const nationsResponse = await fetch('http://localhost:5000/api/nations');
        const nationsData = await nationsResponse.json();
        const nations = nationsData.data || nationsData || [];
        
        return {
            historyEntry,
            nations
        };
    } catch (err) {
        console.error('Error loading data for edit page:', err);
        if (err.status) throw err;
        throw error(500, 'Failed to load history entry for editing');
    }
};
