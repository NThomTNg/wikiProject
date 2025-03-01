<script lang="ts">
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import type { EventWithRelations } from '$lib/types';
	import EventTimeline from '$lib/components/EventTimeline.svelte';

	let events: EventWithRelations[] = [];
	let loading = true;
	let error: string | null = null;
	let viewMode: 'timeline' | 'grid' = 'timeline';

	onMount(async () => {
		await fetchEvents();
	});

	async function fetchEvents() {
		try {
			const response = await fetch('http://localhost:5000/api/events');
			if (!response.ok) {
				throw new Error('Failed to fetch events');
			}
			const data = await response.json();
			events = data.data || data || [];
			events.sort((a, b) => {
				if (!a.EventDate) return 1;
				if (!b.EventDate) return -1;
				return a.EventDate.localeCompare(b.EventDate);
			});
		} catch (err) {
			console.error('Error fetching events:', err);
			error = err instanceof Error ? err.message : 'An error occurred';
		} finally {
			loading = false;
		}
	}

	function viewEvent(event: EventWithRelations) {
		if (!event) {
			console.error('Invalid event object:', event);
			alert('Cannot view this event: Invalid event data');
			return;
		}

		if (!event.EventID) {
			console.error('Event missing ID:', event);
			alert('Cannot view this event: Missing event ID');
			return;
		}

		const eventId = Number(event.EventID);
		if (isNaN(eventId)) {
			console.error('Invalid event ID:', event.EventID);
			alert(`Invalid event ID: ${event.EventID}`);
			return;
		}

		console.log(`Navigating to event ${eventId}:`, event);
		goto(`/events/${eventId}`);
	}

	function toggleView() {
		viewMode = viewMode === 'timeline' ? 'grid' : 'timeline';
	}
</script>

<div class="container mx-auto px-4 py-6">
	<div class="flex justify-between items-center mb-6">
		<h1 class="text-3xl font-bold text-white">Historical Events</h1>
		<div class="flex gap-4">
			<button
				on:click={toggleView}
				class="bg-slate-700 hover:bg-slate-600 text-white font-bold py-2 mt-5 px-4 rounded"
			>
				{viewMode === 'timeline' ? 'Grid View' : 'Timeline View'}
			</button>
			<button
				on:click={() => goto('/events/new')}
				class="bg-sky-700 hover:bg-sky-600 text-white font-bold py-2 mt-5 px-4 rounded"
			>
				Add New Event
			</button>
		</div>
	</div>

	{#if loading}
		<div class="flex justify-center items-center h-48">
			<div class="text-white">Loading events...</div>
		</div>
	{:else if error}
		<div class="bg-red-100 border-l-4 border-red-500 text-red-700 p-4" role="alert">
			<p class="font-bold">Error</p>
			<p>{error}</p>
		</div>
	{:else if events.length === 0}
		<div class="text-center py-8">
			<p class="text-gray-400">No events found</p>
			<button
				on:click={() => goto('/events/new')}
				class="bg-sky-700 hover:bg-sky-600 text-white font-bold py-2 mt-5 px-4 rounded"
			>
				Create First Event
			</button>
		</div>
	{:else if viewMode === 'timeline'}
		<div class="hidden sm:block">
			<EventTimeline {events} onEventClick={viewEvent} />
		</div>
	{:else}
		<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
			{#each events as event}
				<div
					class="bg-slate-800 bg-opacity-40 border border-black rounded-lg p-4 cursor-pointer transition-all duration-300 transform hover:-translate-y-1"
					on:keypress={(e) => {
						if (e.key === 'Enter' || e.key === ' ') viewEvent(event);
					}}
					tabindex="0"
					role="button"
					aria-label={`View details for event ${event.Title}`}
				>
					<div class="p-6">
						<h2 class="text-xl font-semibold text-white mb-2">{event.Title}</h2>
						{#if event.EventDate}
							<p class="text-gray-400 mb-2">{event.EventDate}</p>
						{/if}
						{#if event.Description}
							<p class="text-gray-300 line-clamp-3">
								{event.Description}
							</p>
						{:else}
							<p class="text-gray-500 italic">No description</p>
						{/if}
					</div>
					<div class="px-6 py-3 flex justify-between items-center">
						<div>
							{#if event.NationName}
								<span class="text-sm text-blue-400">{event.NationName}</span>
							{/if}
							{#if event.NationName && event.LocationName}
								<span class="text-gray-500 mx-1">•</span>
							{/if}
							{#if event.LocationName}
								<span class="text-sm text-blue-400">{event.LocationName}</span>
							{/if}
						</div>
					</div>
				</div>
			{/each}
		</div>
	{/if}
</div>
