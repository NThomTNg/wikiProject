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
	<p>Loading...</p>
{:else if error}
	<p class="error">{error}</p>
{:else}
	<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
		{#each characters as character}
			<a href="/characters/{character.CharacterID}" class="card">
				<h2>{character.Name}</h2>
				{#if character.Title}
					<p>{character.Name}</p>
					<p>{character.Title}</p>
					<img src={character.ImageURL} alt={character.Name} class="w-max h-auto" />|
				{/if}
			</a>
		{/each}
	</div>
{/if}

<style>
	.card {
		border: 1px solid #ddd;
		padding: 1rem;
		border-radius: 0.5rem;
		transition: transform 0.2s;
	}

	.card:hover {
		transform: translateY(-2px);
	}
</style>
