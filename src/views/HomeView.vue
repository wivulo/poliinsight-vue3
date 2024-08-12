<script>
import CarouselView from '@/components/Carousel/CarouselView.vue'
import Card from 'primevue/card';
import Button from 'primevue/button';
import Image from 'primevue/image';
import logo from "@/assets/logo_without_bg.png"


export default {
  name: "Home",
  components: {
    Image,
    CarouselView, Card, Button
  },
  data(){
    return {
      logo: logo
    }
  },
  created() {
    document.title = 'Página Inicial';
  }
}
</script>

<template>
  <main class="flex flex-col w-full">
    <!-- <AppGuestHeader /> -->

    <div class="flex flex-col justify-center h-48 mb-4">
      <div class="px-4">
        <p class="text-4xl">Descubra, participe, conecte-se.</p>
        <p>Encontre os eventos mais relevantes da sua área</p>
      </div>
    </div>

    <div class="mb-4 relative">
      <CarouselView />
    </div>

    <div class="mb-3 px-4">
      <div class="my-2 mb-2 border-b border-surface-100">
        <p class="text-lg">Eventos recentes</p>
      </div>

        <div>
          <Card
            style="max-width: 20rem;"
            class="mb-2"
          >
            <template #header>
              <img src="https://picsum.photos/600/300/?image=25" />
            </template>

            <template #content>
              <p class="my-3 text-base">
                Some quick example text to build on the card title and make up 
                the bulk of the card's content.
              </p>
    
              <Button href="#" severity="Primary">Go somewhere</Button>
            </template>
          </Card>
        </div>
      
    </div>

    <div class="mb-3 px-4">
      <div class="my-2 mb-2 border-b border-surface-100">
        <p class="text-lg">
          Eventos da Engenharia
        </p>
      </div>

      <div class="my-2">
        <div>
          <Card
            style="max-width: 20rem;"
            class="mb-2"
          >
            <template #header>
              <img src="https://picsum.photos/600/300/?image=25" />
            </template>

            <template #content>
              <p class="my-3 text-base">
                Some quick example text to build on the card title and make up 
                the bulk of the card's content.
              </p>
    
              <Button href="#" severity="Primary">Go somewhere</Button>
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

      <div class="basis-1/4">
        <Image :src="logo" alt="Responsive image"  width="150" height="150" />
      </div>
    </div>

    <footer class="w-full h-auto flex items-center justify-center border-top bg-zinc-500">
      <p class="text-center text-base text-white">
        Designed and built with all the love in the world. 
        Maintained by Instituto Superior politecnico de Benguela.
        <br />
        Currently v1.0.0 And powered by WIVULO
      </p>
    </footer>

  </main>
</template>
