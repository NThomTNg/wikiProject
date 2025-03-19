<script lang="ts">
	import { goto } from '$app/navigation';
	import type { Character } from '$lib/types';

	export let data: { character: Character };

	let character = { ...data.character };
	let loading = false;
	let error = '';
	let successMessage = '';

	async function handleSubmit() {
		loading = true;
		error = '';
		successMessage = '';

		try {
			const response = await fetch(
				`http://localhost:5000/api/characters/${character.CharacterID}`,
				{
					method: 'PUT',
					headers: {
						'Content-Type': 'application/json'
					},
					body: JSON.stringify(character),
					credentials: 'include'
				}
			);

			if (!response.ok) {
				const errorData = await response.json();
				throw new Error(errorData.error || 'Failed to update character');
			}

			successMessage = 'Character updated successfully!';
			setTimeout(() => {
				goto(`/characters/${character.CharacterID}`);
			}, 1500);
		} catch (err) {
			error = err instanceof Error ? err.message : 'An unknown error occurred';
		} finally {
			loading = false;
		}
	}

	function handleCancel() {
		goto(`/characters/${character.CharacterID}`);
	}
</script>

<div class="mx-auto max-w-3xl p-4">
	<div class="mb-6 flex justify-between items-center">
		<h1 class="text-2xl font-bold text-white">Edit Character: {character.Name}</h1>
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
			<div>
				<label for="name" class="block text-white font-medium mb-1">Name *</label>
				<input
					type="text"
					id="name"
					bind:value={character.Name}
					class="w-full p-2 border rounded focus:outline-none focus:ring focus:border-blue-300 bg-gray-700 text-white"
					required
				/>
			</div>

			<div>
				<label for="title" class="block text-white font-medium mb-1">Title</label>
				<input
					type="text"
					id="title"
					bind:value={character.Title}
					class="w-full p-2 border rounded focus:outline-none focus:ring focus:border-blue-300 bg-gray-700 text-white"
				/>
			</div>

			<div>
				<label for="birthDate" class="block text-white font-medium mb-1">Birth Date</label>
				<input
					type="date"
					id="birthDate"
					bind:value={character.BirthDate}
					class="w-full p-2 border rounded focus:outline-none focus:ring focus:border-blue-300 bg-gray-700 text-white"
				/>
			</div>

			<div>
				<label for="deathDate" class="block text-white font-medium mb-1">Death Date</label>
				<input
					type="date"
					id="deathDate"
					bind:value={character.DeathDate}
					class="w-full p-2 border rounded focus:outline-none focus:ring focus:border-blue-300 bg-gray-700 text-white"
				/>
			</div>

			<div>
				<label for="nationId" class="block text-white font-medium mb-1">Nation ID</label>
				<input
					type="number"
					id="nationId"
					bind:value={character.NationID}
					class="w-full p-2 border rounded focus:outline-none focus:ring focus:border-blue-300 bg-gray-700 text-white"
				/>
			</div>

			<div>
				<label for="religionId" class="block text-white font-medium mb-1">Religion ID</label>
				<input
					type="number"
					id="religionId"
					bind:value={character.ReligionID}
					class="w-full p-2 border rounded focus:outline-none focus:ring focus:border-blue-300 bg-gray-700 text-white"
				/>
			</div>

			<div class="md:col-span-2">
				<label for="imageUrl" class="block text-white font-medium mb-1">Image URL</label>
				<input
					type="text"
					id="imageUrl"
					bind:value={character.ImageURL}
					class="w-full p-2 border rounded focus:outline-none focus:ring focus:border-blue-300 bg-gray-700 text-white"
				/>
			</div>
		</div>

		<div class="mb-6">
			<label for="biography" class="block text-white font-medium mb-1">Biography</label>
			<textarea
				id="biography"
				bind:value={character.Biography}
				rows="6"
				class="w-full p-2 border rounded focus:outline-none focus:ring focus:border-blue-300 bg-gray-700 text-white"
			></textarea>
		</div>

		{#if character.ImageURL}
			<div class="mb-6">
				<label class="block text-white font-medium mb-1">Image Preview</label>
				<img
					src={character.ImageURL}
					alt="Character preview"
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
