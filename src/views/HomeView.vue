<script setup>
import { ref, computed, onMounted } from 'vue';
// import { ProductService } from '@/service/ProductService';
import CarouselView from '@/components/Carousel/CarouselView.vue'
import Card from 'primevue/card';
import Button from 'primevue/button';
import Image from 'primevue/image';
import logo from "@/assets/logo_without_bg.png"
import EventServices from '@/services/EventServices';
import InputText from 'primevue/inputtext';
import InputGroup from 'primevue/inputgroup';
import InputGroupAddon from 'primevue/inputgroupaddon';
import EventList from './home/components/EventList.vue';
import HomeHero from './home/components/HomeHero.vue';
import Carousel from 'primevue/carousel';
import Tag from 'primevue/tag';
import CardRoot from '@/components/PCard/CardRoot.vue';
import PLoading from '@/components/PLoading.vue';

document.title = 'Página Inicial';

// const logo = ref(logo)
const events = ref([])
const filteredEvents = ref([])
const busy = ref(false);

function fetchEvents() {
  busy.value = true;
  EventServices.public_index()
    .then((response) => {
      events.value = response.data
      filteredEvents.value = events.value?.reduce((acc, event) => {
        if (!acc[event.department.name]) {
          acc[event.department.name] = [];
        }
        if (acc[event.department.name].length < 7)
          acc[event.department.name].push(event);

        return acc;
      }, {});;
    })
    .catch((error) => {
      console.log(error);
    })
    .finally(() => {
      busy.value = false;
    });
}

const products = ref();
const responsiveOptions = ref([
  {
    breakpoint: '1400px',
    numVisible: 2,
    numScroll: 1
  },
  {
    breakpoint: '1199px',
    numVisible: 3,
    numScroll: 1
  },
  {
    breakpoint: '767px',
    numVisible: 2,
    numScroll: 1
  },
  {
    breakpoint: '575px',
    numVisible: 1,
    numScroll: 1
  }
]);

onMounted(() => {
  fetchEvents();
})

</script>

<template>
  <main class="flex w-full flex-col items-center px-4 sm:px-6 md:px-8">
    <div class="flex flex-col w-full max-w-[1366px] px-2 sm:px-4">
      <HomeHero />

      <div class="mb-10 relative px-4 py-6">
        <!-- <CarouselView /> -->

        <div v-if="busy" class="w-full flex justify-center items-center h-28">
          <PLoading />
        </div>

        <Carousel :value="events" :numVisible="3" :numScroll="1" :responsiveOptions="responsiveOptions">
          <template #item="slotProps">
            <div class="w-full sm:w-[380px] h-auto sm:h-[370px]">
              <div class="w-full h-full rounded-md">
                <div class="h-[200px] md:h-[300px] w-full">
                  <img :src="slotProps.data?.imageURL" :alt="slotProps.data.name"
                    class="border-round object-contain w-full h-full" />
                </div>

                <div class="px-10 pt-2">
                  <div class="text-sm font-bold text-surface-900 cursor-pointer">
                    <RouterLink 
                      :to="{ name: 'public.event.show', params: { id: slotProps.data.id } }">
                      {{ slotProps.data.name }}
                    </RouterLink>
                  </div>

                  <div class="flex flex-col justify-content-between align-items-center">
                    <div class="flex flex-col gap-1 text-surface-500 text-xs mt-2">
                      <p><i class="pi pi-map-marker"></i> {{ slotProps.data.location }}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </template>
        </Carousel>
      </div>

      <EventList :header="'Engenharias'" :events="filteredEvents['Engenharias']" :busy="busy" />

      <EventList :header="'Ciências e Tecnologias da Saúde'" :events="filteredEvents['Ciências da Educação']"
        :busy="busy" />

      <EventList :header="'Gestão e Desenvolvimento Humano'" :events="filteredEvents['Gestão e Desenvolvimento Humano']"
        :busy="busy" />

      <EventList :header="'Ciências da Educação'" :events="filteredEvents['Ciências da Educação']" :busy="busy" />


      <div id="footer-1" class="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 py-10 bg-surface-100">
        <div class="flex justify-center">
          <ul class="flex gap-2 flex-col text-base">
            <li>Lorem ipsum dolor</li>
            <li>sit amet consectetur</li>
            <li>adipisicing elit</li>
            <li>Asperiores nisi</li>
          </ul>
        </div>
        <div class="flex justify-center">
          <ul class="flex gap-2 flex-col text-base">
            <li>possimus natus</li>
            <li>quibusdam minus</li>
            <li>quam tempora</li>
            <li>beatae et debitis</li>
          </ul>
        </div>
        <div class="flex justify-center">
          <ul class="flex gap-2 flex-col text-base">
            <li>Termos e Serviços</li>
            <li>Politicas de Segurança</li>
            <li class="text-body-tertiary">.</li>
            <li class="text-body-tertiary">.</li>
          </ul>
        </div>
        <div class="flex justify-center">
          <Image :src="logo" alt="Responsive image" width="100" height="100" />
        </div>
      </div>
    </div>

    <footer class="w-full h-24 flex items-center justify-center gap-3 flex-col border-top bg-zinc-200">
      <p class="text-center text-sm text-slate-800">
        Maintained by Instituto Superior politecnico de Benguela.
      </p>
      <p class="text-center text-sm text-slate-800">
        Currently v1.0.0 And powered by WIVULO. Todos os direitos reservados - © 2025.
      </p>
    </footer>
  </main>
</template>
