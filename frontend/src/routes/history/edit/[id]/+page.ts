import { error } from '@sveltejs/kit';
import type { PageLoad } from './$types';
import type { HistoryEntryWithRelations } from '$lib/types';
import { API_BASE_URL } from '$lib/config/api';

export const load: PageLoad = async ({ params, fetch }) => {
    try {
        const historyId = params.id;
        
        if (!historyId) {
            console.error('Missing history ID in parameters');
            throw error(400, 'History ID is required');
        }

        console.log(`Loading history entry for editing, ID: ${historyId}`);
        
        const response = await fetch(`${API_BASE_URL}/api/historyEntries/${historyId}?t=${Date.now()}`);
        
        if (!response.ok) {
            const errorData = await response.json();
            throw error(response.status, errorData.message || 'Failed to fetch history entry');
        }
        
        const data = await response.json();
        const historyEntry: HistoryEntryWithRelations = data.data || data;

        const nationsResponse = await fetch(`${API_BASE_URL}/api/nations`);
        const nationsData = await nationsResponse.json();
        const nations = nationsData.data || nationsData || [];
        
        return {
            historyEntry,
            nations
        };
    } catch (err) {
        console.error('Error loading data for edit page:', err);
        if (err && typeof err === 'object' && 'status' in err) throw err;
        throw error(500, 'Failed to load history entry for editing');
    }
};
