<script lang="ts">
	import { goto } from '$app/navigation';
	export let data;

	let character = {
		Name: '',
		Title: '',
		Biography: '',
		NationID: null as number | null,
		ReligionID: null as number | null,
		BirthDate: null as string | null,
		DeathDate: null as string | null,
		ImageURL: null as string | null
	};

	async function handleSubmit() {
		try {
			const formData = new FormData();
			const fields: Record<keyof typeof character, (val: any) => string | null> = {
				Name: (val: string) => val || null,
				Title: (val: string) => val || null,
				Biography: (val: string) => val || null,
				NationID: (val: number | null) => val?.toString() || null,
				ReligionID: (val: number | null) => val?.toString() || null,
				BirthDate: (val: string | null) => val || null,
				DeathDate: (val: string | null) => val || null,
				ImageURL: (val: string | null) => (val && val.trim() !== '' ? val : null)
			};

			Object.entries(fields).forEach(([key, converter]) => {
				const value = converter(character[key as keyof typeof character]);
				if (value !== null) {
					formData.append(key, value);
				}
			});

			const response = await fetch('http://localhost:5000/api/characters', {
				method: 'POST',
				body: formData
			});

			const result = await response.json();

			if (!response.ok) {
				throw new Error(result.error || 'Failed to add character');
			}

			alert('Character added successfully!');
			goto('/characters');
		} catch (err) {
			console.error('Error adding character:', err);
			alert(err instanceof Error ? err.message : 'An unexpected error occurred');
		}
	}
</script>

<div class="container mx-auto p-4">
	<div class="mb-6">
		<button
			on:click={() => goto('/characters')}
			class="text-white bg-sky-700 p-2 rounded hover:bg-sky-600 hover:shadow-lg"
		>
			← Back to characters
		</button>
	</div>

	<form
		on:submit|preventDefault={handleSubmit}
		class="mb-4 space-y-6 max-w-lg mx-auto p-5 border rounded-lg shadow-md bg-slate-700 bg-opacity-80 border-slate-800"
	>
		<div class="mb-4">
			<input
				type="text"
				bind:value={character.Name}
				placeholder="Character Name"
				required
				class="input w-full p-2 border rounded"
			/>
		</div>

		<div class="mb-4">
			<input
				type="text"
				bind:value={character.Title}
				placeholder="Title"
				class="input w-full p-2 border rounded"
			/>
		</div>

		<div class="mb-4">
			<select bind:value={character.NationID} class="input w-full p-2 border rounded">
				<option value={null}>Select Nation</option>
				{#each data.nations as nation}
					<option value={nation.NationID}>{nation.Name}</option>
				{/each}
			</select>
		</div>

		<div class="mb-4">
			<select bind:value={character.ReligionID} class="input w-full p-2 border rounded">
				<option value={null}>Select Religion</option>
				{#each data.religions as religion}
					<option value={religion.ReligionID}>{religion.Name}</option>
				{/each}
			</select>
		</div>

		<div class="mb-4">
			<textarea
				bind:value={character.Biography}
				placeholder="Biography"
				class="textarea w-full p-2 border rounded h-32"
			></textarea>
		</div>

		<div class="grid grid-cols-2 gap-4 mb-4">
			<div>
				<label for="birthDate" class="block text-sm font-medium text-gray-300 mb-1"
					>Birth Date</label
				>
				<input
					id="birthDate"
					type="number"
					bind:value={character.BirthDate}
					class="input w-full p-2 border rounded"
				/>
			</div>
			<div>
				<label for="deathDate" class="block text-sm font-medium text-gray-300 mb-1"
					>Death Date</label
				>
				<input
					id="deathDate"
					type="number"
					bind:value={character.DeathDate}
					class="input w-full p-2 border rounded"
				/>
			</div>
		</div>

		<div class="mb-4">
			<label for="imageUpload" class="block text-sm font-medium text-gray-300 mb-1"
				>Character Image</label
			>
			<input
				type="text"
				bind:value={character.ImageURL}
				placeholder="Image URL (Optional)"
				class="input w-full p-2 border rounded mt-1"
			/>
		</div>

		<button type="submit" class="button w-full p-2 bg-sky-700 text-white rounded hover:bg-sky-600">
			Add Character
		</button>
	</form>
</div>
