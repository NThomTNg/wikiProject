<script lang="ts">
	import { page } from '$app/stores';
	import type { Religion } from '$lib/types';
	import { goto } from '$app/navigation';
	import { getImageUrl } from '$lib/utils/imageUtils';

	export let data: { religion?: Religion; error?: string };
	const id = $page.params.id;

	function formatDate(date?: string): string {
		if (!date) return 'Unknown';
		return new Date(date).toLocaleDateString('en-US', {
			year: 'numeric',
			month: 'long',
			day: 'numeric'
		});
	}

	function handleEdit() {
		goto(`/religions/edit/${id}`);
	}

	async function deleteReligion() {
		if (confirm('Are you sure you want to delete this religion?')) {
			try {
				if (!data.religion) {
					throw new Error('Religion data is missing');
				}
				const response = await fetch(
					`http://localhost:5000/api/religions/${data.religion.ReligionID}`,
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
					throw new Error(errorData.error || 'Failed to delete religion');
				}

				alert('Religion deleted successfully.');
				window.location.href = '/religions';
			} catch (error) {
				alert(error instanceof Error ? error.message : 'Failed to delete religion');
			}
		}
	}
</script>

{#if data.error}
	<div class="text-center">
		<p class="text-red-600">{data.error}</p>
	</div>
{:else if data.religion}
	<div class="mx-auto p-4">
		<div class="mb-6">
			<button
				on:click={() => goto('/religions')}
				class="text-white bg-sky-700 p-2 rounded hover:bg-sky-600 hover:shadow-lg"
			>
				← Back to religions
			</button>
			<button
				on:click={handleEdit}
				class="text-white bg-sky-700 p-2 rounded hover:bg-sky-600 hover:shadow-lg ml-2"
			>
				Edit religion
			</button>
		</div>

		<div class="bg-gray-800 rounded-lg p-6 shadow-lg">
			<h1 class="text-3xl text-white font-bold mb-2">{data.religion.Name}</h1>

			<div class="grid md:grid-cols-2 gap-8 mt-6">
				<div>
					{#if data.religion.ImageURL}
						<img
							src={getImageUrl(data.religion.ImageURL)}
							alt={data.religion.Name}
							class="w-full h-auto rounded-lg shadow-lg max-h-[600px] object-cover mb-4"
						/>
					{/if}
				</div>

				<div>
					{#if data.religion.Description}
						<div class="border-b pb-4 mb-4">
							<h3 class="text-lg text-white font-semibold mb-2">Description</h3>
							<p class="text-gray-300 whitespace-pre-line">{data.religion.Description}</p>
						</div>
					{/if}

					{#if data.religion.Deities}
						<div class="border-b pb-4 mb-4">
							<h3 class="text-lg text-white font-semibold mb-2">Deities</h3>
							<p class="text-gray-300">{data.religion.Deities}</p>
						</div>
					{/if}

					{#if data.religion.HolyText}
						<div class="border-b pb-4 mb-4">
							<h3 class="text-lg text-white font-semibold mb-2">Holy Texts</h3>
							<p class="text-gray-300">{data.religion.HolyText}</p>
						</div>
					{/if}

					{#if data.religion.Practices}
						<div class="border-b pb-4 mb-4">
							<h3 class="text-lg text-white font-semibold mb-2">Practices</h3>
							<p class="text-gray-300">{data.religion.Practices}</p>
						</div>
					{/if}

					{#if data.religion.FoundingDate}
						<div class="border-b pb-4 mb-4">
							<h3 class="text-lg text-white font-semibold mb-2">Founding Date</h3>
							<p class="text-gray-300">{data.religion.FoundingDate}</p>
						</div>
					{/if}

					{#if data.religion.Hierarchy}
						<div class="border-b pb-4 mb-4">
							<h3 class="text-lg text-white font-semibold mb-2">Hierarchy</h3>
							<p class="text-gray-300">{data.religion.Hierarchy}</p>
						</div>
					{/if}

					<div class="mt-4">
						<p class="text-sm text-gray-400">
							Created: {formatDate(data.religion.CreatedDate?.toString())}
						</p>
						<p class="text-sm text-gray-400">
							Last Modified: {formatDate(data.religion.LastModifiedDate?.toString())}
						</p>
					</div>

					<button
						on:click={deleteReligion}
						class="mt-6 bg-red-700 text-white px-4 py-2 rounded hover:bg-red-600"
					>
						Delete Religion
					</button>
				</div>
			</div>
		</div>
	</div>
{:else}
	<div class="text-center p-8">
		<div class="animate-pulse">
			<p>Loading religion data...</p>
		</div>
	</div>
{/if}
