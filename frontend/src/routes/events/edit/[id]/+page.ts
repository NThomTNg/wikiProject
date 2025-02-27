import type { PageLoad } from './$types';

export const load = (async ({ params }) => {
    return {
        id: params.id,
        title: 'Edit Event',
        description: `Edit information for event ID: ${params.id}`
    };
}) satisfies PageLoad;
