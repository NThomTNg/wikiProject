<script lang="ts">
	import { onMount } from 'svelte';
	import type { Character } from '$lib/types';

	let characters: Character[] = [];
	let loading = true;
	let error: string | null = null;

	let name = '';
	let title = '';
	let biography = '';
	let birthDate = '';
	let deathDate = '';
	let nationID: null | number = null;
	let religionID: null | number = null;
	let imageFile: File | null = null;

	onMount(async () => {
		await fetchCharacters();
	});

	const fetchCharacters = async () => {
		try {
			const response = await fetch('http://localhost:5000/api/characters');
			if (!response.ok) throw new Error('Failed to fetch characters');
			const data = await response.json();
			characters = data.data;
		} catch (err) {
			error = err instanceof Error ? err.message : 'An error occurred';
		} finally {
			loading = false;
		}
	};

	const addCharacter = async () => {
		const formData = new FormData();
		formData.append('Name', name);
		formData.append('Title', title);
		formData.append('Biography', biography);
		formData.append('BirthDate', birthDate);
		formData.append('DeathDate', deathDate);
		formData.append('NationID', nationID!.toString());
		formData.append('ReligionID', religionID!.toString());
		if (imageFile) {
			formData.append('Image', imageFile);
		}

		const response = await fetch('http://localhost:5000/api/characters/new', {
			method: 'POST',
			body: formData
		});

		if (response.ok) {
			const data = await response.json();
			alert(`Character added with ID: ${data.CharacterID}`);
			name = '';
			title = '';
			biography = '';
			birthDate = '';
			deathDate = '';
			nationID = null;
			religionID = null;
			imageFile = null; // Reset the image file
			await fetchCharacters();
		} else {
			alert('Failed to add character');
		}
	};

	const handleFileUpload = (event: Event) => {
		const target = event.target as HTMLInputElement;
		if (target.files) {
			imageFile = target.files[0]; // Store the selected file
		}
	};
</script>

{#if loading}
	<p class="text-center text-gray-500">Loading...</p>
{:else if error}
	<p class="text-center text-red-500">{error}</p>
{:else}
	<div class="mb-6">
		<a href="/characters" class="text-blue-500 hover:underline">← Back to characters</a>
	</div>
	<form
		on:submit|preventDefault={addCharacter}
		class="mb-4 space-y-4 max-w-lg mx-auto p-4 border rounded-lg shadow-md"
	>
		<input
			type="text"
			bind:value={name}
			placeholder="Name"
			required
			class="input w-full p-2 border rounded"
		/>
		<input
			type="text"
			bind:value={title}
			placeholder="Title"
			class="input w-full p-2 border rounded"
		/>
		<textarea
			bind:value={biography}
			placeholder="Biography"
			class="textarea w-full p-2 border rounded"
		></textarea>
		<input
			type="text"
			bind:value={birthDate}
			placeholder="Birth Date"
			class="input w-full p-2 border rounded"
		/>
		<input
			type="text"
			bind:value={deathDate}
			placeholder="Death Date"
			class="input w-full p-2 border rounded"
		/>
		<input
			type="number"
			bind:value={nationID}
			placeholder="Nation ID"
			class="input w-full p-2 border rounded"
		/>
		<input
			type="number"
			bind:value={religionID}
			placeholder="Religion ID"
			class="input w-full p-2 border rounded"
		/>
		<input
			type="file"
			accept="image/*"
			on:change={handleFileUpload}
			class="input w-full p-2 border rounded"
		/>
		<button
			type="submit"
			class="button w-full p-2 bg-blue-500 text-white rounded hover:bg-blue-600"
		>
			Add Character
		</button>
	</form>
{/if}
