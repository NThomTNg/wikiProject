<script>
	import '../app.css';
	let isMenuOpen = false;

	function toggleMenu() {
		isMenuOpen = !isMenuOpen;
	}

	const navItems = [
		{ href: '/', label: 'Home' },
		{ href: '/characters', label: 'Characters' },
		{ href: '/nations', label: 'Nations' },
		{ href: '/locations', label: 'Locations' },
		{ href: '/religions', label: 'Religions' },
		{ href: '/events', label: 'Events' },
		{ href: '/history', label: 'History' }
	];
</script>

<div
	class="relative min-h-screen flex bg-cover bg-center bg-no-repeat"
	style="background-image: url('/misc/bglandscape.jpg');"
>
	<div class="absolute inset-0 bg-black opacity-50"></div>

	<nav class="fixed top-0 left-0 h-full z-20 bg-slate-600 shadow w-60" aria-label="Main Navigation">
		<div class="flex flex-col h-full">
			<div class="flex items-center justify-between h-16 px-4">
				<a href="/" class="flex-shrink-0 flex items-center">
					<span class="text-xl text-white font-bold px-6">World of Andaren</span>
				</a>
			</div>
			<img src="/misc/logo.png" alt="logo" class="h-auto w-36 ml-12" />
			<div class="flex-1 px-2 py-4">
				<div class="space-y-1 flex flex-col items-center">
					<a
						href="/characters"
						class="block text-lg text-white px-3 py-2 relative after:block after:w-0 after:h-0.5 after:bg-sky-500 after:transition-all after:duration-300 hover:after:w-full"
						>Characters</a
					>
					<a
						href="/nations"
						class="block text-lg text-white px-3 py-2 relative after:block after:w-0 after:h-0.5 after:bg-sky-500 after:transition-all after:duration-300 hover:after:w-full"
					>
						Nations
					</a>
					<a
						href="/locations"
						class="block text-lg text-white px-3 py-2 relative after:block after:w-0 after:h-0.5 after:bg-sky-500 after:transition-all after:duration-300 hover:after:w-full"
					>
						Locations
					</a>
					<a
						href="/religions"
						class="block text-lg text-white px-3 py-2 relative after:block after:w-0 after:h-0.5 after:bg-sky-500 after:transition-all after:duration-300 hover:after:w-full"
						>Religions</a
					>
					<a
						href="/events"
						class="block text-lg text-white px-3 py-2 relative after:block after:w-0 after:h-0.5 after:bg-sky-500 after:transition-all after:duration-300 hover:after:w-full"
						>Events</a
					>
					<a
						href="/history"
						class="block text-lg text-white px-3 py-2 relative after:block after:w-0 after:h-0.5 after:bg-sky-500 after:transition-all after:duration-300 hover:after:w-full"
						>History</a
					>
				</div>
			</div>
		</div>
	</nav>

	<main class="relative z-10 flex-1 max-w-7xl ml-90 mx-auto py-6 sm:px-6 lg:px-8">
		<slot />
	</main>
</div>
