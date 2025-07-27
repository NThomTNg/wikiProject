<script lang="ts">
	let mapContainer: HTMLDivElement;
	let mapImage: HTMLImageElement;
	let scale = 0.7;
	let translateX = 10;
	let translateY = 4;
	let isDragging = false;
	let lastMouseX = 0;
	let lastMouseY = 0;
	let showInstructions = true;

	const minScale = 0.5;
	const maxScale = 3;

	// Available maps
	const availableMaps = [
		{ name: 'Argon Border', path: '/maps/ArgonBorder.png' },
		{ name: 'Argon Continent', path: '/maps/Argon.png' },
		{ name: 'Argon Regions', path: '/maps/Argonregions.png' },
		{ name: 'World Map', path: '/maps/worldmap.jpg' },
		{ name: 'Solari Holy State', path: '/maps/Solari Holy State.png' },
		{ name: 'Korodirland', path: '/maps/Korodirland.png' },
		{ name: 'Thurigstad', path: '/maps/Thurigstad.png' }
	];

	let selectedMapIndex = 0;
	$: currentMap = availableMaps[selectedMapIndex];

	// Zoom function
	function zoom(event: WheelEvent) {
		event.preventDefault();

		const rect = mapContainer.getBoundingClientRect();
		const mouseX = event.clientX - rect.left;
		const mouseY = event.clientY - rect.top;

		const delta = event.deltaY > 0 ? 0.9 : 1.1;
		const newScale = Math.max(minScale, Math.min(maxScale, scale * delta));

		// Calculate new translation to zoom towards mouse position
		const scaleDiff = newScale - scale;
		translateX -= ((mouseX - translateX) * scaleDiff) / scale;
		translateY -= ((mouseY - translateY) * scaleDiff) / scale;

		scale = newScale;
		updateTransform();
	}

	// Pan functions
	function startDrag(event: MouseEvent) {
		isDragging = true;
		lastMouseX = event.clientX;
		lastMouseY = event.clientY;
		mapContainer.style.cursor = 'grabbing';
	}

	function drag(event: MouseEvent) {
		if (!isDragging) return;

		const deltaX = event.clientX - lastMouseX;
		const deltaY = event.clientY - lastMouseY;

		translateX += deltaX;
		translateY += deltaY;

		lastMouseX = event.clientX;
		lastMouseY = event.clientY;

		updateTransform();
	}

	function endDrag() {
		isDragging = false;
		mapContainer.style.cursor = 'grab';
	}

	function updateTransform() {
		if (mapImage) {
			mapImage.style.transform = `translate(calc(-50% + ${translateX}px), calc(-50% + ${translateY}px)) scale(${scale})`;
		}
	}

	// Reset map to center
	function resetMap() {
		scale = 0.7;
		translateX = 10;
		translateY = 4;
		updateTransform();
	}

	// Zoom in/out buttons
	function zoomIn() {
		scale = Math.min(maxScale, scale * 1.2);
		updateTransform();
	}

	function zoomOut() {
		scale = Math.max(minScale, scale / 1.2);
		updateTransform();
	}
</script>

<div>
	<h1 class="text-4xl font-bold font-serif mt-10 mb-4 text-white">Maps</h1>
	<p class="text-xl font-serif text-gray-300 mb-6">Explore the various maps of Andaren.</p>

	<!-- Map Controls -->
	<div class="flex flex-wrap gap-4 mb-6 items-end">
		<button
			on:click={zoomIn}
			class="bg-sky-700 hover:bg-sky-600 text-white px-4 py-2 rounded-lg transition-colors"
		>
			Zoom In (+)
		</button>
		<button
			on:click={zoomOut}
			class="bg-sky-700 hover:bg-sky-600 text-white px-4 py-2 rounded-lg transition-colors"
		>
			Zoom Out (-)
		</button>
		<button
			on:click={() => (showInstructions = !showInstructions)}
			class="bg-sky-700 hover:bg-sky-600 text-white px-4 py-2 rounded-lg transition-colors"
		>
			{showInstructions ? 'Hide' : 'Show'} Instructions
		</button>
		<button
			on:click={resetMap}
			class="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg transition-colors"
		>
			Reset View
		</button>

		<!-- Map Selector -->
		<div class="flex flex-col ml-auto">
			<label for="map-select" class="text-white font-serif text-sm mb-1">Choose a Map:</label>
			<select
				id="map-select"
				bind:value={selectedMapIndex}
				on:change={() => resetMap()}
				class="bg-gray-800 text-white border border-gray-600 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
			>
				{#each availableMaps as map, index}
					<option value={index}>{map.name}</option>
				{/each}
			</select>
		</div>
	</div>

	<!-- Interactive Map Container -->
	<div
		bind:this={mapContainer}
		role="application"
		class="relative w-full h-96 md:h-[750px] border border-black rounded-lg overflow-hidden bg-gray-900 cursor-grab select-none"
		on:wheel={zoom}
		on:mousedown={startDrag}
		on:mousemove={drag}
		on:mouseup={endDrag}
		on:mouseleave={endDrag}
	>
		<img
			bind:this={mapImage}
			src={currentMap.path}
			alt="Interactive Map of {currentMap.name}"
			class="absolute top-1/2 left-1/2 max-w-none transition-transform duration-100 ease-out"
			style="transform-origin: center center; transform: translate(calc(-50% + {translateX}px), calc(-50% + {translateY}px)) scale({scale});"
			draggable="false"
		/>

		<!-- Map Instructions -->
		{#if showInstructions}
			<div class="absolute top-4 left-4 bg-black bg-opacity-70 text-white p-3 rounded-lg text-sm">
				<p class="font-semibold mb-1">Map Controls:</p>
				<p>• Mouse wheel: Zoom in/out</p>
				<p>• Click & drag: Pan around</p>
				<p>• Use buttons above for precise control</p>
			</div>
		{/if}

		<!-- Map Info -->
		<div class="absolute top-4 right-4 bg-black bg-opacity-70 text-white p-2 rounded-lg text-sm">
			<p class="font-semibold">{currentMap.name}</p>
			<p>Zoom: {Math.round(scale * 100)}%</p>
		</div>
	</div>
</div>
