<script lang="ts">
	import { goto } from '$app/navigation';
	import type { PageData } from './$types';
	import { API_BASE_URL } from '$lib/config/api';

	export let data: PageData;
	const { nations } = data;

	let historyData = {
		Title: '',
		Content: '',
		StartYear: null,
		EndYear: null,
		NationID: null,
		Category: '',
		TimelinePeriod: '',
		ImageURL: ''
	};

	let isSubmitting = false;
	let errorMessage = '';
	let successMessage = '';

	const periodOptions = [
		'Birth Age',
		'Argoneasian Age',
		'Migration Era',
		'Fourth Era',
		'Breaking Age',
		'Fifth Era'
	];

	const categoryOptions = [
		'Political',
		'Military',
		'Cultural',
		'Social',
		'Economic',
		'Religious',
		'Technological',
		'Scientific'
	];

	async function handleSubmit() {
		isSubmitting = true;
		errorMessage = '';
		successMessage = '';

		try {
			console.log('Creating new history entry with data:', historyData);

			const response = await fetch(`${API_BASE_URL}/api/historyEntries`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify(historyData)
			});

			if (!response.ok) {
				const responseText = await response.text();
				console.error(`Error response: ${responseText}`);

				let errorData;
				try {
					errorData = JSON.parse(responseText);
				} catch (e) {
					throw new Error(`Failed to create history entry: ${response.statusText}`);
				}

				throw new Error(errorData.message || 'Failed to create history entry');
			}

			const result = await response.json();
			successMessage = 'History entry created successfully!';

			setTimeout(() => {
				goto(`/history/${result.data.HistoryID}`);
			}, 1500);
		} catch (err) {
			console.error('Error creating history entry:', err);
			errorMessage = err instanceof Error ? err.message : 'Failed to create history entry';
		} finally {
			isSubmitting = false;
		}
	}
</script>

<div class="container mx-auto px-4 py-6">
	<div class="flex justify-between items-center mb-6">
		<div class="mb-6">
			<button
				on:click={() => goto('/history')}
				class="text-white bg-sky-700 p-2 rounded hover:bg-sky-600 hover:shadow-lg"
			>
				← Back to history
			</button>
		</div>
	</div>

	{#if errorMessage}
		<div class="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6" role="alert">
			<p class="font-bold">Error</p>
			<p>{errorMessage}</p>
		</div>
	{/if}

	{#if successMessage}
		<div class="bg-green-100 border-l-4 border-green-500 text-green-700 p-4 mb-6" role="alert">
			<p class="font-bold">Success</p>
			<p>{successMessage}</p>
		</div>
	{/if}

	<form on:submit|preventDefault={handleSubmit} class="bg-slate-800 rounded-lg p-6 shadow-lg">
		<div class="grid grid-cols-1 md:grid-cols-2 gap-6">
			<div class="col-span-2">
				<label for="title" class="block text-sm font-medium text-slate-300 mb-1">Title</label>
				<input
					type="text"
					id="title"
					bind:value={historyData.Title}
					required
					class="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-sky-500"
				/>
			</div>

			<div>
				<label for="startYear" class="block text-sm font-medium text-slate-300 mb-1"
					>Start Year</label
				>
				<input
					type="number"
					id="startYear"
					bind:value={historyData.StartYear}
					class="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-sky-500"
					placeholder="e.g., 1800"
				/>
			</div>

			<div>
				<label for="endYear" class="block text-sm font-medium text-slate-300 mb-1">End Year</label>
				<input
					type="number"
					id="endYear"
					bind:value={historyData.EndYear}
					class="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-sky-500"
					placeholder="e.g., 1850"
				/>
			</div>

			<div>
				<label for="timelinePeriod" class="block text-sm font-medium text-slate-300 mb-1"
					>Time Period</label
				>
				<select
					id="timelinePeriod"
					bind:value={historyData.TimelinePeriod}
					class="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-sky-500"
				>
					<option value="">Select a period</option>
					{#each periodOptions as period}
						<option value={period}>{period}</option>
					{/each}
					<option value="Other">Other</option>
				</select>
			</div>

			<div>
				<label for="category" class="block text-sm font-medium text-slate-300 mb-1">Category</label>
				<select
					id="category"
					bind:value={historyData.Category}
					class="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-sky-500"
				>
					<option value="">Select a category</option>
					{#each categoryOptions as category}
						<option value={category}>{category}</option>
					{/each}
					<option value="Other">Other</option>
				</select>
			</div>

			<div>
				<label for="nationID" class="block text-sm font-medium text-slate-300 mb-1">Nation</label>
				<select
					id="nationID"
					bind:value={historyData.NationID}
					class="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-sky-500"
				>
					<option value="">Select a nation</option>
					{#each nations as nation}
						<option value={nation.NationID}>{nation.Name}</option>
					{/each}
				</select>
			</div>

			<div class="col-span-2">
				<label for="content" class="block text-sm font-medium text-slate-300 mb-1">Content</label>
				<textarea
					id="content"
					bind:value={historyData.Content}
					rows="8"
					class="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-sky-500"
				></textarea>
			</div>

			<div class="col-span-2 flex justify-end space-x-4">
				<button
					type="button"
					on:click={() => goto('/history')}
					class="px-4 py-2 bg-slate-600 text-white rounded-md hover:bg-slate-500"
					disabled={isSubmitting}
				>
					Cancel
				</button>
				<button
					type="submit"
					class="px-4 py-2 bg-sky-600 text-white rounded-md hover:bg-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-500"
					disabled={isSubmitting}
				>
					{isSubmitting ? 'Creating...' : 'Create History Entry'}
				</button>
			</div>
		</div>
	</form>
</div>
