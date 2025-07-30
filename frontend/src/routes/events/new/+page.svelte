<script lang="ts">
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import type { Nation, Location, Event } from '$lib/types';
	import { API_BASE_URL } from '$lib/config/api';

	let events: Event[] = [];
	let locations: Location[] = [];
	let nations: Nation[] = [];
	let loading = true;
	let error: string | null = null;
	let isSubmitting = false;

	let title = '';
	let description = '';
	let timelinePeriod = '';
	let startYear = '';
	let endYear = '';
	let locationId: number | null = null;
	let nationId: number | null = null;

	const timelinePeriods = [
		'Birth Age',
		'Argoneasian Age',
		'Migration Era',
		'Fourth Era',
		'Breaking Age',
		'Fifth Era'
	];

	onMount(async () => {
		await fetchFormData();
	});

	const fetchFormData = async () => {
		try {
			const [locationsRes, nationsRes, eventsRes] = await Promise.all([
				fetch(`${API_BASE_URL}/api/locations`),
				fetch(`${API_BASE_URL}/api/nations`),
				fetch(`${API_BASE_URL}/api/events`)
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
			const eventData = {
				Title: title,
				Description: description || null,
				TimelinePeriod: timelinePeriod || null,
				StartYear: startYear ? Number(startYear) : null,
				EndYear: endYear ? Number(endYear) : null,
				LocationID: locationId !== null && locationId !== undefined ? Number(locationId) : null,
				NationID: nationId !== null && nationId !== undefined ? Number(nationId) : null
			};

			console.log('Sending event data:', eventData);

			const response = await fetch(`${API_BASE_URL}/api/events`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify(eventData)
			});

			console.log('Response status:', response.status);

			let responseText;
			let responseJson;

			try {
				responseText = await response.text();
				console.log('Raw response:', responseText);

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
			let eventId;

			if (responseJson) {
				eventId =
					responseJson.data?.EventID ||
					responseJson.EventID ||
					responseJson.eventId ||
					responseJson.id;
			}

			if (eventId && !isNaN(Number(eventId))) {
				alert(`Event added successfully with ID: ${eventId}`);
				goto(`/events`);
			} else {
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
			<label for="timelinePeriod" class="block text-white font-medium mb-2">Timeline Period</label>
			<select
				id="timelinePeriod"
				bind:value={timelinePeriod}
				class="input w-full p-2 border rounded bg-slate-800 text-white border-slate-600"
			>
				<option value="">-- Select Period --</option>
				{#each timelinePeriods as period}
					<option value={period}>{period}</option>
				{/each}
			</select>
		</div>

		<div class="grid grid-cols-2 gap-4 mb-4">
			<div>
				<label for="startYear" class="block text-white font-medium mb-2">Start Year</label>
				<input
					id="startYear"
					type="number"
					bind:value={startYear}
					placeholder="e.g., 1242"
					class="input w-full p-2 border rounded bg-slate-800 text-white border-slate-600"
				/>
			</div>
			<div>
				<label for="endYear" class="block text-white font-medium mb-2">End Year (Optional)</label>
				<input
					id="endYear"
					type="number"
					bind:value={endYear}
					placeholder="e.g., 1245"
					class="input w-full p-2 border rounded bg-slate-800 text-white border-slate-600"
				/>
			</div>
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
