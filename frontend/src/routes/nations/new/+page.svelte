<script lang="ts">
	import { goto } from '$app/navigation';
	import { API_BASE_URL } from '$lib/config/api';
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
		ImageURL: null as string | null
	};

	let imageFile: File | null = null;
	let isSubmitting = false;
	let uploadProgress = 0;
	let imagePreview: string | null = null;

	function handleImageChange(event: Event) {
		const input = event.target as HTMLInputElement;
		if (input.files && input.files[0]) {
			imageFile = input.files[0];
			const reader = new FileReader();
			reader.onload = (e) => {
				imagePreview = e.target?.result as string;
			};
			reader.readAsDataURL(input.files[0]);
			nation.ImageURL = null;
		}
	}

	async function uploadImage(): Promise<string | null> {
		if (!imageFile) return null;

		const formData = new FormData();
		formData.append('image', imageFile);

		try {
			const uploadResponse = await fetch(`${API_BASE_URL}/api/upload/nation`, {
				method: 'POST',
				body: formData,
				credentials: 'include'
			});

			if (!uploadResponse.ok) {
				const errorData = await uploadResponse.json();
				throw new Error(errorData.error || 'Failed to upload image');
			}

			const uploadResult = await uploadResponse.json();
			return uploadResult.filePath;
		} catch (e) {
			console.error('Image upload failed:', e);
			throw new Error('Image upload failed');
		}
	}

	async function handleSubmit() {
		isSubmitting = true;
		uploadProgress = 0;

		if (!nation.Name) {
			alert('Nation name is required');
			isSubmitting = false;
			return;
		}

		try {
			let finalImageURL = nation.ImageURL;

			if (imageFile) {
				uploadProgress = 30;
				const uploadResult = await uploadImage();
				finalImageURL = uploadResult || '';
				uploadProgress = 60;
				console.log('Image uploaded successfully, path:', finalImageURL);
			}

			const nationData = {
				Name: nation.Name,
				Government: nation.Government || null,
				CapitalLocationID: nation.CapitalLocationID,
				Description: nation.Description || null,
				FoundingDate: nation.FoundingDate || null,
				MajorReligionID: nation.MajorReligionID,
				Culture: nation.Culture || null,
				Economy: nation.Economy || null,
				MilitaryStrength: nation.MilitaryStrength || null,
				ImageURL: finalImageURL || null
			};

			uploadProgress = 80;

			const response = await fetch(`${API_BASE_URL}/api/nations`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify(nationData),
				credentials: 'include'
			});

			const result = await response.json();

			if (!response.ok) {
				throw new Error(result.error || 'Failed to add nation');
			}

			uploadProgress = 100;
			alert('Nation added successfully!');
			goto('/nations');
		} catch (err) {
			console.error('Error adding nation:', err);
			alert(err instanceof Error ? err.message : 'An unexpected error occurred');
		} finally {
			isSubmitting = false;
			uploadProgress = 0;
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
			<label for="imageUpload" class="block text-sm font-medium text-gray-300 mb-1"
				>Nation Image</label
			>
			<div class="mb-3">
				<input
					type="file"
					accept="image/*"
					on:change={handleImageChange}
					class="block w-full text-sm text-gray-400 p-1
						file:mr-4 file:py-2 file:px-4
						file:rounded file:border-0
						file:text-sm file:font-semibold
						file:bg-sky-700 file:text-white
						hover:file:bg-sky-600"
				/>
				<p class="text-xs text-gray-400 mt-1">Max size: 5MB. Supported formats: JPG, PNG, GIF</p>
			</div>
			<input
				type="text"
				bind:value={nation.ImageURL}
				placeholder="Or enter Image URL"
				class="input w-full p-2 border rounded mt-1"
			/>
		</div>

		{#if imagePreview}
			<div class="mb-4">
				<h4 class="text-sm font-medium mb-1">Preview:</h4>
				<img
					src={imagePreview}
					alt="Preview"
					class="max-h-60 rounded-lg border border-gray-600 object-contain"
				/>
			</div>
		{/if}

		{#if uploadProgress > 0 && uploadProgress < 100}
			<div class="mb-4">
				<div class="w-full bg-gray-700 rounded-full h-2.5">
					<div class="bg-blue-600 h-2.5 rounded-full" style={`width: ${uploadProgress}%`}></div>
				</div>
				<p class="text-xs text-center mt-1">Uploading... {uploadProgress}%</p>
			</div>
		{/if}

		<button
			type="submit"
			class="button w-full p-2 bg-sky-700 text-white rounded hover:bg-sky-600"
			disabled={isSubmitting}
		>
			{#if isSubmitting}
				<span class="inline-block animate-spin mr-2">↻</span>Adding Nation...
			{:else}
				Add Nation
			{/if}
		</button>
	</form>
</div>
