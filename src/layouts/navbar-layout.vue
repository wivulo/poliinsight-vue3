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
      <ApplicationHeader2/>

      <div class="flex w-full overflow-x-hidden fadeInRight">
        <router-view v-slot="{ Component }">
          <transition>
            <component :is="Component" />
          </transition>
        </router-view>
      </div>
  </div>
</template>
