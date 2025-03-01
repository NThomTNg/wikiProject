<script lang="ts">
	import { createEventDispatcher } from 'svelte';

	export let href: string;
	export let title: string;
	export let imageUrl: string | null = null;
	export let customClass: string = '';
	export let customTitleClass: string = '';
	export let useDefaultStyles: boolean = true;

	const dispatch = createEventDispatcher();

	function handleClick(e: MouseEvent) {
		if (!href || href === '#' || href === '') {
			e.preventDefault();
			dispatch('boxClick');
		}
	}

	// Default styles that can be completely opted out of
	const defaultStyles = useDefaultStyles
		? 'block bg-slate-700 bg-opacity-80 border-slate-800 border p-4 rounded-lg shadow overflow-hidden hover:shadow-xl transition-all duration-300 hover:bg-slate-800 transform hover:-translate-y-1 cursor-pointer'
		: '';
	const defaultTitleClass = useDefaultStyles
		? 'text-xl font-semibold mb-2 text-center text-white'
		: '';

	// Combined classes giving priority to custom styles
	const combinedClasses = `${defaultStyles} ${customClass}`.trim();
	const combinedTitleClass = `${defaultTitleClass} ${customTitleClass}`.trim();
</script>

<a {href} on:click={handleClick} class={combinedClasses}>
	<h2 class={combinedTitleClass}>{title}</h2>

	{#if imageUrl}
		<img src={imageUrl} alt={title} class="w-full h-auto object-cover rounded mb-2" />
	{/if}

	<div class="item-details">
		<slot />
	</div>
</a>
