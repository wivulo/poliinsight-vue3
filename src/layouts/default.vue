<script>
import ApplicationHeader from './components/ApplicationHeader.vue';
import ApplicationSidebar from './components/ApplicationSidebar.vue';

export default {
  name: 'MainLayout',
  components: {
    ApplicationHeader,
    ApplicationSidebar,
  },
};
</script>

<template>
  <div class="flex w-full overflow-x-hidden">
    <ApplicationSidebar/>

    <div id="page-wrapper" class="gray-bg">
      <ApplicationHeader/>

      <div class="flex w-full overflow-x-hidden fadeInRight">
        <router-view v-slot="{ Component }">
          <transition>
            <component :is="Component" />
          </transition>
        </router-view>
      </div>
    </div>
  </div>
</template>

<style>
#page-wrapper {
    padding: 0 5px;
    position: relative !important;
    flex-shrink: 1;
    width: calc(100% - 230px);
    left: 230px;
}
</style>
