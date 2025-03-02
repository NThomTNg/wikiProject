<script lang="ts">
	import type { Nation } from '$lib/types';
	import { goto } from '$app/navigation';

	export let data: { nation?: Nation; error?: string };

	function formatDate(date?: string | null): string {
		if (!date) return 'Unknown';
		return new Date(date).toLocaleDateString('en-US', {
			year: 'numeric',
			month: 'long',
			day: 'numeric'
		});
	}

	async function deleteNation() {
		if (confirm('Are you sure you want to delete this nation?')) {
			try {
				if (!data.nation) {
					throw new Error('Nation data is missing');
				}
				const response = await fetch(`http://localhost:5000/api/nations/${data.nation.NationID}`, {
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
		</div>

		<div class="grid md:grid-cols-2 gap-8">
			<div class="relative">
				{#if data.nation.ImageURL}
					<img
						src={data.nation.ImageURL}
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
						{#if data.nation.CapitalLocationID}
							<div>
								<span class="text-gray-600 dark:text-gray-400">Capital Location ID:</span>
								<span class="ml-2">{data.nation.CapitalLocationID}</span>
							</div>
						{/if}
						{#if data.nation.MajorReligionID}
							<div>
								<span class="text-gray-600 dark:text-gray-400">Major Religion ID:</span>
								<span class="ml-2">{data.nation.MajorReligionID}</span>
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
