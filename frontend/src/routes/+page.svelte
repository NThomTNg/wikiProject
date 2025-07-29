<script lang="ts">
	const images = [
		{
			Image: '/locations/1L.png',
			title: 'Nations'
		},
		{
			Image: '/locations/4L.png',
			title: 'Events'
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
	<h1 class="text-4xl font-bold font-serif mt-10 mb-4 text-white">
		Welcome to the world of Andaren
	</h1>
	<p class="text-xl font-serif text-gray-300">
		Explore the world of Andaren with its rich history, diverse cultures, and unique locations.
	</p>
</div>

<div class="relative grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 pb-10">
	{#each images as { Image, title }}
		<div
			class="relative border border-black rounded-lg overflow-hidden shadow-lg transition-transform transform hover:border-sky-800 hover:shadow-lg hover:shadow-blue-400/30"
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
								: title === 'Events'
									? '/events'
									: title === 'Maps'
										? '/maps'
										: Image}
				target={title === 'Characters' ||
				title === 'Nations' ||
				title === 'Locations' ||
				title === 'Religions' ||
				title === 'Events' ||
				title === 'Maps'
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

<div class="flex flex-col md:flex-row gap-6 mt-10 mb-5 max-w-6xl mx-auto">
	<div
		class="bg-amber-50 border border-black rounded-md p-3 shadow-md font-serif text-justify flex-1"
	>
		The World of Andaren is filled with rich history and diverse cultures. Explore its nations,
		characters, and locations to uncover the stories that shape this vibrant world. The history
		spans millennia, with each era contributing to the tapestry of Andaren's past. From the rise and
		fall of empires to the legends of heroes and gods, every entry in in the history section offers
		a glimpse into the events that have shaped this world. Browse the wiki to learn more about the
		fascinating history of Andaren and its people.
	</div>
	<div
		class="bg-amber-50 border border-black rounded-md p-3 shadow-md font-serif text-justify flex-1"
	>
		You can also add in new wiki entries to expand the lore and share your own stories within this
		world with the easy wiki features. Add in lore and pictures to enrich the world and its history.
		Feel free to contribute and help build the world of Andaren together with the community.
	</div>
</div>
