<script lang="ts">
	import { onMount } from 'svelte';
	import type { Character } from '$lib/types';
	import ItemBox from '$lib/components/ItemBox.svelte';
	import GridLayout from '$lib/components/GridLayout.svelte';
	import { getImageUrl } from '$lib/utils/imageUtils';
	import { API_BASE_URL } from '$lib/config/api';

	let characters: Character[] = [];
	let loading = true;
	let error: string | null = null;

	onMount(async () => {
		try {
			const response = await fetch(`${API_BASE_URL}/api/characters`);
			if (!response.ok) throw new Error('Failed to fetch characters');
			const data = await response.json();
			characters = data.data;
		} catch (err) {
			error = err instanceof Error ? err.message : 'An error occurred';
		} finally {
			loading = false;
		}
	});
</script>

{#if loading}
	<p class="text-center text-gray-500">Loading...</p>
{:else if error}
	<p class="text-center text-red-500">{error}</p>
{:else}
	<div class="flex justify-between items-center mb-6">
		<h1 class="text-3xl text-white font-bold">Characters</h1>
		<a href="./characters/new">
			<button class="bg-sky-700 hover:bg-sky-600 text-white font-bold py-2 px-4 rounded">
				New Character
			</button>
		</a>
	</div>
	<GridLayout>
		{#each characters as character}
			<ItemBox
				href={`/characters/${character.CharacterID}`}
				title={character.Name}
				imageUrl={getImageUrl(character.ImageURL)}
			>
				{#if character.Title}
					<p class="text-white text-center mb-4">{character.Title}</p>
				{/if}
			</ItemBox>
		{/each}
	</GridLayout>
{/if}
