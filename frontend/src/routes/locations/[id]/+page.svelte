<script lang="ts">
	import type { Location } from '$lib/types';
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import { API_BASE_URL } from '$lib/config/api';

	export let data: { location?: Location; error?: string };
	const id = $page.params.id;

	function formatDate(date?: string | Date): string {
		if (!date) return 'Unknown';
		const dateObj = date instanceof Date ? date : new Date(date);
		return dateObj.toLocaleDateString('en-US', {
			year: 'numeric',
			month: 'long',
			day: 'numeric'
		});
	}

	function handleEdit() {
		goto(`/locations/edit/${id}`);
	}

	async function deleteLocation() {
		if (confirm('Are you sure you want to delete this location?')) {
			try {
				if (!data.location) {
					throw new Error('Location data is missing');
				}
				const response = await fetch(`${API_BASE_URL}/api/locations/${data.location.LocationID}`, {
					method: 'DELETE',
					headers: {
						'Content-Type': 'application/json'
					},
					credentials: 'include'
				});

				if (!response.ok) {
					const errorData = await response.json();
					throw new Error(errorData.error || 'Failed to delete location');
				}

				alert('Location deleted successfully.');
				window.location.href = '/locations';
			} catch (error) {
				alert(error instanceof Error ? error.message : 'Failed to delete location');
			}
		}
	}
</script>

{#if data.error}
	<div class="text-center">
		<p class="text-red-600">{data.error}</p>
	</div>
{:else if data.location}
	<div class="mx-auto p-4">
		<div class="mb-6">
			<button
				on:click={() => goto('/locations')}
				class="text-white bg-sky-700 p-2 rounded hover:bg-sky-600 hover:shadow-lg"
			>
				← Back to locations
			</button>
			<button
				on:click={handleEdit}
				class="text-white bg-sky-700 p-2 rounded hover:bg-sky-600 hover:shadow-lg ml-2"
			>
				Edit locations
			</button>
		</div>

		<div class="grid md:grid-cols-2 gap-8">
			<div class="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-lg">
				<h1 class="text-3xl text-white font-bold mb-2">{data.location.Name}</h1>

				<div class="space-y-4">
					<div class="border-b pb-4">
						<h3 class="text-lg text-white font-semibold mb-2">Type</h3>
						<p class="text-gray-700 dark:text-gray-300">{data.location.LocationType}</p>
					</div>

					{#if data.location.Description}
						<div class="border-b pb-4">
							<h3 class="text-lg text-white font-semibold mb-2">Description</h3>
							<p class="text-gray-700 dark:text-gray-300 whitespace-pre-line">
								{data.location.Description}
							</p>
						</div>
					{/if}

					<div class="grid grid-cols-2 gap-4">
						{#if data.location.Climate}
							<div>
								<h3 class="text-lg text-white font-semibold mb-2">Climate</h3>
								<p class="text-gray-700 dark:text-gray-300">{data.location.Climate}</p>
							</div>
						{/if}
						{#if data.location.Population}
							<div>
								<h3 class="text-lg text-white font-semibold mb-2">Population</h3>
								<p class="text-gray-700 dark:text-gray-300">
									{data.location.Population.toLocaleString()}
								</p>
							</div>
						{/if}
					</div>

					{#if data.location.CoordinateX !== null && data.location.CoordinateY !== null}
						<div class="border-b pb-4">
							<h3 class="text-lg text-white font-semibold mb-2">Coordinates</h3>
							<p class="text-gray-700 dark:text-gray-300">
								X: {data.location.CoordinateX}, Y: {data.location.CoordinateY}
							</p>
						</div>
					{/if}
				</div>

				<button
					on:click={deleteLocation}
					class="mt-4 bg-red-700 text-white px-4 py-2 rounded hover:bg-red-600"
				>
					Delete Location
				</button>
			</div>

			<div class="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-lg">
				<h2 class="text-2xl text-white font-bold mb-4">Additional Information</h2>
				<div class="space-y-4">
					{#if data.location.NationID}
						<div class="border-b pb-4">
							<h3 class="text-lg text-white font-semibold mb-2">Nation</h3>
							<p class="text-gray-700 dark:text-gray-300">{data.location.NationID}</p>
						</div>
					{/if}
					<div class="border-b pb-4">
						<h3 class="text-lg text-white font-semibold mb-2">Created</h3>
						<p class="text-gray-700 dark:text-gray-300">
							{formatDate(data.location.CreatedDate)}
						</p>
					</div>
					<div class="border-b pb-4">
						<h3 class="text-lg text-white font-semibold mb-2">Last Modified</h3>
						<p class="text-gray-700 dark:text-gray-300">
							{formatDate(data.location.LastModifiedDate)}
						</p>
					</div>
				</div>
			</div>
		</div>
	</div>
{:else}
	<div class="text-center p-8">
		<div class="animate-pulse">
			<p>Loading location data...</p>
		</div>
	</div>
{/if}
