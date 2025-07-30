<script lang="ts">
	import { onMount } from 'svelte';
	import type { Nation } from '$lib/types';
	import ItemBox from '$lib/components/ItemBox.svelte';
	import GridLayout from '$lib/components/GridLayout.svelte';
	import { getImageUrl } from '$lib/utils/imageUtils';
	import { API_BASE_URL } from '$lib/config/api';

	let nations: Nation[] = [];
	let loading = true;
	let error: string | null = null;

	onMount(async () => {
		try {
			const response = await fetch(`${API_BASE_URL}/api/nations`);
			if (!response.ok) throw new Error('Failed to fetch nations');
			const data = await response.json();
			nations = data.data;
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
		<h1 class="text-3xl text-white font-bold">Nations</h1>
		<a href="./nations/new">
			<button class="bg-sky-700 hover:bg-sky-600 text-white font-bold py-2 mt-5 px-4 rounded">
				New Nation
			</button>
		</a>
	</div>
	<GridLayout>
		{#each nations as nation}
			<ItemBox
				href={`/nations/${nation.NationID}`}
				title={nation.Name}
				imageUrl={getImageUrl(nation.ImageURL)}
			>
				{#if nation.Government}
					<p class="text-white text-center mb-4">{nation.Government}</p>
				{/if}
				{#if nation.Culture}
					<p class="text-gray-300 text-sm text-center italic">
						{nation.Culture.length > 100 ? nation.Culture.slice(0, 100) + '...' : nation.Culture}
					</p>
				{/if}
			</ItemBox>
		{/each}
	</GridLayout>
{/if}
