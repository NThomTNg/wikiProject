import type { LoadEvent } from '@sveltejs/kit';

export const load = async ({ params, fetch }: LoadEvent) => {
  try {
    const response = await fetch(`http://localhost:5000/api/nations/${params.id}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      },
      credentials: 'include' 
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to fetch nation');
    }

    const { data } = await response.json();

    return {
      nation: data
    };
  } catch (error) {
    return {
      error: error instanceof Error ? error.message : 'Failed to load nation'
    };
  }
};
