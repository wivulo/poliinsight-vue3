<script setup>
defineProps({
  event: Object
});
</script>

<template>
  <div class="p-4 sm:p-6 border rounded-md shadow hover:shadow-lg transition">
    <!-- Imagem responsiva -->
    <img :src="event.imageURL" :alt="event.name" class="w-full h-48 object-cover sm:h-56 md:h-64" />
    <div class="mt-4">
      <!-- Título com truncamento para evitar overflow em telas pequenas -->
      <h3 class="text-lg font-bold text-slate-800 truncate" :title="event.name">{{ event.name }}</h3>
      <p class="text-sm text-slate-600">{{ event.location }}</p>
      <div class="mt-2">
        <span class="text-xs font-medium rounded-full px-2 py-1 bg-blue-100 text-blue-800">
          {{ event.category?.name }}
        </span>
      </div>
    </div>
  </div>
</template>
