<script lang="ts">
	const images = [
		{
			Image: '/locations/1L.png'
		},
		{
			Image: '/locations/2L.png'
		},
		{
			Image: '/characters/1C.png'
		},
		{
			Image: '/characters/2C.png'
		},
		{
			Image: '/maps/Argon.png'
		},
		{
			Image: '/locations/3L.png'
		}
	];
</script>

<div class="relative z-10 text-center mb-20">
	<h1 class="text-4xl font-bold mt-10 mb-4 text-white">Welcome to the world of Andaren</h1>
	<p class="text-xl text-gray-300">
		Explore the vast world of Andaren by clicking into the different categories.
	</p>
</div>

<div class="relative grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 pb-10">
	{#each images as { Image }}
		<div
			class="relative rounded-lg overflow-hidden shadow-lg transition-transform transform hover:-translate-y-1 hover:scale-110 hover:shadow-lg hover:shadow-green-700/30"
		>
			<a
				href={Image}
				target="_blank"
				class="relative bg-gray-800 rounded-lg overflow-hidden shadow-lg"
			>
				<img src={Image} alt="Image" class="w-full h-64 object-cover" />
				<div class="absolute inset-050"></div>
				<div class="absolute inset-0 flex items-center justify-center"></div>
			</a>
		</div>
	{/each}
</div>
