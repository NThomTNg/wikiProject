<script lang="ts">
	import type { Character } from '$lib/types';
	export let data: { character?: Character; error?: string };

	function formatDate(date?: string): string {
		if (!date) return 'Unknown';
		return new Date(date).toLocaleDateString('en-US', {
			year: 'numeric',
			month: 'long',
			day: 'numeric'
		});
	}

	async function deleteCharacter() {
		if (confirm('Are you sure you want to delete this character?')) {
			try {
				if (!data.character) {
					throw new Error('Character data is missing');
				}
				const response = await fetch(
					`http://localhost:5000/api/characters/${data.character.CharacterID}`,
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
		<a href="/characters" class="text-blue-500 hover:underline">← Back to characters</a>
	</div>
{:else if data.character}
	<div class="mx-auto p-4">
		<div class="mb-6">
			<a href="/characters" class="text-blue-500 hover:underline">← Back to characters</a>
		</div>

		<div class="grid md:grid-cols-2 gap-8">
			<div class="relative">
				{#if data.character.ImageURL}
					<img
						src={data.character.ImageURL}
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
								<span class="ml-2">{formatDate(data.character.BirthDate)}</span>
							</div>
							<div>
								<span class="text-gray-600 dark:text-gray-400">Death:</span>
								<span class="ml-2">{formatDate(data.character.DeathDate)}</span>
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
						{#if data.character.NationID}
							<div>
								<span class="text-gray-600 dark:text-gray-400">Nation ID:</span>
								<span class="ml-2">{data.character.NationID}</span>
							</div>
						{/if}
						{#if data.character.ReligionID}
							<div>
								<span class="text-gray-600 dark:text-gray-400">Religion ID:</span>
								<span class="ml-2">{data.character.ReligionID}</span>
							</div>
						{/if}
					</div>
				</div>
				<button
					on:click={deleteCharacter}
					class="mt-4 bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
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
