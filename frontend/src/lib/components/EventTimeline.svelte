<script lang="ts">
	import type { EventWithRelations } from '$lib/types';

	export let events: EventWithRelations[] = [];
	export let onEventClick: (event: EventWithRelations) => void;

	$: sortedEvents = [...events].sort((a, b) => {
		if (!a.EventDate) return 1;
		if (!b.EventDate) return -1;
		return a.EventDate.localeCompare(b.EventDate);
	});
</script>

<div class="relative pb-10">
	<div
		class="absolute left-1/2 transform -translate-x-1/2 h-full w-1 bg-slate-600 sm:left-1/2 md:left-1/2"
	></div>

	{#each sortedEvents as event, i}
		<div
			class="relative mb-12 flex items-center {i % 2 === 0 ? 'flex-row' : 'flex-row-reverse'} 
                 sm:flex-row-reverse sm:even:flex-row
                 md:flex-row-reverse md:even:flex-row"
			on:click={() => onEventClick(event)}
			on:keypress={(e) => {
				if (e.key === 'Enter' || e.key === ' ') onEventClick(event);
			}}
			tabindex="0"
			role="button"
			aria-label={`View details for event ${event.Title}`}
		>
			<div
				class="{i % 2 === 0 ? 'mr-8' : 'ml-8'} 
                      sm:ml-8 sm:even:mr-8 sm:w-5/12
                      md:ml-8 md:even:mr-8
                      w-10/1 md:w-5/12"
			>
				<div
					class="bg-slate-800 bg-opacity-40 border border-black rounded-lg p-4 cursor-pointer transition-all duration-300 transform hover:-translate-y-1"
				>
					<h2 class="text-xl font-semibold text-white mb-2">{event.Title}</h2>

					{#if event.EventDate}
						<p class="text-blue-400 font-medium mb-2">{event.EventDate}</p>
					{/if}

					{#if event.Description}
						<p class="text-gray-300 line-clamp-3">
							{event.Description}
						</p>
					{:else}
						<p class="text-gray-500 italic">No description</p>
					{/if}

					<div class="mt-3 flex flex-wrap items-center text-sm">
						{#if event.NationName}
							<span class="text-blue-400 mr-2">{event.NationName}</span>
						{/if}
						{#if event.NationName && event.LocationName}
							<span class="text-gray-500 mx-1">•</span>
						{/if}
						{#if event.LocationName}
							<span class="text-blue-400">{event.LocationName}</span>
						{/if}
					</div>
				</div>
			</div>

			<div
				class="absolute left-1/2 transform -translate-x-1/2 w-4 h-4 rounded-full bg-blue-500
                     border-4 border-slate-900 z-10 shadow-lg hover:scale-125 transition-transform duration-200
                     sm:left-1/2 md:left-1/2"
			></div>

			<div class="hidden sm:block sm:w-5/12 md:w-5/12"></div>
		</div>
	{/each}
</div>
