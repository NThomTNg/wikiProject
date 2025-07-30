<script lang="ts">
	import { goto } from '$app/navigation';
	import { API_BASE_URL } from '$lib/config/api';
	export let data;

	let location = {
		Name: '',
		LocationType: '',
		Description: '',
		NationID: null as number | null,
		CoordinateX: null as number | null,
		CoordinateY: null as number | null,
		Climate: '',
		Population: null as number | null
	};

	async function handleSubmit() {
		try {
			const response = await fetch(`${API_BASE_URL}/api/locations`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					Accept: 'application/json'
				},
				body: JSON.stringify(location)
			});

			const result = await response.json();

			if (!response.ok) {
				throw new Error(result.message || 'Failed to add location');
			}

			alert('Location added successfully!');
			goto('/locations');
		} catch (err) {
			console.error('Error adding location:', err);
			alert(err instanceof Error ? err.message : 'An unexpected error occurred');
		}
	}
</script>

<div class="container mx-auto p-4">
	<div class="mb-6">
		<button
			on:click={() => goto('/locations')}
			class="text-white bg-sky-700 p-2 rounded hover:bg-sky-600 hover:shadow-lg"
		>
			← Back to locations
		</button>
	</div>

	<form
		on:submit|preventDefault={handleSubmit}
		class="mb-4 space-y-6 max-w-lg mx-auto p-5 border rounded-lg shadow-md bg-slate-700 bg-opacity-80 border-slate-800"
	>
		<div class="mb-4">
			<input
				type="text"
				bind:value={location.Name}
				placeholder="Location Name"
				required
				class="input w-full p-2 border rounded"
			/>
		</div>

		<div class="mb-4">
			<input
				type="text"
				bind:value={location.LocationType}
				placeholder="Location Type"
				required
				class="input w-full p-2 border rounded"
			/>
		</div>

		<div class="mb-4">
			<select bind:value={location.NationID} class="input w-full p-2 border rounded">
				<option value={null}>Select Nation</option>
				{#each data.nations as nation}
					<option value={nation.NationID}>{nation.Name}</option>
				{/each}
			</select>
		</div>

		<div class="mb-4">
			<textarea
				bind:value={location.Description}
				placeholder="Description"
				class="textarea w-full p-2 border rounded h-32"
			></textarea>
		</div>

		<div class="grid grid-cols-2 gap-4 mb-4">
			<input
				type="number"
				bind:value={location.CoordinateX}
				placeholder="Coordinate X"
				class="input w-full p-2 border rounded"
			/>
			<input
				type="number"
				bind:value={location.CoordinateY}
				placeholder="Coordinate Y"
				class="input w-full p-2 border rounded"
			/>
		</div>

		<div class="mb-4">
			<input
				type="text"
				bind:value={location.Climate}
				placeholder="Climate"
				class="input w-full p-2 border rounded"
			/>
		</div>

		<div class="mb-4">
			<input
				type="number"
				bind:value={location.Population}
				placeholder="Population"
				class="input w-full p-2 border rounded"
			/>
		</div>

		<button type="submit" class="button w-full p-2 bg-sky-700 text-white rounded hover:bg-sky-600">
			Add Location
		</button>
	</form>
</div>
