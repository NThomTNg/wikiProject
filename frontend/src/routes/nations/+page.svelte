<script lang="ts">
	import { onMount } from 'svelte';
	import type { Nation } from '$lib/types';

	let nations: Nation[] = [];
	let loading = true;
	let error: string | null = null;

	onMount(async () => {
		try {
			const response = await fetch('http://localhost:5000/api/nations');
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
	<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
		{#each nations as nation}
			<a
				href={`/nations/${nation.NationID}`}
				class="block bg-slate-700 bg-opacity-80 border-slate-800 border p-4 rounded-lg shadow
				overflow-hidden hover:shadow-xl transition-all duration-300 hover:bg-slate-800 transform hover:-translate-y-1 cursor-pointer"
			>
				<h2 class="text-xl font-semibold mb-2 text-white text-center">{nation.Name}</h2>
				{#if nation.Government}
					<p class="text-white text-center mb-4">{nation.Government}</p>
				{/if}
				{#if nation.ImageURL}
					<img
						src={nation.ImageURL}
						alt={nation.Name}
						class="w-full h-auto object-cover rounded mb-2"
					/>
				{/if}
				{#if nation.Culture}
					<p class="text-gray-300 text-sm text-center italic">
						{nation.Culture.length > 100 ? nation.Culture.slice(0, 100) + '...' : nation.Culture}
					</p>
				{/if}
			</a>
		{/each}
	</div>
	<div>
		<a href="./nations/new">
			<button class="bg-sky-700 hover:bg-sky-600 text-white font-bold py-2 mt-5 px-4 rounded">
				New Nation
			</button>
		</a>
	</div>
{/if}
