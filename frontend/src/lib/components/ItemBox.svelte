<script lang="ts">
	import { createEventDispatcher } from 'svelte';

	export let href: string;
	export let title: string;
	export let imageUrl: string | null = null;
	export let customTitleClass: string = 'text-white';

	const dispatch = createEventDispatcher();

	function handleClick(e: MouseEvent) {
		if (!href || href === '#' || href === '') {
			e.preventDefault();
			dispatch('boxClick');
		}
	}
</script>

<a
	{href}
	on:click={handleClick}
	class="bg-slate-700 bg-opacity-80 border-slate-800 shadow text-white block border rounded-lg p-4
	overflow-hidden cursor-pointer hover:shadow-xl transition-all duration-300 hover:bg-slate-800 transform hover:-translate-y-1"
>
	<h2 class="text-xl font-semibold mb-2 text-center {customTitleClass}">{title}</h2>

	{#if imageUrl}
		<img src={imageUrl} alt={title} class="w-full h-auto object-cover rounded mb-2" />
	{/if}

	<div class="item-details">
		<slot />
	</div>
</a>
