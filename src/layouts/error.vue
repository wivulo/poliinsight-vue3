<script>
export default {
  name: 'ErrorLayout',
}
</script>

<template>
  <div class="flex flex-col items-center justify-center h-screen">
    <router-view v-slot="{ Component }">
        <transition>
          <component :is="Component" />
        </transition>
    </router-view>
  </div>
</template>
