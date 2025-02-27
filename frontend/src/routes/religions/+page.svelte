<script lang="ts">
	import { onMount } from 'svelte';
	import type { Religion } from '$lib/types';

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
	<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
		{#each religions as religion}
			<a
				href={`/religions/${religion.ReligionID}`}
				class="block bg-slate-700 bg-opacity-80 border-slate-800 border p-4 rounded-lg shadow
				overflow-hidden hover:shadow-xl transition-all duration-300 hover:bg-slate-800 transform hover:-translate-y-1 cursor-pointer"
			>
				<h2 class="text-xl font-semibold mb-2 text-white text-center">{religion.Name}</h2>

				{#if religion.ImageURL}
					<img
						src={religion.ImageURL}
						alt={religion.Name}
						class="w-full h-32 object-cover rounded mb-4"
					/>
				{/if}

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
			</a>
		{/each}
	</div>
	<div>
		<a href="./religions/new">
			<button class="bg-sky-700 hover:bg-sky-600 text-white font-bold py-2 mt-5 px-4 rounded">
				New Religion
			</button>
		</a>
	</div>
{/if}
