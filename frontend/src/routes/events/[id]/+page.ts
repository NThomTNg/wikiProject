import { error } from '@sveltejs/kit';
import type { PageLoad } from './$types';
import type { EventWithRelations } from '$lib/types';
import { API_BASE_URL } from '$lib/config/api';

export const load: PageLoad = async ({ params, fetch }) => {
    try {
        const eventId = params.id;
        
        if (!eventId || isNaN(Number(eventId))) {
            console.error(`Invalid event ID: ${eventId}`);
            throw error(400, `Invalid event ID: ${eventId}`);
        }
        const response = await fetch(`${API_BASE_URL}/api/events/${eventId}?t=${Date.now()}`);
        
        if (!response.ok) {
            if (response.status === 404) {
                throw error(404, 'Event not found');
            }
            console.error(`Failed to load event: ${response.status} ${response.statusText}`);
            throw error(response.status, `Failed to load event: ${response.statusText}`);
        }
        
        const responseText = await response.text();

        let data;
        try {
            data = JSON.parse(responseText);
        } catch (parseError) {
            console.error(`Error parsing response for event ${eventId}:`, parseError);
            throw error(500, `Failed to parse event data: ${responseText.substring(0, 100)}...`);
        }
        
        const eventData = data.data || data;
        
        console.log('PageLoad - Event data loaded:', eventData);
        console.log('PageLoad - TimelinePeriod:', eventData.TimelinePeriod);
        console.log('PageLoad - StartYear:', eventData.StartYear);
        console.log('PageLoad - EndYear:', eventData.EndYear);
        
        if (!eventData) {
            console.error(`No event data found for ID: ${eventId}`);
            throw error(404, 'Event data not found');
        }
        return {
            event: eventData as EventWithRelations
        };
    } catch (e: unknown) {
        console.error('Error in event page load:', e);
        if (typeof e === 'object' && e !== null && 'status' in e && 'body' in e) {
            throw e as { status: number, body: string };
        }
        throw error(500, e instanceof Error ? e.message : 'Error loading event');
    }
};