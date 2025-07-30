<script lang="ts">
	import { onMount } from 'svelte';
	import { page } from '$app/stores';
	import { goto } from '$app/navigation';
	import type { EventWithRelations } from '$lib/types';
	import type { PageData } from './$types';
	import { API_BASE_URL } from '$lib/config/api';

	export let data: PageData;

	const id = $page.params.id;
	let event: EventWithRelations | null = data.event;
	let loading = false;
	let error: string | null = null;

	onMount(() => {
		console.log('Component mounted - Event data:', event);
		if (event) {
			console.log('Component - TimelinePeriod:', event.TimelinePeriod);
			console.log('Component - StartYear:', event.StartYear);
			console.log('Component - EndYear:', event.EndYear);
		}
	});

	function formatDate(dateString: string | null | undefined): string {
		if (!dateString) return 'Unknown date';

		if (/^\d{1,4}$/.test(dateString)) {
			return `Year ${dateString}`;
		}

		try {
			const date = new Date(dateString);
			if (isNaN(date.getTime())) return dateString;

			return date.toLocaleDateString('en-US', {
				year: 'numeric',
				month: 'long',
				day: 'numeric'
			});
		} catch (e) {
			return dateString;
		}
	}

	async function handleDelete() {
		if (!confirm('Are you sure you want to delete this event?')) {
			return;
		}

		try {
			const response = await fetch(`${API_BASE_URL}/api/events/${id}`, {
				method: 'DELETE'
			});

			if (!response.ok) {
				throw new Error(`Failed to delete event: ${response.statusText}`);
			}

			goto('/events');
		} catch (e) {
			console.error('Error deleting event:', e);
			error = e instanceof Error ? e.message : String(e);
		}
	}

	function handleEdit() {
		goto(`/events/edit/${id}`);
	}
</script>

<div class="container mx-auto px-4 py-8">
	<div class="mb-6">
		<button
			on:click={() => goto('/events')}
			class="text-white bg-sky-700 p-2 rounded hover:bg-sky-600 hover:shadow-lg"
		>
			← Back to events
		</button>
	</div>

	{#if loading}
		<div class="flex justify-center items-center h-48">
			<div class="text-white text-lg">Loading event details...</div>
		</div>
	{:else if error}
		<div class="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6" role="alert">
			<p class="font-bold">Error</p>
			<p>{error}</p>
			<button
				on:click={() => goto('/events')}
				class="mt-4 bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded"
			>
				Return to Events
			</button>
		</div>
	{:else if event}
		<div class="bg-slate-700 rounded-lg shadow-lg overflow-hidden">
			<div class="p-6">
				<div class="flex justify-between items-start mb-6">
					<h1 class="text-3xl font-bold text-white">{event.Title}</h1>
					<div class="flex gap-2">
						<button
							on:click={handleEdit}
							class="bg-sky-600 hover:bg-sky-700 text-white py-1 px-3 rounded shadow transition-colors"
						>
							Edit
						</button>
						<button
							on:click={handleDelete}
							class="bg-red-600 hover:bg-red-700 text-white py-1 px-3 rounded shadow transition-colors"
						>
							Delete
						</button>
					</div>
				</div>

				<div class="mb-6 text-lg text-blue-300 font-semibold">
					{#if event.TimelinePeriod}
						{event.TimelinePeriod}
					{:else if event.StartYear}
						Year {event.StartYear}{event.EndYear ? ` - ${event.EndYear}` : ''}
					{:else if event.EventDate}
						{formatDate(event.EventDate)}
					{:else}
						Unknown period
					{/if}
				</div>

				{#if event.NationName || event.LocationName}
					<div class="flex flex-wrap gap-2 mb-6">
						{#if event.NationName}
							<span class="px-3 py-1 bg-sky-800 text-white rounded">
								Nation: {event.NationName}
							</span>
						{/if}
						{#if event.LocationName}
							<span class="px-3 py-1 bg-green-800 text-white rounded">
								Location: {event.LocationName}
							</span>
						{/if}
					</div>
				{/if}

				<div class="prose prose-lg prose-invert max-w-none text-gray-200">
					{#if event.Description}
						<p>{event.Description}</p>
					{:else}
						<p class="italic">No description available.</p>
					{/if}
				</div>

				<div class="mt-10 pt-6 border-t border-gray-600 text-gray-400 text-sm">
					{#if event.CreatedDate}
						<p>Created: {new Date(event.CreatedDate).toLocaleDateString()}</p>
					{/if}
					{#if event.LastModifiedDate}
						<p>Last Modified: {new Date(event.LastModifiedDate).toLocaleDateString()}</p>
					{/if}
				</div>
			</div>
		</div>
	{:else}
		<div class="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 mb-6" role="alert">
			<p class="font-bold">No event data</p>
			<p>No event data was found for ID: {id}</p>
		</div>
	{/if}
</div>
