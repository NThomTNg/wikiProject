<script lang="ts">
	import { onMount } from 'svelte';
	import type { Character } from '$lib/types';

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
	<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
		{#each characters as character}
			<a
				href="/characters/{character.CharacterID}"
				class="block bg-slate-700 bg-opacity-80 border-slate-800 border p-4 rounded-lg shadow hover:shadow-2xl transition-shadow duration-200"
			>
				<h2 class="text-xl font-semibold mb-2 text-white text-center">{character.Name}</h2>
				{#if character.Title}
					<p class="text-white text-center mb-4">{character.Title}</p>
					<img src={character.ImageURL} alt={character.Name} class="w-full h-auto rounded mb-2" />
				{/if}
			</a>
		{/each}
	</div>
	<div>
		<a href="./characters/new">
			<button class="bg-sky-700 hover:bg-sky-600 text-white font-bold py-2 mt-5 px-4 rounded">
				New Character
			</button>
		</a>
	</div>
{/if}
