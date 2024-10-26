<script lang="ts">
    const categories = [
      { title: 'Characters', href: '/characters', description: 'Explore the various characters in our fantasy world' },
      { title: 'Nations', href: '/nations', description: 'Discover the different nations and their histories' },
      { title: 'Locations', href: '/locations', description: 'Visit the many locations across the realm' },
      { title: 'Religions', href: '/religions', description: 'Learn about the different faiths and beliefs' },
      { title: 'Events', href: '/events', description: 'Browse through historical events and timeline' }
    ];
  </script>
  
  <div class="text-center mb-12">
    <h1 class="text-4xl font-bold mb-4">Welcome to Fantasy Wiki</h1>
    <p class="text-xl text-gray-600">Explore our vast collection of fantasy lore</p>
  </div>
  
  <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
    {#each categories as { title, href, description }}
      <a {href} class="card group">
        <h2 class="text-2xl font-semibold mb-2 group-hover:text-blue-600">{title}</h2>
        <p class="text-gray-600">{description}</p>
      </a>
    {/each}
  </div>