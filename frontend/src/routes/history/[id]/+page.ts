import { error, redirect } from '@sveltejs/kit';
import type { PageLoad } from './$types';
import type { HistoryEntryWithRelations } from '$lib/types';
import { API_BASE_URL } from '$lib/config/api';

export const load: PageLoad = async ({ params, fetch }) => {
    try {
        
        const historyId = params.id;
        
        if (!historyId) {
            throw error(400, 'History ID is required');
        }
        if (historyId.includes('.jpg') || historyId.includes('.png') || historyId.includes('.jpeg') || historyId.includes('.gif')) {
            throw redirect(307, '/history');
        }
        if (isNaN(Number(historyId))) {
            throw error(400, `Invalid history ID format: ${historyId}`);
        }
        
        const response = await fetch(`${API_BASE_URL}/api/historyEntries/${historyId}?t=${Date.now()}`);
        
        if (!response.ok) {
            if (response.status === 404) {
                console.error(`History entry not found: ${historyId}`);
                throw error(404, 'History entry not found');
            }
            throw error(response.status, `Failed to load history entry: ${response.statusText}`);
        }
        
        const responseText = await response.text();
        
        let data;
        try {
            data = JSON.parse(responseText);
        } catch (parseError) {
            console.error(`Error parsing response for history entry ${historyId}:`, parseError);
            throw error(500, `Failed to parse history entry data: ${responseText.substring(0, 100)}...`);
        }
        
        const historyEntry = data.data || data;
        
        if (!historyEntry) {
            console.error(`No history entry data found for ID: ${historyId}`);
            throw error(404, 'History entry data not found');
        }
        
        try {
            const category = encodeURIComponent(historyEntry.Category || '');
            const relatedResponse = await fetch(`${API_BASE_URL}/api/historyEntries?limit=5&Category=${category}`);
            
            if (!relatedResponse.ok) {
                console.warn(`Could not fetch related entries: ${relatedResponse.statusText}`);
                return { historyEntry, relatedEntries: [] };
            }
            
            const relatedData = await relatedResponse.json();
            const allRelated = relatedData.data || relatedData || [];

            const relatedEntries = allRelated
                .filter((entry: HistoryEntryWithRelations) => entry.HistoryID !== Number(historyEntry.HistoryID))
                .slice(0, 4);
                
            
            return { historyEntry, relatedEntries };
        } catch (relatedError) {
            console.warn('Error fetching related history entries:', relatedError);
            return { historyEntry, relatedEntries: [] };
        }
    } catch (e: unknown) {
        console.error('Error in history entry page load:', e);
        if (typeof e === 'object' && e !== null && 'status' in e && e.status === 307) {
            throw e;
        }
        if (typeof e === 'object' && e !== null && 'status' in e && 'body' in e) {
            throw e as { status: number, body: string };
        }
        throw error(500, e instanceof Error ? e.message : 'Error loading history entry');
    }
};
