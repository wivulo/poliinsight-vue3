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
  <div class="flex w-full overflow-x-hidden h-full">
    <ApplicationSidebar/>

    <div id="page-wrapper" class="h-full">
      <ApplicationHeader class="bg-zinc-50 application-header"/>

      <div class="flex w-full overflow-x-hidden fadeInRight bg-zinc-50 application-body">
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

.application-header {
  height: 55px;
}

.application-body{
  height: calc(100% - 55px);
}

@media (min-width: 1500px){
  #page-wrapper {
    width: calc(100% - 240px);
    left: 240px;
  }
}
</style>
