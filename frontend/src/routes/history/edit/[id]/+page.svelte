<script lang="ts">
	import { page } from '$app/stores';
	import { goto } from '$app/navigation';
	import type { PageData } from './$types';
	import type { HistoryEntryWithRelations } from '$lib/types';

	export let data: PageData;
	const { historyEntry, nations } = data;
	const id = $page.params.id;

	console.log(`Editing history entry with ID: ${id}`);

	let historyData = { ...historyEntry };
	let isSubmitting = false;
	let errorMessage = '';
	let successMessage = '';

	const periodOptions = [
		'Ancient History',
		'Classical Antiquity',
		'Middle Ages',
		'Renaissance',
		'Early Modern Period',
		'Industrial Revolution',
		'Modern Era',
		'Contemporary History'
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
			console.log(`Updating history entry ${id} with data:`, historyData);

			const response = await fetch(`http://localhost:5000/api/historyEntries/${id}`, {
				method: 'PUT',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({
					Title: historyData.Title,
					Content: historyData.Content,
					StartYear: historyData.StartYear,
					EndYear: historyData.EndYear,
					NationID: historyData.NationID,
					Category: historyData.Category,
					TimelinePeriod: historyData.TimelinePeriod,
					ImageURL: historyData.ImageURL
				})
			});

			if (!response.ok) {
				const responseText = await response.text();
				console.error(`Error response: ${responseText}`);

				let errorData;
				try {
					errorData = JSON.parse(responseText);
				} catch (e) {
					throw new Error(`Failed to update history entry: ${response.statusText}`);
				}

				throw new Error(errorData.message || 'Failed to update history entry');
			}

			successMessage = 'History entry updated successfully!';
			setTimeout(() => {
				goto(`/history/${id}`);
			}, 1500);
		} catch (err) {
			console.error('Error updating history entry:', err);
			errorMessage = err instanceof Error ? err.message : 'Failed to update history entry';
		} finally {
			isSubmitting = false;
		}
	}

	function cancelEdit() {
		goto(`/history/${id}`);
	}
</script>

<div class="container mx-auto px-4 py-6">
	<div class="flex justify-between items-center mb-6">
		<button
			on:click={() => goto('/history')}
			class="text-white bg-sky-700 p-2 rounded hover:bg-sky-600 hover:shadow-lg"
		>
			← Back to history
		</button>
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

			<div>
				<label for="imageURL" class="block text-sm font-medium text-slate-300 mb-1">Image URL</label
				>
				<input
					type="text"
					id="imageURL"
					bind:value={historyData.ImageURL}
					class="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-sky-500"
					placeholder="https://example.com/image.jpg"
				/>
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
					on:click={cancelEdit}
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
					{isSubmitting ? 'Updating...' : 'Update History Entry'}
				</button>
			</div>
		</div>
	</form>
</div>
