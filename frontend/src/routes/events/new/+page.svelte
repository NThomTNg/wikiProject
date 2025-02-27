<script lang="ts">
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import type { Nation, Location, Event } from '$lib/types';

	// Component state
	let events: Event[] = [];
	let locations: Location[] = [];
	let nations: Nation[] = [];
	let loading = true;
	let error: string | null = null;
	let isSubmitting = false;

	// Form state
	let title = '';
	let description = '';
	let eventDate = '';
	let locationId: number | null = null;
	let nationId: number | null = null;

	onMount(async () => {
		await fetchFormData();
	});

	const fetchFormData = async () => {
		try {
			// Load locations, nations, and events for reference
			const [locationsRes, nationsRes, eventsRes] = await Promise.all([
				fetch('http://localhost:5000/api/locations'),
				fetch('http://localhost:5000/api/nations'),
				fetch('http://localhost:5000/api/events')
			]);

			if (!locationsRes.ok || !nationsRes.ok || !eventsRes.ok) {
				throw new Error('Failed to load form data');
			}

			const locationsData = await locationsRes.json();
			const nationsData = await nationsRes.json();
			const eventsData = await eventsRes.json();

			locations = locationsData.data || [];
			nations = nationsData.data || [];
			events = eventsData.data || [];
		} catch (e) {
			console.error('Error loading form data:', e);
			error = e instanceof Error ? e.message : 'An error occurred';
		} finally {
			loading = false;
		}
	};

	const addEvent = async () => {
		if (!title) {
			error = 'Title is required';
			return;
		}

		isSubmitting = true;
		error = null;

		try {
			// Ensure we're sending null for empty values instead of undefined
			const eventData = {
				Title: title,
				Description: description || null,
				EventDate: eventDate || null,
				// Explicitly handle potentially undefined or null values
				LocationID: locationId !== null && locationId !== undefined ? Number(locationId) : null,
				NationID: nationId !== null && nationId !== undefined ? Number(nationId) : null
			};

			console.log('Sending event data:', eventData);

			const response = await fetch('http://localhost:5000/api/events', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify(eventData)
			});

			console.log('Response status:', response.status);

			// Try to get detailed response information
			let responseText;
			let responseJson;

			try {
				// First try to get text response for logging
				responseText = await response.text();
				console.log('Raw response:', responseText);

				// Then parse it as JSON if possible
				if (responseText) {
					responseJson = JSON.parse(responseText);
					console.log('Parsed response:', responseJson);
				}
			} catch (parseError) {
				console.error('Error parsing response:', parseError);
			}

			if (!response.ok) {
				throw new Error(`Failed to create event: ${response.status} ${response.statusText}`);
			}

			// Success! Extract event ID safely
			let eventId;

			if (responseJson) {
				// Try different possible response formats
				eventId =
					responseJson.data?.EventID || // Format: { data: { EventID: 123 } }
					responseJson.EventID || // Format: { EventID: 123 }
					responseJson.eventId || // Format: { eventId: 123 }
					responseJson.id; // Format: { id: 123 }
			}

			// If we have a valid numeric event ID, navigate to that event's page
			if (eventId && !isNaN(Number(eventId))) {
				alert(`Event added successfully with ID: ${eventId}`);
				goto(`/events`); // Just go to events list to be safe
			} else {
				// If we can't determine the ID, just go to the events list
				alert('Event created successfully');
				goto('/events');
			}
		} catch (e) {
			console.error('Error submitting form:', e);
			error = e instanceof Error ? e.message : 'An error occurred';
		} finally {
			isSubmitting = false;
		}
	};

	// Simple validation
	function validateForm() {
		return title.length > 0;
	}
</script>

{#if loading}
	<p class="text-center text-gray-500">Loading...</p>
{:else if error}
	<div class="text-center mb-4">
		<p class="text-red-500 p-3 bg-red-100 border border-red-300 rounded">{error}</p>
	</div>
{:else}
	<div class="mb-6">
		<button
			on:click={() => goto('/events')}
			class="text-white bg-sky-700 p-2 rounded hover:bg-sky-600 hover:shadow-lg"
		>
			← Back to events
		</button>
	</div>
	<form
		on:submit|preventDefault={addEvent}
		class="mb-4 space-y-6 max-w-lg mx-auto p-5 border rounded-lg shadow-md bg-slate-700 bg-opacity-80 border-slate-800"
	>
		<div class="mb-4">
			<label for="title" class="block text-white font-medium mb-2">Title*</label>
			<input
				id="title"
				type="text"
				bind:value={title}
				placeholder="Title"
				required
				class="input w-full p-2 border rounded bg-slate-800 text-white border-slate-600"
			/>
		</div>

		<div class="mb-4">
			<label for="eventDate" class="block text-white font-medium mb-2">Event Date</label>
			<input
				id="eventDate"
				type="text"
				bind:value={eventDate}
				placeholder="e.g., 1242, January 1242, or 01/15/1242"
				class="input w-full p-2 border rounded bg-slate-800 text-white border-slate-600"
			/>
			<p class="mt-1 text-sm text-gray-400">
				Format: Year (e.g. 1242), Month and Year, or specific date
			</p>
		</div>

		<div class="mb-4">
			<label for="nation" class="block text-white font-medium mb-2">Nation</label>
			<select
				id="nation"
				bind:value={nationId}
				class="input w-full p-2 border rounded bg-slate-800 text-white border-slate-600"
			>
				<option value={null}>-- None --</option>
				{#each nations as nation}
					<option value={nation.NationID}>{nation.Name}</option>
				{/each}
			</select>
		</div>

		<div class="mb-4">
			<label for="location" class="block text-white font-medium mb-2">Location</label>
			<select
				id="location"
				bind:value={locationId}
				class="input w-full p-2 border rounded bg-slate-800 text-white border-slate-600"
			>
				<option value={null}>-- None --</option>
				{#each locations as location}
					<option value={location.LocationID}>{location.Name}</option>
				{/each}
			</select>
		</div>

		<div class="mb-4">
			<label for="description" class="block text-white font-medium mb-2">Description</label>
			<textarea
				id="description"
				bind:value={description}
				placeholder="Description"
				rows="6"
				class="textarea w-full p-2 border rounded bg-slate-800 text-white border-slate-600"
			></textarea>
		</div>

		<button
			type="submit"
			class="button w-full p-2 bg-sky-700 text-white rounded hover:bg-sky-600 disabled:bg-slate-500"
			disabled={isSubmitting || !validateForm()}
		>
			{isSubmitting ? 'Adding Event...' : 'Add Event'}
		</button>
	</form>
{/if}
