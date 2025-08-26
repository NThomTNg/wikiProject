<script>
	import '../app.css';
	let isMenuOpen = false;

	function toggleMenu() {
		isMenuOpen = !isMenuOpen;
	}

	function closeMenu() {
		isMenuOpen = false;
	}
</script>

<div
	class="relative min-h-screen flex bg-cover bg-center bg-no-repeat"
	style="background-image: url('/misc/bglandscape.jpg');"
>
	<div class="absolute inset-0 bg-black opacity-50"></div>

	<!-- Mobile menu button -->
	<button
		class="fixed top-4 left-4 z-30 lg:hidden bg-slate-600 text-white p-2 rounded-md border border-slate-400"
		on:click={toggleMenu}
		aria-label="Toggle menu"
	>
		<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
			<path
				stroke-linecap="round"
				stroke-linejoin="round"
				stroke-width="2"
				d="M4 6h16M4 12h16M4 18h16"
			></path>
		</svg>
	</button>

	<!-- Mobile overlay -->
	{#if isMenuOpen}
		<div
			class="fixed inset-0 bg-black bg-opacity-50 z-20 lg:hidden"
			on:click={closeMenu}
			on:keydown={(e) => e.key === 'Escape' && closeMenu()}
			role="button"
			tabindex="0"
		></div>
	{/if}

	<!-- Sidebar Navigation -->
	<nav
		class="fixed top-0 left-0 h-full z-20 bg-slate-600 shadow border-2 border-slate-900 transition-transform duration-300 ease-in-out
			   w-60 lg:translate-x-0 {isMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}"
		aria-label="Main Navigation"
	>
		<div class="flex flex-col h-full">
			<div class="flex items-center justify-between h-16 px-4">
				<a href="/" class="flex-shrink-0 flex items-center" on:click={closeMenu}>
					<span class="text-lg lg:text-xl text-white font-bold px-2 lg:px-6">World of Andaren</span>
				</a>
			</div>
			<div class="flex justify-center mb-4">
				<img src="/misc/logo.png" alt="logo" class="h-auto w-24 lg:w-36" />
			</div>
			<div class="flex-1 px-2 py-4">
				<div class="space-y-1 flex flex-col items-center">
					<a
						href="/characters"
						class="block text-base lg:text-lg text-white px-3 py-2 relative after:block after:w-0 after:h-0.5 after:bg-sky-500 after:transition-all after:duration-300 hover:after:w-full"
						on:click={closeMenu}>Characters</a
					>
					<a
						href="/nations"
						class="block text-base lg:text-lg text-white px-3 py-2 relative after:block after:w-0 after:h-0.5 after:bg-sky-500 after:transition-all after:duration-300 hover:after:w-full"
						on:click={closeMenu}
					>
						Nations
					</a>
					<a
						href="/locations"
						class="block text-base lg:text-lg text-white px-3 py-2 relative after:block after:w-0 after:h-0.5 after:bg-sky-500 after:transition-all after:duration-300 hover:after:w-full"
						on:click={closeMenu}
					>
						Locations
					</a>
					<a
						href="/religions"
						class="block text-base lg:text-lg text-white px-3 py-2 relative after:block after:w-0 after:h-0.5 after:bg-sky-500 after:transition-all after:duration-300 hover:after:w-full"
						on:click={closeMenu}>Religions</a
					>
					<a
						href="/events"
						class="block text-base lg:text-lg text-white px-3 py-2 relative after:block after:w-0 after:h-0.5 after:bg-sky-500 after:transition-all after:duration-300 hover:after:w-full"
						on:click={closeMenu}>Events</a
					>
					<a
						href="/history"
						class="block text-base lg:text-lg text-white px-3 py-2 relative after:block after:w-0 after:h-0.5 after:bg-sky-500 after:transition-all after:duration-300 hover:after:w-full"
						on:click={closeMenu}>History</a
					>
				</div>
			</div>
		</div>
	</nav>

	<main class="relative z-10 flex-1 max-w-7xl lg:ml-60 mx-auto py-6 px-4 sm:px-6 lg:px-8">
		<slot />
	</main>
</div>
