<script lang="ts">
	import { goto } from '$app/navigation';
	import type { Religion } from '$lib/types';

	export let data: { religions: Religion[] };

	let name = '';
	let description = '';
	let deities = '';
	let holyText = '';
	let practices = '';
	let foundingDate = '';
	let hierarchy = '';
	let imageURL = '';
	let imageFile: File | null = null;

	let isSubmitting = false;
	let error = '';
	let success = '';
	let loading = false;
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
			imageURL = '';
		}
	}

	async function uploadImage(): Promise<string | null> {
		if (!imageFile) return null;

		const formData = new FormData();
		formData.append('image', imageFile);

		try {
			const uploadResponse = await fetch('http://localhost:5000/api/upload/religion', {
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
		error = '';
		success = '';
		uploadProgress = 0;

		if (!name) {
			error = 'Religion name is required';
			isSubmitting = false;
			return;
		}

		try {
			let finalImageURL = imageURL;

			if (imageFile) {
				uploadProgress = 30;
				const uploadResult = await uploadImage();
				finalImageURL = uploadResult || '';
				uploadProgress = 60;
				console.log('Image uploaded successfully, path:', finalImageURL);
			}

			const religionData = {
				Name: name,
				Description: description || null,
				Deities: deities || null,
				HolyText: holyText || null,
				Practices: practices || null,
				FoundingDate: foundingDate || null,
				Hierarchy: hierarchy || null,
				ImageURL: finalImageURL || null
			};

			uploadProgress = 80;

			const response = await fetch('http://localhost:5000/api/religions', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify(religionData),
				credentials: 'include'
			});

			if (!response.ok) {
				const errorData = await response.json();
				throw new Error(errorData.error || 'Failed to create religion');
			}

			const result = await response.json();
			success = 'Religion created successfully!';
			alert('Religion added successfully!');
			uploadProgress = 100;

			goto(`/religions/${result.ReligionID}`);
		} catch (e) {
			error = e instanceof Error ? e.message : 'An unexpected error occurred';
			console.error('Error creating religion:', e);
			alert(error);
		} finally {
			isSubmitting = false;
			uploadProgress = 0;
		}
	}

	function resetForm() {
		name = '';
		description = '';
		deities = '';
		holyText = '';
		practices = '';
		foundingDate = '';
		hierarchy = '';
		imageURL = '';
		imageFile = null;
		imagePreview = null;
		error = '';
		success = '';
	}
</script>

{#if loading}
	<p class="text-center text-gray-500">Loading...</p>
{:else if error}
	<p class="text-center text-red-500">{error}</p>
{:else}
	<div class="mb-6">
		<button
			on:click={() => goto('/religions')}
			class="text-white bg-sky-700 p-2 rounded hover:bg-sky-600 hover:shadow-lg"
		>
			← Back to religions
		</button>
	</div>
	<form
		on:submit|preventDefault={handleSubmit}
		class="mb-4 space-y-6 max-w-lg mx-auto p-5 border rounded-lg shadow-md bg-slate-700 bg-opacity-80 border-slate-800"
	>
		<div class="mb-4">
			<input
				type="text"
				bind:value={name}
				placeholder="Religion Name"
				required
				class="input w-full p-2 border rounded"
			/>
		</div>
		<div class="mb-4">
			<input
				type="text"
				bind:value={deities}
				placeholder="Deities"
				class="input w-full p-2 border rounded"
			/>
		</div>
		<div class="mb-4">
			<input
				type="text"
				bind:value={holyText}
				placeholder="Holy Texts"
				class="input w-full p-2 border rounded"
			/>
		</div>
		<div class="mb-4">
			<textarea
				bind:value={practices}
				placeholder="Practices"
				class="textarea w-full p-2 border rounded"
			></textarea>
		</div>
		<div class="mb-4">
			<input
				type="text"
				bind:value={foundingDate}
				placeholder="Founding Date"
				class="input w-full p-2 border rounded"
			/>
		</div>
		<div class="mb-4">
			<input
				type="text"
				bind:value={hierarchy}
				placeholder="Hierarchy"
				class="input w-full p-2 border rounded"
			/>
		</div>
		<div class="mb-4">
			<textarea
				bind:value={description}
				placeholder="Description"
				class="textarea w-full p-2 border rounded"
				rows="4"
			></textarea>
		</div>

		<div class="mb-4 border-t pt-4">
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

		<div class="flex gap-2">
			<button
				type="submit"
				class="button flex-1 p-2 bg-sky-700 text-white rounded hover:bg-sky-600"
				disabled={isSubmitting}
			>
				{#if isSubmitting}
					<span class="inline-block animate-spin mr-2">↻</span>Creating...
				{:else}
					Add Religion
				{/if}
			</button>
			<button
				type="button"
				on:click={resetForm}
				class="button p-2 bg-gray-600 text-white rounded hover:bg-gray-500"
				disabled={isSubmitting}
			>
				Reset
			</button>
		</div>
	</form>
{/if}
