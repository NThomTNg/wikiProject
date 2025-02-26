<script lang="ts">
	const images = [
		{
			Image: '/locations/1L.png',
			title: 'Nations'
		},
		{
			Image: '/locations/4L.png',
			title: 'Stories'
		},
		{
			Image: '/characters/1C.png',
			title: 'Characters'
		},
		{
			Image: '/characters/6C.png',
			title: 'Religions'
		},
		{
			Image: '/maps/Argon.png',
			title: 'Maps'
		},
		{
			Image: '/locations/3L.png',
			title: 'Locations'
		}
	];
</script>

<div class="relative z-10 text-center mb-20">
	<h1 class="text-4xl font-bold mt-10 mb-4 text-white">Welcome to the world of Andaren</h1>
	<p class="text-xl text-gray-300">
		Explore the world of Andaren with its rich history, diverse cultures, and unique locations.
	</p>
</div>

<div class="relative grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 pb-10">
	{#each images as { Image, title }}
		<div
			class="relative rounded-lg overflow-hidden shadow-lg transition-transform transform hover:-translate-y-1 hover:scale-110 hover:shadow-lg hover:shadow-blue-400/30"
		>
			<a
				href={title === 'Characters'
					? '/characters'
					: title === 'Nations'
						? '/nations'
						: title === 'Locations'
							? '/locations'
							: title === 'Religions'
								? '/religions'
								: Image}
				target={title === 'Characters' ||
				title === 'Nations' ||
				title === 'Locations' ||
				title === 'Religions'
					? '_self'
					: '_blank'}
				class="relative bg-gray-800 rounded-lg overflow-hidden shadow-lg group"
			>
				<img
					src={Image}
					alt={title}
					class="w-full h-64 object-cover transition-all duration-300 filter grayscale group-hover:grayscale-0"
				/>
				<div
					class="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all duration-300"
				></div>
				<div
					class="absolute top-0 left-0 w-full h-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300"
				>
					<h3 class="text-white text-2xl font-bold ml-96 mt-56">{title}</h3>
				</div>
			</a>
		</div>
	{/each}
</div>
