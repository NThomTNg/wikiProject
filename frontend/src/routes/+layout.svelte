<script>
	import '../app.css';
	let isMenuOpen = false;

	function toggleMenu() {
		isMenuOpen = !isMenuOpen;
	}
</script>

<div
	class="relative min-h-screen flex bg-cover bg-center bg-no-repeat"
	style="background-image: url('/misc/bglandscape.jpg');"
>
	<div class="absolute inset-0 bg-black opacity-50"></div>
	<nav class="relative z-10 bg-slate-600 shadow w-60" aria-label="Main Navigation">
		<div class="flex flex-col h-full">
			<div class="flex items-center justify-between h-16 px-4">
				<a href="/" class="flex-shrink-0 flex items-center">
					<span class="text-xl text-white font-bold px-6">World of Andaren</span>
				</a>
			</div>
			<img src="/misc/logo.png" alt="logo" class="h-auto w-36 ml-12" />
			<div class="flex-1 px-2 py-4">
				<div class="space-y-1 flex flex-col items-center">
					<a href="/characters" class="block text-lg text-white px-3 py-2 hover:text-green-700"
						>Characters</a
					>
					<a href="/nations" class="block text-lg text-white px-3 py-2 hover:text-green-700"
						>Nations</a
					>
					<a href="/locations" class="block text-lg text-white px-3 py-2 hover:text-green-700"
						>Locations</a
					>
					<a href="/religions" class="block text-lg text-white px-3 py-2 hover:text-green-700"
						>Religions</a
					>
					<a href="/events" class="block text-lg text-white px-3 py-2 hover:text-green-700"
						>Events</a
					>
				</div>
			</div>
		</div>
	</nav>

	<main class="relative z-10 flex-1 max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
		<slot />
	</main>
</div>
