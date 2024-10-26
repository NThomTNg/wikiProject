<script>
	import '../app.css';
</script>

<div class="min-h-screen">
	<header class="bg-white shadow">
		<nav class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
			<div class="flex justify-between h-16">
				<div class="flex">
					<a href="/" class="flex-shrink-0 flex items-center">
						<span class="text-xl font-bold">Fantasy Wiki</span>
					</a>
					<div class="hidden sm:ml-6 sm:flex sm:space-x-8">
						<a href="/characters" class="px-3 py-2 hover:text-blue-600">Characters</a>
						<a href="/nations" class="px-3 py-2 hover:text-blue-600">Nations</a>
						<a href="/locations" class="px-3 py-2 hover:text-blue-600">Locations</a>
						<a href="/religions" class="px-3 py-2 hover:text-blue-600">Religions</a>
						<a href="/events" class="px-3 py-2 hover:text-blue-600">Events</a>
					</div>
				</div>
			</div>
		</nav>
	</header>

	<main class="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
		<slot />
	</main>
</div>
