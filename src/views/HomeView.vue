<script setup>
import { ref, computed } from 'vue';
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
import { event } from '@/store/modules/event';

document.title = 'Página Inicial';

// const logo = ref(logo)
const events = ref([])
const busy = ref(false);

function fetchEvents() {
  busy.value = true;
  EventServices.public_index()
    .then((response) => {
      events.value = response.data?.reduce((acc, event) => {
        if (!acc[event.department.name]) {
          acc[event.department.name] = [];
        }
        if(acc[event.department.name].length < 7)
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
fetchEvents();
</script>

<template>
  <main class="flex w-full flex-col items-center">
    <div class="flex flex-col w-full max-w-[1366px]">
      <HomeHero />

      <div class="mb-10 relative px-6">
        <CarouselView />
      </div>

      <EventList :header="'Engenharias'" :events="events['Engenharias']" :busy="busy" />

      <EventList :header="'Ciências e Tecnologias da Saúde'" :events="events['Ciências da Educação']" :busy="busy" />

      <EventList :header="'Gestão e Desenvolvimento Humano'" :events="events['Gestão e Desenvolvimento Humano']" :busy="busy" />

      <EventList :header="'Ciências da Educação'" :events="events['Ciências da Educação']" :busy="busy" />

  
      <div class="flex p-4 py-10 bg-surface-100">

        <div class="basis-1/4">
          <ul class="flex gap-2 flex-col text-base">
            <li>Lorem ipsum dolor</li>
            <li>sit amet consectetur</li>
            <li>adipisicing elit</li>
            <li>Asperiores nisi</li>
          </ul>
        </div>

        <div class="basis-1/4">
          <ul class="flex gap-2 flex-col text-base">
            <li>possimus natus</li>
            <li>quibusdam minus</li>
            <li>quam tempora</li>
            <li>beatae et debitis</li>
          </ul>
        </div>

        <div class="basis-1/4">
          <ul class="flex gap-2 flex-col text-base">
            <li>Termos e Serviços</li>
            <li>Politicas de Segurança</li>
            <li class="text-body-tertiary">.</li>
            <li class="text-body-tertiary">.</li>
          </ul>
        </div>

        <div class="basis-1/4 flex items-center justify-center">
          <Image :src="logo" alt="Responsive image"  width="100" height="100" />
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
