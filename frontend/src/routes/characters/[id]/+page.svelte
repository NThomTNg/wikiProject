<script lang="ts">
	import type { Character } from '$lib/types';
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import { getImageUrl } from '$lib/utils/imageUtils';
	import { onMount } from 'svelte';
	import { API_BASE_URL } from '$lib/config/api';

	export let data: { character?: Character; error?: string };

	let nationName = '';
	let religionName = '';
	const id = $page.params.id;

	onMount(async () => {
		if (data.character) {
			if (data.character.NationID) {
				try {
					const response = await fetch(`${API_BASE_URL}/api/nations/${data.character.NationID}`, {
						credentials: 'include'
					});
					if (response.ok) {
						const result = await response.json();
						const nation = result.data || result;
						nationName = nation.Name || nation.name || 'Unknown';
					} else {
						console.error('Failed to fetch nation, status:', response.status);
						nationName = 'Unknown';
					}
				} catch (error) {
					console.error('Failed to fetch nation:', error);
					nationName = 'Unknown';
				}
			}

			if (data.character.ReligionID) {
				try {
					const response = await fetch(
						`${API_BASE_URL}/api/religions/${data.character.ReligionID}`,
						{
							credentials: 'include'
						}
					);
					if (response.ok) {
						const result = await response.json();
						const religion = result.data || result;
						religionName = religion.Name || religion.name || 'Unknown';
					} else {
						console.error('Failed to fetch religion, status:', response.status);
						religionName = 'Unknown';
					}
				} catch (error) {
					console.error('Failed to fetch religion:', error);
					religionName = 'Unknown';
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
		goto(`/characters/edit/${id}`);
	}

	async function deleteCharacter() {
		if (confirm('Are you sure you want to delete this character?')) {
			try {
				if (!data.character) {
					throw new Error('Character data is missing');
				}
				const response = await fetch(
					`${API_BASE_URL}/api/characters/${data.character.CharacterID}`,
					{
						method: 'DELETE',
						headers: {
							'Content-Type': 'application/json'
						},
						credentials: 'include'
					}
				);

				if (!response.ok) {
					const errorData = await response.json();
					throw new Error(errorData.error || 'Failed to delete character');
				}

				alert('Character deleted successfully.');
				window.location.href = '/characters';
			} catch (error) {
				alert(error instanceof Error ? error.message : 'Failed to delete character');
			}
		}
	}
</script>

{#if data.error}
	<div class="text-center">
		<p class="text-red-600">{data.error}</p>
	</div>
{:else if data.character}
	<div class="mx-auto p-4">
		<div class="mb-6">
			<button
				on:click={() => goto('/characters')}
				class="text-white bg-sky-700 p-2 rounded hover:bg-sky-600 hover:shadow-lg"
			>
				← Back to characters
			</button>
			<button
				on:click={handleEdit}
				class="text-white bg-sky-700 p-2 rounded hover:bg-sky-600 hover:shadow-lg ml-2"
			>
				Edit Character
			</button>
		</div>

		<div class="grid md:grid-cols-2 gap-8">
			<div class="relative">
				{#if data.character.ImageURL}
					<img
						src={getImageUrl(data.character.ImageURL)}
						alt={data.character.Name}
						class="w-full h-auto rounded-lg shadow-lg max-h-[600px] object-cover"
					/>
				{:else}
					<div class="bg-gray-200 rounded-lg flex items-center justify-center h-96 aspect-[3/4]">
						<span class="text-gray-500">No image available</span>
					</div>
				{/if}
			</div>

			<div class="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-lg">
				<h1 class="text-3xl text-white font-bold mb-2">{data.character.Name}</h1>
				{#if data.character.Title}
					<h2 class="text-xl text-gray-600 dark:text-gray-300 mb-4">{data.character.Title}</h2>
				{/if}

				<div class="space-y-4">
					<div class="border-b pb-4">
						<h3 class="text-lg text-white font-semibold mb-2">Life Span</h3>
						<div class="grid grid-cols-2 gap-4">
							<div>
								<span class="text-gray-600 dark:text-gray-400">Birth:</span>
								<span class="ml-2 text-white">{formatDate(data.character.BirthDate)}</span>
							</div>
							<div>
								<span class="text-gray-600 dark:text-gray-400">Death:</span>
								<span class="ml-2 text-white">{formatDate(data.character.DeathDate)}</span>
							</div>
						</div>
					</div>

					{#if data.character.Biography}
						<div class="border-b pb-4">
							<h3 class="text-lg text-white font-semibold mb-2">Biography</h3>
							<p class="text-gray-700 dark:text-gray-300 whitespace-pre-line">
								{data.character.Biography}
							</p>
						</div>
					{/if}

					<div class="grid grid-cols-2 gap-4">
						{#if nationName}
							<div>
								<span class="text-gray-600 dark:text-gray-400">Nation:</span>
								<span class="ml-2 text-white">{nationName}</span>
							</div>
						{/if}
						{#if religionName}
							<div>
								<span class="text-gray-600 dark:text-gray-400">Religion:</span>
								<span class="ml-2 text-white">{religionName}</span>
							</div>
						{/if}
					</div>
				</div>
				<button
					on:click={deleteCharacter}
					class="mt-4 bg-red-700 text-white px-4 py-2 rounded hover:bg-red-600"
				>
					Delete Character
				</button>
			</div>
		</div>
	</div>
{:else}
	<div class="text-center p-8">
		<div class="animate-pulse">
			<p>Loading character data...</p>
		</div>
	</div>
{/if}
