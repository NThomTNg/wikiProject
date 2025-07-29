<script lang="ts">
	import { goto } from '$app/navigation';
	import { onMount } from 'svelte';
	import type { Location, Nation } from '$lib/types';

	export let data: { location: Location };

	let location = { ...data.location };
	let loading = false;
	let error = '';
	let successMessage = '';
	let nations: Nation[] = [];

	onMount(async () => {
		try {
			const response = await fetch('http://localhost:5000/api/nations', { credentials: 'include' });
			if (response.ok) {
				const result = await response.json();
				nations = result.data || [];
			}
		} catch (err) {
			console.error('Failed to fetch nations:', err);
		}
	});

	async function handleSubmit() {
		loading = true;
		error = '';
		successMessage = '';

		try {
			const response = await fetch(`http://localhost:5000/api/locations/${location.LocationID}`, {
				method: 'PUT',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify(location),
				credentials: 'include'
			});

			if (!response.ok) {
				const errorData = await response.json();
				throw new Error(errorData.error || 'Failed to update location');
			}

			successMessage = 'Location updated successfully!';
			setTimeout(() => {
				goto(`/locations/${location.LocationID}`);
			}, 1500);
		} catch (err) {
			error = err instanceof Error ? err.message : 'An unknown error occurred';
		} finally {
			loading = false;
		}
	}

	function handleCancel() {
		goto(`/locations/${location.LocationID}`);
	}
</script>

<div class="mx-auto max-w-3xl p-4">
	<div class="mb-6 flex justify-between items-center">
		<h1 class="text-2xl font-bold text-white">Edit Location: {location.Name}</h1>
		<button on:click={handleCancel} class="text-white bg-gray-600 p-2 rounded hover:bg-gray-500">
			Cancel
		</button>
	</div>

	{#if error}
		<div class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
			<strong>Error:</strong>
			{error}
		</div>
	{/if}

	{#if successMessage}
		<div class="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
			{successMessage}
		</div>
	{/if}

	<form on:submit|preventDefault={handleSubmit} class="bg-gray-800 p-6 rounded-lg shadow-lg">
		<div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
			<!-- Name Field -->
			<div>
				<label for="name" class="block text-white font-medium mb-1">Name *</label>
				<input
					type="text"
					id="name"
					bind:value={location.Name}
					class="w-full p-2 border rounded focus:outline-none focus:ring focus:border-blue-300 bg-gray-700 text-white"
					required
				/>
			</div>

			<!-- Location Type Field -->
			<div>
				<label for="locationType" class="block text-white font-medium mb-1">Location Type</label>
				<input
					type="text"
					id="locationType"
					bind:value={location.LocationType}
					class="w-full p-2 border rounded focus:outline-none focus:ring focus:border-blue-300 bg-gray-700 text-white"
				/>
			</div>

			<!-- Nation Field -->
			<div>
				<label for="nation" class="block text-white font-medium mb-1">Nation</label>
				<select
					id="nation"
					bind:value={location.NationID}
					class="w-full p-2 border rounded focus:outline-none focus:ring focus:border-blue-300 bg-gray-700 text-white"
				>
					<option value={null}>Select Nation</option>
					{#each nations as nation}
						<option value={nation.NationID}>{nation.Name}</option>
					{/each}
				</select>
			</div>

			<!-- Coordinate X Field -->
			<div>
				<label for="coordinateX" class="block text-white font-medium mb-1">Coordinate X</label>
				<input
					type="number"
					id="coordinateX"
					bind:value={location.CoordinateX}
					class="w-full p-2 border rounded focus:outline-none focus:ring focus:border-blue-300 bg-gray-700 text-white"
				/>
			</div>

			<!-- Coordinate Y Field -->
			<div>
				<label for="coordinateY" class="block text-white font-medium mb-1">Coordinate Y</label>
				<input
					type="number"
					id="coordinateY"
					bind:value={location.CoordinateY}
					class="w-full p-2 border rounded focus:outline-none focus:ring focus:border-blue-300 bg-gray-700 text-white"
				/>
			</div>

			<!-- Climate Field -->
			<div>
				<label for="climate" class="block text-white font-medium mb-1">Climate</label>
				<input
					type="text"
					id="climate"
					bind:value={location.Climate}
					class="w-full p-2 border rounded focus:outline-none focus:ring focus:border-blue-300 bg-gray-700 text-white"
				/>
			</div>

			<!-- Population Field -->
			<div>
				<label for="population" class="block text-white font-medium mb-1">Population</label>
				<input
					type="number"
					id="population"
					bind:value={location.Population}
					class="w-full p-2 border rounded focus:outline-none focus:ring focus:border-blue-300 bg-gray-700 text-white"
				/>
			</div>
		</div>

		<!-- Description Field -->
		<div class="mb-6">
			<label for="description" class="block text-white font-medium mb-1">Description</label>
			<textarea
				id="description"
				bind:value={location.Description}
				rows="6"
				class="w-full p-2 border rounded focus:outline-none focus:ring focus:border-blue-300 bg-gray-700 text-white"
			></textarea>
		</div>

		<div class="flex justify-end">
			<button
				type="submit"
				class="bg-sky-700 text-white px-6 py-2 rounded hover:bg-sky-600 disabled:opacity-50"
				disabled={loading}
			>
				{loading ? 'Saving...' : 'Save Changes'}
			</button>
		</div>
	</form>
</div>
