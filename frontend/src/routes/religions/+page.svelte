<script lang="ts">
	import { onMount } from 'svelte';
	import type { Religion } from '$lib/types';
	import ItemBox from '$lib/components/ItemBox.svelte';
	import GridLayout from '$lib/components/GridLayout.svelte';
	import { getImageUrl } from '$lib/utils/imageUtils';
	import { API_BASE_URL } from '$lib/config/api';

	let religions: Religion[] = [];
	let loading = true;
	let error: string | null = null;

	onMount(async () => {
		try {
			const response = await fetch(`${API_BASE_URL}/api/religions`);
			if (!response.ok) throw new Error('Failed to fetch religions');
			const data = await response.json();
			religions = data.data;
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
		<h1 class="text-3xl text-white font-bold">Religions</h1>
		<a href="./religions/new">
			<button class="bg-sky-700 hover:bg-sky-600 text-white font-bold py-2 mt-5 px-4 rounded">
				New Religion
			</button>
		</a>
	</div>
	<GridLayout>
		{#each religions as religion}
			<ItemBox
				href={`/religions/${religion.ReligionID}`}
				title={religion.Name}
				imageUrl={getImageUrl(religion.ImageURL)}
			>
				{#if religion.Deities}
					<p class="text-gray-400 text-center mb-4">Deities: {religion.Deities}</p>
				{/if}
			</ItemBox>
		{/each}
	</GridLayout>
{/if}
