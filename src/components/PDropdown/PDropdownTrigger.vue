<script setup>
import { inject, ref, onMounted } from 'vue';

const { isOpen, toggle, triggerElement } = inject('dropdown');
const triggerRef = ref(null);

onMounted(() => {
  triggerElement.value = triggerRef.value;
});
</script>
  
<template>
    <div ref="triggerRef" @click="toggle">
      <slot :is-open="isOpen" />
    </div>
</template>
