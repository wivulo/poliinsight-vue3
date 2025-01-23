<script>
import ApplicationHeader from './components/ApplicationHeader.vue';
import ApplicationHeader2 from './components/ApplicationHeader2.vue';

export default {
  name: 'NavbarLayout',
  components: {
    ApplicationHeader,
    ApplicationHeader2,
  },
};
</script>

<template>
  <div class="flex flex-col w-full overflow-x-hidden">
      <ApplicationHeader2 class="bg-gray-50 application-header border-b border-black/10"/>

      <div class="flex w-full overflow-x-hidden fadeInRight bg-gray-100">
        <router-view v-slot="{ Component }">
          <transition>
            <component :is="Component" />
          </transition>
        </router-view>
      </div>
  </div>
</template>
