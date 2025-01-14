<script lang="ts">
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
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
			imageFile = null;
			await fetchCharacters();
		} else {
			alert('Failed to add character');
		}
	};

	const handleFileUpload = (event: Event) => {
		const target = event.target as HTMLInputElement;
		if (target.files) {
			imageFile = target.files[0];
		}
	};
</script>

{#if loading}
	<p class="text-center text-gray-500">Loading...</p>
{:else if error}
	<p class="text-center text-red-500">{error}</p>
{:else}
	<div class="mb-6">
		<button
			on:click={() => goto('/characters')}
			class="text-white bg-sky-700 p-2 rounded hover:bg-sky-600 hover:shadow-lg"
		>
			← Back to characters
		</button>
	</div>
	<form
		on:submit|preventDefault={addCharacter}
		class="mb-4 space-y-6 max-w-lg mx-auto p-5 border rounded-lg shadow-md bg-slate-700 bg-opacity-80 border-slate-800"
	>
		<div class="mb-4">
			<input
				type="text"
				bind:value={name}
				placeholder="Name"
				required
				class="input w-full p-2 border rounded"
			/>
		</div>
		<div class="mb-4">
			<input
				type="text"
				bind:value={title}
				placeholder="Title"
				class="input w-full p-2 border rounded"
			/>
		</div>
		<div class="mb-4">
			<textarea
				bind:value={biography}
				placeholder="Biography"
				class="textarea w-full p-2 border rounded"
			></textarea>
		</div>
		<div class="mb-4">
			<input
				type="text"
				bind:value={birthDate}
				placeholder="Birth Date"
				class="input w-full p-2 border rounded"
			/>
		</div>
		<div class="mb-4">
			<input
				type="text"
				bind:value={deathDate}
				placeholder="Death Date"
				class="input w-full p-2 border rounded"
			/>
		</div>
		<div class="mb-4">
			<input
				type="number"
				bind:value={nationID}
				placeholder="Nation ID"
				class="input w-full p-2 border rounded"
			/>
		</div>
		<div class="mb-4">
			<input
				type="number"
				bind:value={religionID}
				placeholder="Religion ID"
				class="input w-full p-2 border rounded"
			/>
		</div>
		<div class="mb-4">
			<input
				type="file"
				accept="image/*"
				on:change={handleFileUpload}
				class="input w-full p-2 border rounded"
			/>
		</div>
		<button type="submit" class="button w-full p-2 bg-sky-700 text-white rounded hover:bg-sky-600">
			Add Character
		</button>
	</form>
{/if}
