<script lang="ts">
	import { onMount } from 'svelte';
	import type { Location } from '$lib/types';
	import ItemBox from '$lib/components/ItemBox.svelte';
	import GridLayout from '$lib/components/GridLayout.svelte';
	import { API_BASE_URL } from '$lib/config/api';

	let locations: Location[] = [];
	let loading = true;
	let error: string | null = null;

	onMount(async () => {
		try {
			const response = await fetch(`${API_BASE_URL}/api/locations`);
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
	<div class="flex justify-between items-center mb-6">
		<h1 class="text-3xl text-white font-bold">Locations</h1>
		<a href="./locations/new">
			<button class="bg-sky-700 hover:bg-sky-600 text-white font-bold py-2 mt-5 px-4 rounded">
				New Location
			</button>
		</a>
	</div>
	<GridLayout>
		{#each locations as location}
			<ItemBox href={`/locations/${location.LocationID}`} title={location.Name}>
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
			</ItemBox>
		{/each}
	</GridLayout>
{/if}
