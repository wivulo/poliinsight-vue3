<!-- DropdownRoot.vue -->
<script setup>
import { provide, ref, onMounted, onBeforeUnmount } from 'vue';
import vClickOutside from '@/directives/clickOutside'; // Não esqueça de importar

const isOpen = ref(false);
const triggerElement = ref(null);
const menuElement = ref(null);

// Adicione estas funções
const toggle = () => {
  isOpen.value = !isOpen.value;
};

const close = () => {
  isOpen.value = false;
};

// Novo: Função para reposicionar dinamicamente
const calculatePosition = () => {
  if (!triggerElement.value || !menuElement.value) return;

  const triggerRect = triggerElement.value.getBoundingClientRect();
  const menuRect = menuElement.value.getBoundingClientRect();
  const viewport = {
    width: window.innerWidth,
    height: window.innerHeight
  };

  // Lógica de posicionamento vertical
  let vertical = 'bottom';
  if (triggerRect.bottom + menuRect.height > viewport.height) {
    vertical = 'top';
  }

  // Lógica de posicionamento horizontal
  let horizontal = 'left';
  if (triggerRect.left + menuRect.width > viewport.width) {
    horizontal = 'right';
  }

  return `${vertical}-${horizontal}`;
};

provide('dropdown', {
  isOpen,
  toggle,
  close,
  triggerElement,
  menuElement,
  calculatePosition
});
</script>

<template>
    <div class="relative" v-click-outside="close">
      <slot />
    </div>
</template>