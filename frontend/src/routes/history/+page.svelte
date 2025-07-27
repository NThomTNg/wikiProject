<script lang="ts">
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import GridLayout from '$lib/components/GridLayout.svelte';
	import ItemBox from '$lib/components/ItemBox.svelte';
	import type { HistoryEntryWithRelations } from '$lib/types';

	let historyEntries: HistoryEntryWithRelations[] = [];
	let loading = true;
	let error: string | null = null;

	onMount(async () => {
		await fetchHistoryEntries();
	});

	async function fetchHistoryEntries() {
		try {
			const response = await fetch('http://localhost:5000/api/historyEntries');
			if (!response.ok) {
				throw new Error('Failed to fetch history entries');
			}
			const responseText = await response.text();

			let data;
			try {
				data = JSON.parse(responseText);
			} catch (error) {
				console.error('Error parsing history entries:', error);
				throw new Error('Failed to parse history entries response');
			}

			historyEntries = data.data || data || [];
		} catch (err) {
			console.error('Error fetching history entries:', err);
			error = err instanceof Error ? err.message : 'An error occurred';
		} finally {
			loading = false;
		}
	}

	function formatTimespan(entry: HistoryEntryWithRelations): string {
		if (entry.StartYear && entry.EndYear) {
			return `${entry.StartYear} - ${entry.EndYear}`;
		} else if (entry.StartYear) {
			return `${entry.StartYear} onwards`;
		} else if (entry.EndYear) {
			return `Until ${entry.EndYear}`;
		} else {
			return 'No date specified';
		}
	}

	function viewHistoryEntry(entry: HistoryEntryWithRelations) {
		if (!entry) {
			console.error('Invalid history entry:', entry);
			return;
		}

		if (!entry.HistoryID || isNaN(Number(entry.HistoryID))) {
			console.error('Invalid history entry ID:', entry.HistoryID);
			return;
		}

		const id = entry.HistoryID.toString();
		console.log(`Navigating to history entry with ID: ${id}`);
		goto(`/history/${id}`);
	}

	function goToRandomEntry() {
		if (historyEntries.length === 0) {
			alert('No history entries available');
			return;
		}

		const randomIndex = Math.floor(Math.random() * historyEntries.length);
		const randomEntry = historyEntries[randomIndex];
		viewHistoryEntry(randomEntry);
	}

	function truncateText(text: string, maxLength: number = 200): string {
		if (text.length <= maxLength) {
			return text;
		}
		return text.substring(0, maxLength).trim() + '...';
	}
</script>

<div class="container mx-auto px-4 py-6">
	<div class="flex justify-between items-center mb-6">
		<h1 class="text-3xl font-bold text-white">Historical Entries</h1>
		<div class="flex gap-2">
			<button
				on:click={goToRandomEntry}
				class="bg-sky-700 hover:bg-sky-600 text-white font-bold py-2 px-4 rounded"
			>
				Random Entry
			</button>
			<button
				on:click={() => goto('/history/new')}
				class="bg-sky-700 hover:bg-sky-600 text-white font-bold py-2 px-4 rounded"
			>
				Add New Entry
			</button>
		</div>
	</div>

	<p class="text-slate-300 mb-6">
		Explore the historical events and periods that shaped the world.
	</p>

	{#if loading}
		<div class="flex justify-center items-center h-48">
			<div class="text-white">Loading history entries...</div>
		</div>
	{:else if error}
		<div class="bg-red-100 border-l-4 border-red-500 text-red-700 p-4" role="alert">
			<p class="font-bold">Error</p>
			<p>{error}</p>
		</div>
	{:else}
		<GridLayout cols="grid-cols-1 md:grid-cols-2 lg:grid-cols-3" gap="gap-6">
			{#each historyEntries as entry}
				<div
					on:click={() => viewHistoryEntry(entry)}
					on:keypress={(e) => {
						if (e.key === 'Enter' || e.key === ' ') viewHistoryEntry(entry);
					}}
					role="button"
					tabindex="0"
					data-history-id={entry.HistoryID}
				>
					<div
						class="bg-amber-50 border border-black rounded-md p-4 my-3 shadow-md overflow-y-auto font-serif text-justify text-gray-800"
					>
						{#if entry.Title}
							<h2 class="text-xl font-semibold mb-2">{entry.Title}</h2>
						{/if}
						{#if entry.Content}
							<p class="first-letter:text-xxl first-letter:font-serif mb-3">
								{truncateText(entry.Content, 500)}
							</p>
						{/if}
						{#if entry.TimelinePeriod}
							<p><span class="font-semibold">Period:</span> {entry.TimelinePeriod}</p>
						{/if}
						<p><span class="font-semibold">Years:</span> {formatTimespan(entry)}</p>
						{#if entry.Category}
							<p><span class="font-semibold">Category:</span> {entry.Category}</p>
						{/if}
						{#if entry.NationName}
							<p><span class="font-semibold">Nation:</span> {entry.NationName}</p>
						{/if}
					</div>
				</div>
			{/each}
		</GridLayout>
	{/if}
</div>
