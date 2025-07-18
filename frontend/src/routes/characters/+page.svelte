<script lang="ts">
	import { onMount } from 'svelte';
	import type { Character } from '$lib/types';
	import ItemBox from '$lib/components/ItemBox.svelte';
	import GridLayout from '$lib/components/GridLayout.svelte';
	import { getImageUrl } from '$lib/utils/imageUtils';

	let characters: Character[] = [];
	let loading = true;
	let error: string | null = null;

	onMount(async () => {
		try {
			const response = await fetch('http://localhost:5000/api/characters');
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
	<div class="flex justify-end w-full mb-5">
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
