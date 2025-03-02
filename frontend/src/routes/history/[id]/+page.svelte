<script lang="ts">
	import { onMount } from 'svelte';
	import { page } from '$app/stores';
	import { goto } from '$app/navigation';
	import type { PageData } from './$types';
	import type { HistoryEntryWithRelations } from '$lib/types';

	export let data: PageData;
	const id = $page.params.id;

	console.log(`Rendering history entry page component with ID: ${id}`);

	let historyEntry: HistoryEntryWithRelations | null = null;
	let relatedEntries: HistoryEntryWithRelations[] = [];
	let loading = true;
	let error: string | null = null;

	onMount(async () => {
		await fetchHistoryDetails();
	});

	async function fetchHistoryDetails() {
		loading = true;
		error = null;
		console.log(`Fetching history details for ID: ${id}`);

		if (id.includes('.jpg') || id.includes('.png') || id.includes('.jpeg') || id.includes('.gif')) {
			console.error(`ID appears to be an image filename: ${id}`);
			error =
				'Invalid history ID format. Using what appears to be an image filename instead of a history ID.';
			loading = false;
			return;
		}

		try {
			const response = await fetch(
				`http://localhost:5000/api/historyEntries/${id}?t=${Date.now()}`
			);
			console.log('Response status:', response.status);

			if (!response.ok) {
				if (response.status === 404) {
					throw new Error('History entry not found');
				}
				throw new Error(`HTTP error! status: ${response.status}`);
			}

			const responseText = await response.text();
			console.log('Response text:', responseText);

			let data;
			try {
				data = JSON.parse(responseText);
				console.log('Parsed data:', data);
			} catch (parseError) {
				console.error('Error parsing response:', parseError);
				throw new Error(`Failed to parse response: ${responseText}`);
			}

			if (data && (data.data || data)) {
				historyEntry = data.data || data;
				console.log('History entry data loaded:', historyEntry);

				if (historyEntry && historyEntry.Category) {
					await fetchRelatedEntries(historyEntry.Category);
				}
			} else {
				throw new Error('Invalid response format or empty data');
			}
		} catch (e) {
			console.error('Error fetching history entry:', e);
			error = e instanceof Error ? e.message : String(e);
		} finally {
			loading = false;
		}
	}

	async function fetchRelatedEntries(category: string) {
		if (!category) {
			relatedEntries = [];
			return;
		}

		try {
			const response = await fetch(
				`http://localhost:5000/api/historyEntries?limit=5&Category=${encodeURIComponent(category)}`
			);
			if (!response.ok) return;

			const data = await response.json();
			const allRelated = data.data || data || [];

			relatedEntries = allRelated
				.filter((entry: HistoryEntryWithRelations) => entry.HistoryID !== Number(id))
				.slice(0, 4);
		} catch (e) {
			console.error('Error fetching related entries:', e);
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
		if (!entry || !entry.HistoryID) return;
		goto(`/history/${entry.HistoryID}`);
	}
	$: {
		if (data && data.historyEntry && !loading) {
			historyEntry = data.historyEntry;
			relatedEntries = data.relatedEntries || [];
		}
	}

	function handleEdit() {
		goto(`/history/edit/${id}`);
	}

	async function handleDelete() {
		if (!confirm('Are you sure you want to delete this history entry?')) {
			return;
		}

		try {
			const response = await fetch(`http://localhost:5000/api/historyEntries/${id}`, {
				method: 'DELETE'
			});

			if (!response.ok) {
				throw new Error(`Failed to delete history entry: ${response.statusText}`);
			}

			goto('/history');
		} catch (e) {
			console.error('Error deleting history entry:', e);
			error = e instanceof Error ? e.message : String(e);
		}
	}
</script>

<div class="container mx-auto px-4 py-6">
	<div class="mb-6">
		<button
			on:click={() => goto('/history')}
			class="text-white bg-sky-700 p-2 rounded hover:bg-sky-600 hover:shadow-lg"
		>
			← Back to history
		</button>
	</div>

	{#if loading}
		<div class="flex justify-center items-center h-48">
			<div class="text-white text-lg">Loading history entry...</div>
		</div>
	{:else if error}
		<div class="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6" role="alert">
			<p class="font-bold">Error</p>
			<p>{error}</p>
			<p class="mt-2">
				<strong>Debug info:</strong> Attempted to load history with ID: "{id}"
			</p>
			<button
				on:click={() => goto('/history')}
				class="mt-4 bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded"
			>
				Return to History Entries
			</button>
		</div>
	{:else if historyEntry}
		<div class="flex justify-between items-center mb-6">
			<h1 class="text-3xl font-bold text-white">{historyEntry.Title}</h1>
			<div class="space-x-2">
				<button
					on:click={handleEdit}
					class="bg-sky-700 hover:bg-sky-600 text-white font-bold py-2 px-4 rounded"
				>
					Edit
				</button>
				<button
					on:click={handleDelete}
					class="bg-red-700 hover:bg-red-600 text-white font-bold py-2 px-4 rounded"
				>
					Delete
				</button>
			</div>
		</div>

		<div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
			<div class="lg:col-span-2 bg-amber-50 border border-amber-200 rounded-lg p-6 shadow-md">
				{#if historyEntry.ImageURL}
					<img
						src={historyEntry.ImageURL}
						alt={historyEntry.Title}
						class="w-full h-auto object-cover rounded mb-6 max-h-96"
					/>
				{/if}

				<div
					class="prose prose-lg max-w-none prose-headings:text-gray-800 prose-p:text-gray-700 font-serif"
				>
					{#if historyEntry.Content}
						<p
							class="first-letter:text-3xl first-letter:font-bold first-letter:float-left first-letter:mr-1 first-letter:mt-1"
						>
							{historyEntry.Content}
						</p>
					{:else}
						<p class="text-gray-500 italic">No content available for this historical entry.</p>
					{/if}
				</div>
			</div>

			<div class="lg:col-span-1">
				<div class="bg-slate-700 p-5 rounded-lg shadow mb-6">
					<h2 class="text-xl font-semibold mb-4 text-white border-b border-slate-600 pb-2">
						Historical Details
					</h2>
					<div class="space-y-3 text-slate-200">
						{#if historyEntry.TimelinePeriod}
							<div>
								<span class="font-semibold text-sky-300">Period:</span>
								{historyEntry.TimelinePeriod}
							</div>
						{/if}
						<div>
							<span class="font-semibold text-sky-300">Years:</span>
							{formatTimespan(historyEntry)}
						</div>
						{#if historyEntry.Category}
							<div>
								<span class="font-semibold text-sky-300">Category:</span>
								{historyEntry.Category}
							</div>
						{/if}
						{#if historyEntry?.NationName && historyEntry?.NationID}
							<div>
								<span class="font-semibold text-sky-300">Nation:</span>
								<button
									on:click={() => historyEntry && goto(`/nations/${historyEntry.NationID}`)}
									class="text-sky-200 hover:text-white hover:underline focus:outline-none"
								>
									{historyEntry.NationName}
								</button>
							</div>
						{:else if historyEntry.NationName}
							<div>
								<span class="font-semibold text-sky-300">Nation:</span>
								{historyEntry.NationName}
							</div>
						{/if}
						{#if historyEntry.CreatedDate}
							<div>
								<span class="font-semibold text-sky-300">Record Created:</span>
								{new Date(historyEntry.CreatedDate).toLocaleDateString()}
							</div>
						{/if}
					</div>
				</div>

				{#if relatedEntries && relatedEntries.length > 0}
					<div class="bg-slate-700 p-5 rounded-lg shadow">
						<h2 class="text-xl font-semibold mb-4 text-white border-b border-slate-600 pb-2">
							Related History
						</h2>
						<div class="space-y-3">
							{#each relatedEntries as entry}
								<div
									role="button"
									class="bg-slate-600 p-3 rounded cursor-pointer hover:bg-slate-500"
									on:click={() => viewHistoryEntry(entry)}
									on:keypress={(e) => {
										if (e.key === 'Enter') viewHistoryEntry(entry);
									}}
									tabindex="0"
								>
									<div class="font-medium text-white">{entry.Title}</div>
									{#if entry.TimelinePeriod}
										<div class="text-sm text-slate-300">{entry.TimelinePeriod}</div>
									{/if}
								</div>
							{/each}
						</div>
					</div>
				{/if}
			</div>
		</div>
	{:else}
		<div class="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 mb-6" role="alert">
			<p class="font-bold">No History Entry Found</p>
			<p>No history entry data was found for ID: {id}</p>
		</div>
	{/if}
</div>
