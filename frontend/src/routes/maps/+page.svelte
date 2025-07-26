<script lang="ts">
	import { onMount } from 'svelte';

	let mapContainer: HTMLDivElement;
	let mapImage: HTMLImageElement;
	let scale = 1;
	let translateX = 0;
	let translateY = 0;
	let isDragging = false;
	let lastMouseX = 0;
	let lastMouseY = 0;
	let showInstructions = true;

	const minScale = 0.5;
	const maxScale = 3;

	// Custom map image path - replace with your actual map image
	const mapImageSrc = '/maps/ArgonBorder.png';

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
		scale = 1;
		translateX = 0;
		translateY = 0;
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
	<div class="flex gap-4 mb-6">
		<button
			on:click={zoomIn}
			class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
		>
			Zoom In (+)
		</button>
		<button
			on:click={zoomOut}
			class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
		>
			Zoom Out (-)
		</button>
		<button
			on:click={() => (showInstructions = !showInstructions)}
			class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
		>
			{showInstructions ? 'Hide' : 'Show'} Instructions
		</button>
		<button
			on:click={resetMap}
			class="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg transition-colors"
		>
			Reset View
		</button>
	</div>

	<!-- Interactive Map Container -->
	<div
		bind:this={mapContainer}
		role="application"
		class="relative w-full h-96 md:h-[750px] border-2 border-gray-400 rounded-lg overflow-hidden bg-gray-900 cursor-grab select-none"
		on:wheel={zoom}
		on:mousedown={startDrag}
		on:mousemove={drag}
		on:mouseup={endDrag}
		on:mouseleave={endDrag}
	>
		<img
			bind:this={mapImage}
			src={mapImageSrc}
			alt="Interactive Map of Andaren"
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

		<!-- Zoom Level Indicator -->
		<div class="absolute top-4 right-4 bg-black bg-opacity-70 text-white p-2 rounded-lg text-sm">
			Zoom: {Math.round(scale * 100)}%
		</div>
	</div>
</div>
