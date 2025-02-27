<script lang="ts">
	export let size: 'sm' | 'md' | 'lg' = 'md';
	export let color: 'blue' | 'green' | 'red' | 'yellow' | 'purple' = 'blue';

	const colorClasses = {
		blue: 'bg-blue-500 hover:bg-blue-600',
		green: 'bg-green-500 hover:bg-green-600',
		red: 'bg-red-500 hover:bg-red-600',
		yellow: 'bg-yellow-500 hover:bg-yellow-600',
		purple: 'bg-purple-500 hover:bg-purple-600'
	};
</script>

<div
	class="absolute left-1/2 transform -translate-x-1/2 rounded-full
	{colorClasses[
		color
	]} border-4 border-slate-900 z-10 shadow-lg hover:scale-125 transition-transform duration-200"
>
	<slot></slot>
</div>
