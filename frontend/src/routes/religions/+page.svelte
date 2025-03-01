<script lang="ts">
	import { onMount } from 'svelte';
	import type { Religion } from '$lib/types';
	import ItemBox from '$lib/components/ItemBox.svelte';
	import GridLayout from '$lib/components/GridLayout.svelte';

	let religions: Religion[] = [];
	let loading = true;
	let error: string | null = null;

	onMount(async () => {
		try {
			const response = await fetch('http://localhost:5000/api/religions');
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
	<div class="flex justify-end w-full mb-5">
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
				imageUrl={religion.ImageURL}
			>
				{#if religion.Deities}
					<div class="mb-2">
						<h3 class="text-sky-300 text-sm font-semibold">Deities</h3>
						<p class="text-white">{religion.Deities}</p>
					</div>
				{/if}

				{#if religion.HolyText}
					<div class="mb-2">
						<h3 class="text-sky-300 text-sm font-semibold">Holy Text</h3>
						<p class="text-white">{religion.HolyText}</p>
					</div>
				{/if}

				{#if religion.Practices}
					<div class="mb-2">
						<h3 class="text-sky-300 text-sm font-semibold">Practices</h3>
						<p class="text-white text-sm">
							{religion.Practices.length > 100
								? religion.Practices.slice(0, 100) + '...'
								: religion.Practices}
						</p>
					</div>
				{/if}
			</ItemBox>
		{/each}
	</GridLayout>
{/if}
