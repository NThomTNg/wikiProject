<script lang="ts">
	import { goto } from '$app/navigation';
	import type { Nation } from '$lib/types';

	export let data: { nation: Nation };

	let nation = { ...data.nation };
	let loading = false;
	let error = '';
	let successMessage = '';

	async function handleSubmit() {
		loading = true;
		error = '';
		successMessage = '';

		try {
			const response = await fetch(`http://localhost:5000/api/nations/${nation.NationID}`, {
				method: 'PUT',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify(nation),
				credentials: 'include'
			});

			if (!response.ok) {
				const errorData = await response.json();
				throw new Error(errorData.error || 'Failed to update nation');
			}

			successMessage = 'Nation updated successfully!';
			setTimeout(() => {
				goto(`/nations/${nation.NationID}`);
			}, 1500);
		} catch (err) {
			error = err instanceof Error ? err.message : 'An unknown error occurred';
		} finally {
			loading = false;
		}
	}

	function handleCancel() {
		goto(`/nations/${nation.NationID}`);
	}
</script>

<div class="mx-auto max-w-3xl p-4">
	<div class="mb-6 flex justify-between items-center">
		<h1 class="text-2xl font-bold text-white">Edit Nation: {nation.Name}</h1>
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
					bind:value={nation.Name}
					class="w-full p-2 border rounded focus:outline-none focus:ring focus:border-blue-300 bg-gray-700 text-white"
					required
				/>
			</div>

			<!-- Government Field -->
			<div>
				<label for="government" class="block text-white font-medium mb-1">Government</label>
				<input
					type="text"
					id="government"
					bind:value={nation.Government}
					class="w-full p-2 border rounded focus:outline-none focus:ring focus:border-blue-300 bg-gray-700 text-white"
				/>
			</div>

			<!-- CapitalLocationID Field -->
			<div>
				<label for="capitalLocationID" class="block text-white font-medium mb-1"
					>Capital Location ID</label
				>
				<input
					type="number"
					id="capitalLocationID"
					bind:value={nation.CapitalLocationID}
					class="w-full p-2 border rounded focus:outline-none focus:ring focus:border-blue-300 bg-gray-700 text-white"
				/>
			</div>

			<!-- FoundingDate Field -->
			<div>
				<label for="foundingDate" class="block text-white font-medium mb-1">Founding Date</label>
				<input
					type="date"
					id="foundingDate"
					bind:value={nation.FoundingDate}
					class="w-full p-2 border rounded focus:outline-none focus:ring focus:border-blue-300 bg-gray-700 text-white"
				/>
			</div>

			<!-- MajorReligionID Field -->
			<div>
				<label for="majorReligionID" class="block text-white font-medium mb-1"
					>Major Religion ID</label
				>
				<input
					type="number"
					id="majorReligionID"
					bind:value={nation.MajorReligionID}
					class="w-full p-2 border rounded focus:outline-none focus:ring focus:border-blue-300 bg-gray-700 text-white"
				/>
			</div>

			<!-- Culture Field -->
			<div>
				<label for="culture" class="block text-white font-medium mb-1">Culture</label>
				<input
					type="text"
					id="culture"
					bind:value={nation.Culture}
					class="w-full p-2 border rounded focus:outline-none focus:ring focus:border-blue-300 bg-gray-700 text-white"
				/>
			</div>

			<!-- Economy Field -->
			<div>
				<label for="economy" class="block text-white font-medium mb-1">Economy</label>
				<input
					type="text"
					id="economy"
					bind:value={nation.Economy}
					class="w-full p-2 border rounded focus:outline-none focus:ring focus:border-blue-300 bg-gray-700 text-white"
				/>
			</div>

			<!-- MilitaryStrength Field -->
			<div>
				<label for="militaryStrength" class="block text-white font-medium mb-1"
					>Military Strength</label
				>
				<input
					type="text"
					id="militaryStrength"
					bind:value={nation.MilitaryStrength}
					class="w-full p-2 border rounded focus:outline-none focus:ring focus:border-blue-300 bg-gray-700 text-white"
				/>
			</div>

			<!-- Image URL Field -->
			<div class="md:col-span-2">
				<label for="imageUrl" class="block text-white font-medium mb-1">Image URL</label>
				<input
					type="text"
					id="imageUrl"
					bind:value={nation.ImageURL}
					class="w-full p-2 border rounded focus:outline-none focus:ring focus:border-blue-300 bg-gray-700 text-white"
				/>
			</div>
		</div>

		<!-- Description Field -->
		<div class="mb-6">
			<label for="description" class="block text-white font-medium mb-1">Description</label>
			<textarea
				id="description"
				bind:value={nation.Description}
				rows="6"
				class="w-full p-2 border rounded focus:outline-none focus:ring focus:border-blue-300 bg-gray-700 text-white"
			></textarea>
		</div>

		<!-- Image Preview -->
		{#if nation.ImageURL}
			<div class="mb-6">
				<label class="block text-white font-medium mb-1">Image Preview</label>
				<img
					src={nation.ImageURL}
					alt="Nation image preview"
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
