<script lang="ts">
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import type { Nation, Location, Event } from '../../../../../../backend/src/models/types';

	const id = $page.params.id;
	let event: Event | null = null;

	let title = '';
	let description = '';
	let eventDate = '';
	let locationId: number | null = null;
	let nationId: number | null = null;

	let locations: Location[] = [];
	let nations: Nation[] = [];
	let loading = true;
	let submitLoading = false;
	let error: string | null = null;

	onMount(async () => {
		try {
			// Load event data and reference data in parallel
			const [eventRes, locationsRes, nationsRes] = await Promise.all([
				fetch(`http://localhost:5000/api/events/${id}`),
				fetch('http://localhost:5000/api/locations'),
				fetch('http://localhost:5000/api/nations')
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

			// Populate form fields
			if (event) {
				title = event.Title;
				description = event.Description || '';
				eventDate = event.EventDate || '';
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
				EventDate: eventDate,
				LocationID: locationId,
				NationID: nationId
			};

			const response = await fetch(`http://localhost:5000/api/events/${id}`, {
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
					<label for="eventDate" class="block text-white font-medium mb-2">Event Date</label>
					<input
						type="text"
						id="eventDate"
						bind:value={eventDate}
						placeholder="e.g., 1242, January 1242, or 01/15/1242"
						class="w-full px-3 py-2 bg-slate-800 text-white border border-slate-600 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
					/>
					<p class="mt-1 text-sm text-gray-400">
						Format: Year (e.g. 1242), Month and Year, or specific date
					</p>
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
						class="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white rounded transition-colors flex items-center"
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
