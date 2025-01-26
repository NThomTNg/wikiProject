<script lang="ts">
	import { onMount } from 'svelte';
	import type { Location } from '$lib/types';

	let locations: Location[] = [];
	let loading = true;
	let error: string | null = null;

	onMount(async () => {
		try {
			const response = await fetch('http://localhost:5000/api/locations');
			if (!response.ok) throw new Error('Failed to fetch locations');
			const data = await response.json();
			locations = data.data;
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
		{#each locations as location}
			<a
				href={`/locations/${location.LocationID}`}
				class="block bg-slate-700 bg-opacity-80 border-slate-800 border p-4 rounded-lg shadow hover:shadow-2xl transition-shadow duration-200"
			>
				<h2 class="text-xl font-semibold mb-2 text-white text-center">{location.Name}</h2>
				{#if location.LocationType}
					<p class="text-white text-center mb-4">{location.LocationType}</p>
				{/if}
				{#if location.Description}
					<p class="text-gray-300 text-sm text-center italic">
						{location.Description.length > 100
							? location.Description.slice(0, 100) + '...'
							: location.Description}
					</p>
				{/if}
				{#if location.Population}
					<p class="text-gray-300 text-sm text-center mt-2">
						Population: {location.Population.toLocaleString()}
					</p>
				{/if}
			</a>
		{/each}
	</div>
	<div>
		<a href="./locations/new">
			<button class="bg-sky-700 hover:bg-sky-600 text-white font-bold py-2 mt-5 px-4 rounded">
				New Location
			</button>
		</a>
	</div>
{/if}
