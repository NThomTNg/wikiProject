import { error, redirect } from '@sveltejs/kit';
import type { PageLoad } from './$types';
import type { HistoryEntryWithRelations } from '$lib/types';

export const load: PageLoad = async ({ params, fetch, url }) => {
    try {
        // Log all parameters and the full URL
        console.log('Page URL:', url.toString());
        console.log('All params:', params);
        
        // Validate that ID is valid before making API call
        const historyId = params.id;
        
        console.log(`Raw history ID from params: "${historyId}"`);
        
        if (!historyId) {
            console.error('Missing history ID in parameters');
            throw error(400, 'History ID is required');
        }

        // Check if ID appears to be an image filename rather than a numeric ID
        if (historyId.includes('.jpg') || historyId.includes('.png') || historyId.includes('.jpeg') || historyId.includes('.gif')) {
            console.error(`ID appears to be an image filename: ${historyId}`);
            
            // Instead of throwing an error, try to redirect to the history page
            console.log('Redirecting to main history page due to invalid ID format');
            throw redirect(307, '/history');
        }

        // Check if ID is a valid number (matching the events page pattern)
        if (isNaN(Number(historyId))) {
            console.error(`Invalid history ID format: ${historyId}. ID should be a number.`);
            throw error(400, `Invalid history ID format: ${historyId}`);
        }

        console.log(`Loading history entry page for ID: ${historyId}`);
        
        // Add timestamp to prevent caching issues
        const response = await fetch(`http://localhost:5000/api/historyEntries/${historyId}?t=${Date.now()}`);
        console.log(`Response status for history entry ${historyId}:`, response.status);
        
        if (!response.ok) {
            if (response.status === 404) {
                console.error(`History entry not found: ${historyId}`);
                throw error(404, 'History entry not found');
            }
            console.error(`Failed to load history entry: ${response.status} ${response.statusText}`);
            throw error(response.status, `Failed to load history entry: ${response.statusText}`);
        }
        
        // First get the response as text for debugging
        const responseText = await response.text();
        console.log(`Response for history entry ${historyId}:`, responseText);
        
        // Then parse it as JSON
        let data;
        try {
            data = JSON.parse(responseText);
            console.log(`Parsed data for history entry ${historyId}:`, data);
        } catch (parseError) {
            console.error(`Error parsing response for history entry ${historyId}:`, parseError);
            throw error(500, `Failed to parse history entry data: ${responseText.substring(0, 100)}...`);
        }
        
        // Extract history entry data from response
        const historyEntry = data.data || data;
        
        if (!historyEntry) {
            console.error(`No history entry data found for ID: ${historyId}`);
            throw error(404, 'History entry data not found');
        }

        console.log(`Successfully loaded history entry data:`, historyEntry);
        
        // Get related entries
        try {
            const category = encodeURIComponent(historyEntry.Category || '');
            const relatedResponse = await fetch(`http://localhost:5000/api/historyEntries?limit=5&Category=${category}`);
            
            if (!relatedResponse.ok) {
                console.warn(`Could not fetch related entries: ${relatedResponse.statusText}`);
                return { historyEntry, relatedEntries: [] };
            }
            
            const relatedData = await relatedResponse.json();
            const allRelated = relatedData.data || relatedData || [];
            
            // Filter out the current entry and limit to 4 items
            const relatedEntries = allRelated
                .filter((entry: HistoryEntryWithRelations) => entry.HistoryID !== Number(historyEntry.HistoryID))
                .slice(0, 4);
                
            console.log(`Found ${relatedEntries.length} related history entries`);
            
            return { historyEntry, relatedEntries };
        } catch (relatedError) {
            console.warn('Error fetching related history entries:', relatedError);
            return { historyEntry, relatedEntries: [] };
        }
    } catch (e: unknown) {
        console.error('Error in history entry page load:', e);
        
        // Special handling for redirect
        if (typeof e === 'object' && e !== null && 'status' in e && e.status === 307) {
            throw e;
        }
        
        if (typeof e === 'object' && e !== null && 'status' in e && 'body' in e) {
            throw e as { status: number, body: string };
        }
        throw error(500, e instanceof Error ? e.message : 'Error loading history entry');
    }
};
