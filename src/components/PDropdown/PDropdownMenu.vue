<!-- DropdownMenu.vue -->
<script setup>
import { inject, ref, computed, watch, onMounted, nextTick } from 'vue';

const props = defineProps({
  menuClass: String,
  offset: {
    type: Number,
    default: 2
  }
});

const { isOpen, triggerElement, menuElement, calculatePosition } = inject('dropdown');
const menuRef = ref(null);
const dynamicPosition = ref('bottom-left');
const menuStyles = ref({});

const updatePosition = async () => {
  await nextTick();
  dynamicPosition.value = calculatePosition();
  
  // Aplica offsets preventivos
  const triggerRect = triggerElement.value.getBoundingClientRect();
  const menuRect = menuRef.value.getBoundingClientRect();
  
  const styles = {};
  
  // Posicionamento vertical
  if (dynamicPosition.value.startsWith('bottom')) {
    styles.top = `${triggerRect.height + props.offset}px`;
  } else {
    styles.bottom = `${triggerRect.height + props.offset}px`;
  }
  
  // Posicionamento horizontal
  if (dynamicPosition.value.endsWith('right')) {
    styles.right = '0';
  } else {
    styles.left = '0';
  }
  
  menuStyles.value = styles;
};

watch(isOpen, async (newVal) => {
  if (newVal) {
    await updatePosition();
    window.addEventListener('resize', updatePosition);
    window.addEventListener('scroll', updatePosition, true);
  } else {
    window.removeEventListener('resize', updatePosition);
    window.removeEventListener('scroll', updatePosition, true);
  }
});

onMounted(() => {
  menuElement.value = menuRef.value;
});
</script>

<template>
    <transition
      enter-active-class="transition duration-100 ease-out"
      enter-from-class="transform scale-95 opacity-0"
      enter-to-class="transform scale-100 opacity-100"
      leave-active-class="transition duration-75 ease-in"
      leave-from-class="transform scale-100 opacity-100"
      leave-to-class="transform scale-95 opacity-0"
    >
      <div 
        v-show="isOpen"
        ref="menuRef"
        class="absolute z-50 mt-1 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none"
        :class="[dynamicPosition, menuClass]"
        :style="menuStyles"
      >
        <div class="py-1">
          <slot />
        </div>
      </div>
    </transition>
  </template>