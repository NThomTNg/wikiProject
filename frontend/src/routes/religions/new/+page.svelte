<script lang="ts">
	import { goto } from '$app/navigation';
	import { onMount } from 'svelte';
	import type { Religion } from '$lib/types';

	export let data: { religions: Religion[] };

	// Form data
	let name = '';
	let description = '';
	let deities = '';
	let holyText = '';
	let practices = '';
	let foundingDate = '';
	let hierarchy = '';
	let imageURL = '';

	let isSubmitting = false;
	let error = '';
	let success = '';
	let loading = false;

	// For image preview
	let imagePreview: string | null = null;

	function handleImageChange(event: Event) {
		const input = event.target as HTMLInputElement;
		if (input.files && input.files[0]) {
			imageURL = input.value;
			const reader = new FileReader();
			reader.onload = (e) => {
				imagePreview = e.target?.result as string;
			};
			reader.readAsDataURL(input.files[0]);
		}
	}

	async function handleSubmit() {
		isSubmitting = true;
		error = '';
		success = '';

		if (!name) {
			error = 'Religion name is required';
			isSubmitting = false;
			return;
		}

		try {
			const religionData = {
				Name: name,
				Description: description || null,
				Deities: deities || null,
				HolyText: holyText || null,
				Practices: practices || null,
				FoundingDate: foundingDate || null,
				Hierarchy: hierarchy || null,
				ImageURL: imageURL || null
			};

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

			goto(`/religions/${result.data.ReligionID}`);
		} catch (e) {
			error = e instanceof Error ? e.message : 'An unexpected error occurred';
			console.error('Error creating religion:', e);
			alert(error);
		} finally {
			isSubmitting = false;
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
		imagePreview = null;
		error = '';
		success = '';
	}

	onMount(() => {
		// Any initialization code can go here
	});
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
		<div class="mb-4">
			<input
				type="text"
				bind:value={imageURL}
				placeholder="Image URL"
				class="input w-full p-2 border rounded"
				on:input={() => {
					if (imageURL) imagePreview = imageURL;
					else imagePreview = null;
				}}
			/>
		</div>

		{#if imagePreview}
			<div class="mb-4">
				<img
					src={imagePreview}
					alt="Preview"
					class="max-h-60 rounded-lg border border-gray-600 object-contain"
				/>
			</div>
		{/if}

		<button
			type="submit"
			class="button w-full p-2 bg-sky-700 text-white rounded hover:bg-sky-600"
			disabled={isSubmitting}
		>
			{#if isSubmitting}
				<span class="inline-block animate-spin mr-2">↻</span>Creating...
			{:else}
				Add Religion
			{/if}
		</button>
	</form>
{/if}
