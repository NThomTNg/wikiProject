<script lang="ts">
	import { goto } from '$app/navigation';
	export let data;

	let nation = {
		Name: '',
		Government: '',
		CapitalLocationID: null as number | null,
		Description: '',
		FoundingDate: '',
		MajorReligionID: null as number | null,
		Culture: '',
		Economy: '',
		MilitaryStrength: '',
		ImageURL: ''
	};

	async function handleSubmit() {
		try {
			const nationData = {
				Name: nation.Name,
				Government: nation.Government,
				CapitalLocationID: nation.CapitalLocationID,
				Description: nation.Description,
				FoundingDate: nation.FoundingDate,
				MajorReligionID: nation.MajorReligionID,
				Culture: nation.Culture,
				Economy: nation.Economy,
				MilitaryStrength: nation.MilitaryStrength,
				ImageURL: nation.ImageURL
			};

			const response = await fetch('http://localhost:5000/api/nations', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					Accept: 'application/json'
				},
				body: JSON.stringify(nationData)
			});

			const result = await response.json();

			if (!response.ok) {
				throw new Error(result.message || result.error || 'Failed to add nation');
			}

			alert('Nation added successfully!');
			goto('/nations');
		} catch (err) {
			console.error('Error adding nation:', err);
			alert(err instanceof Error ? err.message : 'An unexpected error occurred');
		}
	}
</script>

<div class="container mx-auto p-4">
	<div class="mb-6">
		<button
			on:click={() => goto('/nations')}
			class="text-white bg-sky-700 p-2 rounded hover:bg-sky-600 hover:shadow-lg"
		>
			← Back to nations
		</button>
	</div>

	<form
		on:submit|preventDefault={handleSubmit}
		class="mb-4 space-y-6 max-w-lg mx-auto p-5 border rounded-lg shadow-md bg-slate-700 bg-opacity-80 border-slate-800"
	>
		<div class="mb-4">
			<input
				type="text"
				bind:value={nation.Name}
				placeholder="Nation Name"
				required
				class="input w-full p-2 border rounded"
			/>
		</div>

		<div class="mb-4">
			<input
				type="text"
				bind:value={nation.Government}
				placeholder="Government Type"
				required
				class="input w-full p-2 border rounded"
			/>
		</div>

		<div class="mb-4">
			<select
				bind:value={nation.CapitalLocationID}
				class="input w-full p-2 border rounded"
				required
			>
				<option value={null}>Select Capital Location</option>
				{#each data.locations as location}
					<option value={location.LocationID}>{location.Name}</option>
				{/each}
			</select>
		</div>

		<div class="mb-4">
			<select bind:value={nation.MajorReligionID} class="input w-full p-2 border rounded" required>
				<option value={null}>Select Major Religion</option>
				{#each data.religions as religion}
					<option value={religion.ReligionID}>{religion.Name}</option>
				{/each}
			</select>
		</div>

		<div class="mb-4">
			<textarea
				bind:value={nation.Description}
				placeholder="Description"
				required
				class="textarea w-full p-2 border rounded h-32"
			></textarea>
		</div>

		<div class="mb-4">
			<label for="foundingDate" class="block text-sm font-medium text-gray-300 mb-1"
				>Founding Date</label
			>
			<input
				id="foundingDate"
				type="text"
				bind:value={nation.FoundingDate}
				class="input w-full p-2 border rounded"
			/>
		</div>

		<div class="mb-4">
			<input
				type="text"
				bind:value={nation.Culture}
				placeholder="Culture"
				class="input w-full p-2 border rounded"
			/>
		</div>

		<div class="mb-4">
			<input
				type="text"
				bind:value={nation.Economy}
				placeholder="Economy"
				class="input w-full p-2 border rounded"
			/>
		</div>

		<div class="mb-4">
			<input
				type="text"
				bind:value={nation.MilitaryStrength}
				placeholder="Military Strength"
				class="input w-full p-2 border rounded"
			/>
		</div>

		<div class="mb-4">
			<label for="imageUrl" class="block text-sm font-medium text-gray-300 mb-1">Nation Image</label
			>
			<input
				id="imageUrl"
				type="text"
				bind:value={nation.ImageURL}
				placeholder="Image URL"
				class="input w-full p-2 border rounded mt-1"
			/>
		</div>

		<button type="submit" class="button w-full p-2 bg-sky-700 text-white rounded hover:bg-sky-600">
			Add Nation
		</button>
	</form>
</div>
