<script setup>
import { ref } from 'vue';
import CarouselView from '@/components/Carousel/CarouselView.vue'
import Card from 'primevue/card';
import Button from 'primevue/button';
import Image from 'primevue/image';
import logo from "@/assets/logo_without_bg.png"
import EventServices from '@/services/EventServices';

document.title = 'Página Inicial';

// const logo = ref(logo)
const events = ref([])
const busy = ref(false);

function fetchEvents() {
  busy.value = true;
  EventServices.public_index()
    .then((response) => {
      events.value = response.data;
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
  <main class="flex flex-col w-full">
    <div class="flex flex-col justify-center h-48 mb-4">
      <div class="px-4">
        <p class="text-4xl">Descubra, participe, conecte-se.</p>
        <p>Encontre os eventos mais relevantes da sua área</p>
      </div>
    </div>

    <div class="mb-10 relative">
      <CarouselView />
    </div>

    <div class="mb-3 px-4 mt-10">
      <div class="my-2 mb-2 border-b border-surface-100">
        <p class="text-base">Eventos recentes</p>
      </div>

        <div>
          <Card
            style="max-width: 15rem;"
            class="mb-2"
          >
            <template #header>
              <img src="https://picsum.photos/600/300/?image=25" />
            </template>

            <template #content>
              <p class="my-3 text-sm">
                Some quick example text to build on the card title and make up 
                the bulk of the card's content.
              </p>
            </template>
          </Card>
        </div>
      
    </div>

    <div class="mb-3 px-4">
      <div class="my-2 mb-2 border-b border-surface-100">
        <p class="text-base">
          Eventos da Engenharia
        </p>
      </div>

      <div class="my-2">
        <div>
          <Card
            style="max-width: 15rem;"
            class="mb-2"
          >
            <template #header>
              <img src="https://picsum.photos/600/300/?image=25" />
            </template>

            <template #content>
              <p class="my-3 text-sm">
                Some quick example text to build on the card title and make up 
                the bulk of the card's content.
              </p>
            </template>
          </Card>
        </div>
      </div>
    </div>

    <div class="mb-3 px-4">

      <div class="border-b border-surface-100">
        <p class="my-1 text-base">......</p>
      </div>

    </div>
 
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
