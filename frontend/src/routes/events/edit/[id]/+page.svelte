<script lang="ts">
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import type { Nation, Location, Event } from '$lib/types';
	import { API_BASE_URL } from '$lib/config/api';

	const id = $page.params.id;
	let event: Event | null = null;

	let title = '';
	let description = '';
	let timelinePeriod = '';
	let startYear = '';
	let endYear = '';
	let locationId: number | null = null;
	let nationId: number | null = null;

	let locations: Location[] = [];
	let nations: Nation[] = [];
	let loading = true;
	let submitLoading = false;
	let error: string | null = null;

	const timelinePeriods = [
		'Birth Age',
		'Argoneasian Age',
		'Migration Era',
		'Fourth Era',
		'Breaking Age',
		'Fifth Era'
	];

	onMount(async () => {
		try {
			const [eventRes, locationsRes, nationsRes] = await Promise.all([
				fetch(`${API_BASE_URL}/api/events/${id}`),
				fetch(`${API_BASE_URL}/api/locations`),
				fetch(`${API_BASE_URL}/api/nations`)
			]);
			if (!eventRes.ok) {
				if (eventRes.status === 404) {
					throw new Error('Event not found');
				}
				throw new Error(`HTTP error! status: ${eventRes.status}`);
			}

			if (!locationsRes.ok || !nationsRes.ok) {
				throw new Error('Failed to load reference data');
			}

			const eventData = await eventRes.json();
			const locationsData = await locationsRes.json();
			const nationsData = await nationsRes.json();

			event = eventData.data;
			locations = locationsData.data || [];
			nations = nationsData.data || [];

			if (event) {
				title = event.Title;
				description = event.Description || '';
				timelinePeriod = event.TimelinePeriod || '';
				startYear = event.StartYear ? String(event.StartYear) : '';
				endYear = event.EndYear ? String(event.EndYear) : '';
				locationId = event.LocationID || null;
				nationId = event.NationID || null;
			}
		} catch (e) {
			console.error('Error loading data:', e);
			error = e instanceof Error ? e.message : String(e);
		} finally {
			loading = false;
		}
	});

	async function handleSubmit() {
		if (!title) {
			error = 'Title is required';
			return;
		}

		submitLoading = true;
		error = null;

		try {
			const eventData = {
				Title: title,
				Description: description,
				TimelinePeriod: timelinePeriod || null,
				StartYear: startYear ? Number(startYear) : null,
				EndYear: endYear ? Number(endYear) : null,
				LocationID: locationId,
				NationID: nationId
			};

			const response = await fetch(`${API_BASE_URL}/api/events/${id}`, {
				method: 'PUT',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify(eventData)
			});

			if (!response.ok) {
				throw new Error(`Failed to update event: ${response.statusText}`);
			}

			goto(`/events/${id}`);
		} catch (e) {
			console.error('Error submitting form:', e);
			error = e instanceof Error ? e.message : String(e);
		} finally {
			submitLoading = false;
		}
	}
</script>

<div class="container mx-auto px-4 py-8">
	<div class="bg-slate-700 rounded-lg shadow-lg p-6">
		<h1 class="text-2xl font-bold text-white mb-6">Edit Event</h1>

		{#if loading}
			<div class="flex justify-center items-center h-48">
				<div class="text-white">Loading event data...</div>
			</div>
		{:else if error}
			<div class="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6" role="alert">
				<p>{error}</p>
				<button
					on:click={() => goto('/events')}
					class="mt-4 bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded"
				>
					Return to Events
				</button>
			</div>
		{:else}
			<form on:submit|preventDefault={handleSubmit} class="space-y-6">
				<div>
					<label for="title" class="block text-white font-medium mb-2">Title*</label>
					<input
						type="text"
						id="title"
						bind:value={title}
						required
						class="w-full px-3 py-2 bg-slate-800 text-white border border-slate-600 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
					/>
				</div>

				<div>
					<label for="timelinePeriod" class="block text-white font-medium mb-2"
						>Timeline Period</label
					>
					<select
						id="timelinePeriod"
						bind:value={timelinePeriod}
						class="w-full px-3 py-2 bg-slate-800 text-white border border-slate-600 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
					>
						<option value="">-- Select Period --</option>
						{#each timelinePeriods as period}
							<option value={period}>{period}</option>
						{/each}
					</select>
				</div>

				<div class="grid grid-cols-2 gap-4">
					<div>
						<label for="startYear" class="block text-white font-medium mb-2">Start Year</label>
						<input
							type="number"
							id="startYear"
							bind:value={startYear}
							placeholder="e.g., 1242"
							class="w-full px-3 py-2 bg-slate-800 text-white border border-slate-600 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
						/>
					</div>
					<div>
						<label for="endYear" class="block text-white font-medium mb-2"
							>End Year (Optional)</label
						>
						<input
							type="number"
							id="endYear"
							bind:value={endYear}
							placeholder="e.g., 1245"
							class="w-full px-3 py-2 bg-slate-800 text-white border border-slate-600 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
						/>
					</div>
				</div>

				<div>
					<label for="nation" class="block text-white font-medium mb-2">Nation</label>
					<select
						id="nation"
						bind:value={nationId}
						class="w-full px-3 py-2 bg-slate-800 text-white border border-slate-600 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
					>
						<option value={null}>-- None --</option>
						{#each nations as nation}
							<option value={nation.NationID} selected={nationId === nation.NationID}>
								{nation.Name}
							</option>
						{/each}
					</select>
				</div>

				<div>
					<label for="location" class="block text-white font-medium mb-2">Location</label>
					<select
						id="location"
						bind:value={locationId}
						class="w-full px-3 py-2 bg-slate-800 text-white border border-slate-600 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
					>
						<option value={null}>-- None --</option>
						{#each locations as location}
							<option value={location.LocationID} selected={locationId === location.LocationID}>
								{location.Name}
							</option>
						{/each}
					</select>
				</div>

				<div>
					<label for="description" class="block text-white font-medium mb-2">Description</label>
					<textarea
						id="description"
						bind:value={description}
						rows="6"
						class="w-full px-3 py-2 bg-slate-800 text-white border border-slate-600 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
					></textarea>
				</div>

				<div class="flex justify-between pt-4">
					<div class="flex gap-2">
						<button
							type="button"
							on:click={() => goto('/events')}
							class="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded transition-colors"
						>
							Cancel
						</button>
						<button
							type="button"
							on:click={() => goto(`/events/${id}`)}
							class="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded transition-colors"
						>
							Back to Event
						</button>
					</div>
					<button
						type="submit"
						disabled={submitLoading}
						class="px-4 py-2 bg-sky-600 hover:bg-sky-700 disabled:bg-blue-400 text-white rounded transition-colors flex items-center"
					>
						{#if submitLoading}
							<span class="mr-2">Saving...</span>
						{:else}
							Save Changes
						{/if}
					</button>
				</div>
			</form>
		{/if}
	</div>
</div>
