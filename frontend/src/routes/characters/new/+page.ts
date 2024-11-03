import type { PageLoad } from './$types';
import type { Character } from '$lib/types';

export const load: PageLoad = async () => {
	const response = await fetch('http://localhost:5000/api/characters');
	if (!response.ok) {
		throw new Error('Failed to fetch characters');
	}
	const data = await response.json();
	return {
		characters: data.data as Character[],
	};
};
