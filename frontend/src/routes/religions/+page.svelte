<script lang="ts">
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import type { Religion } from '$lib/types';
	import { getImageUrl } from '$lib/utils/imageUtils';

	export let data: { religions: Religion[] };

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

<div class="p-4">
	<div class="flex justify-between items-center mb-6">
		<h1 class="text-3xl text-white font-bold">Religions</h1>
		<a href="./religions/new">
			<button class="bg-sky-700 hover:bg-sky-600 text-white font-bold py-2 px-4 rounded">
				New Religion
			</button>
		</a>
	</div>

	{#if loading}
		<p class="text-center text-gray-500">Loading...</p>
	{:else if error}
		<p class="text-center text-red-500">{error}</p>
	{:else if data.religions?.length === 0}
		<p class="text-center my-8 text-gray-400">No religions found. Create your first one!</p>
	{:else}
		<div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
			{#each data.religions as religion}
				<div
					class="bg-gray-800 rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow cursor-pointer"
					on:click={() => goto(`/religions/${religion.ReligionID}`)}
					on:keydown={(e) => e.key === 'Enter' && goto(`/religions/${religion.ReligionID}`)}
					role="button"
					tabindex="0"
				>
					<div class="h-48 overflow-hidden">
						{#if religion.ImageURL}
							<img
								src={getImageUrl(religion.ImageURL)}
								alt={religion.Name}
								class="w-full h-full object-cover transition-transform hover:scale-105"
							/>
						{:else}
							<div class="w-full h-full bg-gray-700 flex items-center justify-center">
								<span class="text-gray-400">No image</span>
							</div>
						{/if}
					</div>
					<div class="p-4">
						<h2 class="text-xl font-bold text-white">{religion.Name}</h2>
						{#if religion.Deities}
							<p class="text-gray-400 mt-2 truncate">Deities: {religion.Deities}</p>
						{/if}
					</div>
				</div>
			{/each}
		</div>
	{/if}
</div>
