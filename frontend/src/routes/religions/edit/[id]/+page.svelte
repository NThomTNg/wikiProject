<script lang="ts">
	import { goto } from '$app/navigation';
	import type { Religion } from '$lib/types';

	export let data: { religion: Religion };

	let religion = { ...data.religion };
	let loading = false;
	let error = '';
	let successMessage = '';

	async function handleSubmit() {
		loading = true;
		error = '';
		successMessage = '';

		try {
			const response = await fetch(`http://localhost:5000/api/religions/${religion.ReligionID}`, {
				method: 'PUT',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify(religion),
				credentials: 'include'
			});

			if (!response.ok) {
				const errorData = await response.json();
				throw new Error(errorData.error || 'Failed to update religion');
			}

			successMessage = 'Religion updated successfully!';
			setTimeout(() => {
				goto(`/religions/${religion.ReligionID}`);
			}, 1500);
		} catch (err) {
			error = err instanceof Error ? err.message : 'An unknown error occurred';
		} finally {
			loading = false;
		}
	}

	function handleCancel() {
		goto(`/religions/${religion.ReligionID}`);
	}
</script>

<div class="mx-auto max-w-3xl p-4">
	<div class="mb-6 flex justify-between items-center">
		<h1 class="text-2xl font-bold text-white">Edit Religion: {religion.Name}</h1>
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
					bind:value={religion.Name}
					class="w-full p-2 border rounded focus:outline-none focus:ring focus:border-blue-300 bg-gray-700 text-white"
					required
				/>
			</div>

			<!-- Founding Date Field -->
			<div>
				<label for="foundingDate" class="block text-white font-medium mb-1">Founding Date</label>
				<input
					type="date"
					id="foundingDate"
					bind:value={religion.FoundingDate}
					class="w-full p-2 border rounded focus:outline-none focus:ring focus:border-blue-300 bg-gray-700 text-white"
				/>
			</div>

			<!-- Deities Field -->
			<div class="md:col-span-2">
				<label for="deities" class="block text-white font-medium mb-1">Deities</label>
				<input
					type="text"
					id="deities"
					bind:value={religion.Deities}
					class="w-full p-2 border rounded focus:outline-none focus:ring focus:border-blue-300 bg-gray-700 text-white"
				/>
			</div>

			<!-- Holy Text Field -->
			<div class="md:col-span-2">
				<label for="holyText" class="block text-white font-medium mb-1">Holy Text</label>
				<input
					type="text"
					id="holyText"
					bind:value={religion.HolyText}
					class="w-full p-2 border rounded focus:outline-none focus:ring focus:border-blue-300 bg-gray-700 text-white"
				/>
			</div>

			<!-- Hierarchy Field -->
			<div class="md:col-span-2">
				<label for="hierarchy" class="block text-white font-medium mb-1">Hierarchy</label>
				<input
					type="text"
					id="hierarchy"
					bind:value={religion.Hierarchy}
					class="w-full p-2 border rounded focus:outline-none focus:ring focus:border-blue-300 bg-gray-700 text-white"
				/>
			</div>

			<!-- Image URL Field -->
			<div class="md:col-span-2">
				<label for="imageUrl" class="block text-white font-medium mb-1">Image URL</label>
				<input
					type="text"
					id="imageUrl"
					bind:value={religion.ImageURL}
					class="w-full p-2 border rounded focus:outline-none focus:ring focus:border-blue-300 bg-gray-700 text-white"
				/>
			</div>
		</div>

		<!-- Description Field -->
		<div class="mb-6">
			<label for="description" class="block text-white font-medium mb-1">Description</label>
			<textarea
				id="description"
				bind:value={religion.Description}
				rows="6"
				class="w-full p-2 border rounded focus:outline-none focus:ring focus:border-blue-300 bg-gray-700 text-white"
			></textarea>
		</div>

		<!-- Practices Field -->
		<div class="mb-6">
			<label for="practices" class="block text-white font-medium mb-1">Practices</label>
			<textarea
				id="practices"
				bind:value={religion.Practices}
				rows="6"
				class="w-full p-2 border rounded focus:outline-none focus:ring focus:border-blue-300 bg-gray-700 text-white"
			></textarea>
		</div>

		<!-- Image Preview -->
		{#if religion.ImageURL}
			<div class="mb-6">
				<label class="block text-white font-medium mb-1">Image Preview</label>
				<img
					src={religion.ImageURL}
					alt="Religion image preview"
					class="max-h-40 rounded border border-gray-300"
				/>
			</div>
		{/if}

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
