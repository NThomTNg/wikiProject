<script lang="ts">
	import type { Nation } from '$lib/types';
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import { getImageUrl } from '$lib/utils/imageUtils';
	import { onMount } from 'svelte';
	import { API_BASE_URL } from '$lib/config/api';

	export let data: { nation?: Nation; error?: string };

	let capitalLocationName = '';
	let majorReligionName = '';
	const id = $page.params.id;

	onMount(async () => {
		if (data.nation) {
			if (data.nation.CapitalLocationID) {
				try {
					const response = await fetch(
						`${API_BASE_URL}/api/locations/${data.nation.CapitalLocationID}`,
						{
							credentials: 'include'
						}
					);
					if (response.ok) {
						const result = await response.json();
						const location = result.data || result;
						capitalLocationName = location.Name || location.name || 'Unknown';
					} else {
						console.error('Failed to fetch capital location, status:', response.status);
						capitalLocationName = 'Unknown';
					}
				} catch (error) {
					console.error('Failed to fetch capital location:', error);
					capitalLocationName = 'Unknown';
				}
			}

			if (data.nation.MajorReligionID) {
				try {
					const response = await fetch(
						`${API_BASE_URL}/api/religions/${data.nation.MajorReligionID}`,
						{
							credentials: 'include'
						}
					);
					if (response.ok) {
						const result = await response.json();
						const religion = result.data || result;
						majorReligionName = religion.Name || religion.name || 'Unknown';
					} else {
						console.error('Failed to fetch major religion, status:', response.status);
						majorReligionName = 'Unknown';
					}
				} catch (error) {
					console.error('Failed to fetch major religion:', error);
					majorReligionName = 'Unknown';
				}
			}
		}
	});

	function formatDate(date?: string | null): string {
		if (!date) return 'Unknown';
		return new Date(date).toLocaleDateString('en-US', {
			year: 'numeric',
			month: 'long',
			day: 'numeric'
		});
	}

	function handleEdit() {
		goto(`/nations/edit/${id}`);
	}

	async function deleteNation() {
		if (confirm('Are you sure you want to delete this nation?')) {
			try {
				if (!data.nation) {
					throw new Error('Nation data is missing');
				}
				const response = await fetch(`${API_BASE_URL}/api/nations/${data.nation.NationID}`, {
					method: 'DELETE',
					headers: {
						'Content-Type': 'application/json'
					},
					credentials: 'include'
				});

				if (!response.ok) {
					const errorData = await response.json();
					throw new Error(errorData.error || 'Failed to delete nation');
				}

				alert('Nation deleted successfully.');
				window.location.href = '/nations';
			} catch (error) {
				alert(error instanceof Error ? error.message : 'Failed to delete nation');
			}
		}
	}
</script>

{#if data.error}
	<div class="text-center">
		<p class="text-red-600">{data.error}</p>
	</div>
{:else if data.nation}
	<div class="mx-auto p-4">
		<div class="mb-6">
			<button
				on:click={() => goto('/nations')}
				class="text-white bg-sky-700 p-2 rounded hover:bg-sky-600 hover:shadow-lg"
			>
				← Back to nations
			</button>
			<button
				on:click={handleEdit}
				class="text-white bg-sky-700 p-2 rounded hover:bg-sky-600 hover:shadow-lg ml-2"
			>
				Edit nation
			</button>
		</div>

		<div class="grid md:grid-cols-2 gap-8">
			<div class="relative">
				{#if data.nation.ImageURL}
					<img
						src={getImageUrl(data.nation.ImageURL)}
						alt={data.nation.Name}
						class="w-full h-auto rounded-lg shadow-lg max-h-[600px] object-cover"
					/>
				{:else}
					<div class="bg-gray-200 rounded-lg flex items-center justify-center h-96 aspect-[3/4]">
						<span class="text-gray-500">No image available</span>
					</div>
				{/if}
			</div>

			<div class="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-lg">
				<h1 class="text-3xl text-white font-bold mb-2">{data.nation.Name}</h1>

				<div class="space-y-4">
					<div class="border-b pb-4">
						<h3 class="text-lg text-white font-semibold mb-2">Government</h3>
						<p class="text-gray-700 dark:text-gray-300">{data.nation.Government}</p>
					</div>

					<div class="border-b pb-4">
						<h3 class="text-lg text-white font-semibold mb-2">Founding Date</h3>
						<p class="text-gray-700 dark:text-gray-300">{formatDate(data.nation.FoundingDate)}</p>
					</div>

					{#if data.nation.Description}
						<div class="border-b pb-4">
							<h3 class="text-lg text-white font-semibold mb-2">Description</h3>
							<p class="text-gray-700 dark:text-gray-300 whitespace-pre-line">
								{data.nation.Description}
							</p>
						</div>
					{/if}

					<div class="grid grid-cols-2 gap-4">
						<div>
							<h3 class="text-lg text-white font-semibold mb-2">Culture</h3>
							<p class="text-gray-700 dark:text-gray-300">{data.nation.Culture}</p>
						</div>
						<div>
							<h3 class="text-lg text-white font-semibold mb-2">Economy</h3>
							<p class="text-gray-700 dark:text-gray-300">{data.nation.Economy}</p>
						</div>
					</div>

					<div class="border-b pb-4">
						<h3 class="text-lg text-white font-semibold mb-2">Military Strength</h3>
						<p class="text-gray-700 dark:text-gray-300">{data.nation.MilitaryStrength}</p>
					</div>

					<div class="grid grid-cols-2 gap-4">
						{#if capitalLocationName}
							<div>
								<span class="text-gray-600 dark:text-gray-400">Capital:</span>
								<span class="ml-2 text-white">{capitalLocationName}</span>
							</div>
						{/if}
						{#if majorReligionName}
							<div>
								<span class="text-gray-600 dark:text-gray-400">Major Religion:</span>
								<span class="ml-2 text-white">{majorReligionName}</span>
							</div>
						{/if}
					</div>
				</div>
				<button
					on:click={deleteNation}
					class="mt-4 bg-red-700 text-white px-4 py-2 rounded hover:bg-red-600"
				>
					Delete Nation
				</button>
			</div>
		</div>
	</div>
{:else}
	<div class="text-center p-8">
		<div class="animate-pulse">
			<p>Loading nation data...</p>
		</div>
	</div>
{/if}
