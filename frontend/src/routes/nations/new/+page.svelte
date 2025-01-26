<script lang="ts">
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import type { Nation } from '$lib/types';

	let nations: Nation[] = [];
	let loading = true;
	let error: string | null = null;

	let name = '';
	let government = '';
	let capitalLocationID: number | null = null;
	let description = '';
	let foundingDate = '';
	let majorReligionID: number | null = null;
	let culture = '';
	let economy = '';
	let militaryStrength = '';
	let imageFile: File | null = null;

	onMount(async () => {
		await fetchNations();
	});

	const fetchNations = async () => {
		try {
			const response = await fetch('http://localhost:5000/api/nations');
			if (!response.ok) throw new Error('Failed to fetch nations');
			const data = await response.json();
			nations = data.data;
		} catch (err) {
			error = err instanceof Error ? err.message : 'An error occurred';
		} finally {
			loading = false;
		}
	};

	const addNation = async () => {
		try {
			if (!capitalLocationID || !majorReligionID) {
				throw new Error('Capital Location ID and Major Religion ID are required');
			}

			const nationData = {
				Name: name.trim(),
				Government: government.trim(),
				CapitalLocationID: Number(capitalLocationID),
				Description: description.trim(),
				FoundingDate: foundingDate.trim(),
				MajorReligionID: Number(majorReligionID),
				Culture: culture.trim(),
				Economy: economy.trim(),
				MilitaryStrength: militaryStrength.trim()
			};

			const response = await fetch('http://localhost:5000/api/nations', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					Accept: 'application/json'
				},
				body: JSON.stringify(nationData)
			});

			const data = await response.json();

			if (!response.ok) {
				throw new Error(data.message || 'Failed to add nation');
			}

			alert(`Nation added successfully!`);

			name = '';
			government = '';
			capitalLocationID = null;
			description = '';
			foundingDate = '';
			majorReligionID = null;
			culture = '';
			economy = '';
			militaryStrength = '';
			imageFile = null;

			await fetchNations();
		} catch (err) {
			console.error('Error adding nation:', err);
			error = err instanceof Error ? err.message : 'An unexpected error occurred';
			alert(error);
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
			on:click={() => goto('/nations')}
			class="text-white bg-sky-700 p-2 rounded hover:bg-sky-600 hover:shadow-lg"
		>
			← Back to nations
		</button>
	</div>
	<form
		on:submit|preventDefault={addNation}
		class="mb-4 space-y-6 max-w-lg mx-auto p-5 border rounded-lg shadow-md bg-slate-700 bg-opacity-80 border-slate-800"
	>
		<div class="mb-4">
			<input
				type="text"
				bind:value={name}
				placeholder="Nation Name"
				required
				class="input w-full p-2 border rounded"
			/>
		</div>
		<div class="mb-4">
			<input
				type="text"
				bind:value={government}
				placeholder="Government Type"
				required
				class="input w-full p-2 border rounded"
			/>
		</div>
		<div class="mb-4">
			<input
				type="number"
				bind:value={capitalLocationID}
				placeholder="Capital Location ID"
				required
				class="input w-full p-2 border rounded"
			/>
		</div>
		<div class="mb-4">
			<textarea
				bind:value={description}
				placeholder="Description"
				class="textarea w-full p-2 border rounded"
				required
			></textarea>
		</div>
		<div class="mb-4">
			<input
				type="text"
				bind:value={foundingDate}
				placeholder="Founding Date"
				class="input w-full p-2 border rounded"
				required
			/>
		</div>
		<div class="mb-4">
			<input
				type="number"
				bind:value={majorReligionID}
				placeholder="Major Religion ID"
				class="input w-full p-2 border rounded"
				required
			/>
		</div>
		<div class="mb-4">
			<input
				type="text"
				bind:value={culture}
				placeholder="Culture"
				class="input w-full p-2 border rounded"
				required
			/>
		</div>
		<div class="mb-4">
			<input
				type="text"
				bind:value={economy}
				placeholder="Economy"
				class="input w-full p-2 border rounded"
				required
			/>
		</div>
		<div class="mb-4">
			<input
				type="text"
				bind:value={militaryStrength}
				placeholder="Military Strength"
				class="input w-full p-2 border rounded"
				required
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
			Add Nation
		</button>
	</form>
{/if}
