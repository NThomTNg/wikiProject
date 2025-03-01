<script lang="ts">
	export let cols = 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3';
	export let gap = 'gap-4';
</script>

<div class="grid {cols} {gap}">
	<slot />
</div>
