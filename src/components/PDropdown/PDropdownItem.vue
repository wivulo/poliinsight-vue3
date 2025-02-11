<!-- DropdownItem.vue -->
<template>
    <button
      @click="handleClick"
      class="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900 focus:outline-none focus:bg-gray-100 focus:text-gray-900"
      :class="itemClass"
      role="menuitem"
    >
      <slot />
    </button>
  </template>
  
  <script setup>
  import { inject } from 'vue';
  
  const props = defineProps({
    itemClass: {
      type: String,
      default: ''
    }
  });
  
  const { close } = inject('dropdown');
  
  const handleClick = (event) => {
    close();
    emit('click', event);
  };
  
  const emit = defineEmits(['click']);
  </script>