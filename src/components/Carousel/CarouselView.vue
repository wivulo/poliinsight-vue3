<script>
import { imagesURL } from "./ImagesURL";
import Button from 'primevue/button';

export default {
    name: 'CarouselView',
    components: {
      Button
    },
    data() {
      return {
        selected: 0,
        images: imagesURL
      };
    },
    methods: {
      move(direction) {
        if (direction === 'next') {
          this.selected = (this.selected + 1) % this.images.length;
        } else if (direction === 'prev') {
          this.selected = (this.selected - 1 + this.images.length) % this.images.length;
        }
      },
      getClass(index) {
        const diff = (index - this.selected + this.images.length) % this.images.length;
        if (diff === 0) {
          return 'selected';
        } else if (diff === 1) {
          return 'next';
        } else if (diff === 2) {
          return 'nextRightSecond';
        } else if (diff === 3) {
          return 'extraRight';
        } else if (diff === this.images.length - 1) {
          return 'prev';
        } else if (diff === this.images.length - 2) {
          return 'prevLeftSecond';
        } else if (diff === this.images.length - 3) {
          return 'extraLeft';
        } else {
          return diff > 3 ? 'hideRight' : 'hideLeft';
        }
      }
    }

  };
</script>

<template>
      <div class="flex relative">
        <div id="carousel" class="relative w-full">
          <div class="carousel-item" v-for="(image, index) in images" :class="getClass(index)" :key="index">
              <figure>
                <picture>
                  <img :src="image.imageURL" :alt="image.name" />
                </picture>
                <figcaption>
                  <p class="flex items-center text-ellipsis-2" :title="image.name">
                      <RouterLink :to="{name: 'event.show', params: {id: image.id}}" class="font-bold text-surface-900 cursor-pointer">
                        {{ image.name }}
                      </RouterLink>
                  </p>

                  <p class="flex flex-col gap-1 text-surface-500 truncate">
                      <span class="flex items-center">
                          <i class="pi pi-calendar mr-1" /> <span v-formatDate="image.startDate" :title="image.startDate"/>
                      </span>
                      <span :title="image.location"><i class="pi pi-map-marker"></i> {{ image.location }}</span>
                  </p>
                </figcaption>
              </figure>
          </div>
        </div>

        <div class="absolute w-full flex  justify-between items-center pr-5 self-center z-50">
          <Button text class="soft-hover" @click="move('prev')">
              <i class="fa fa-chevron-left"></i>
          </Button>
          <Button text class="soft-hover border-0" @click="move('next')">
              <i class="fa fa-chevron-right"></i>
          </Button>
        </div>
      </div>
</template>

<style scoped src="../../assets/css/carousel.css"></style>