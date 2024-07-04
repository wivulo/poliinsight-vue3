<script>
import { imagesURL } from "./ImagesURL";
// import { ChevronLeft, ChevronRight } from "lucide-vue";
import Button from 'primevue/button';

export default {
    name: 'CarouselView',
    components: {
      // ChevronLeft,
      // ChevronRight
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
        } else if (diff === this.images.length - 1) {
          return 'prev';
        } else if (diff === this.images.length - 2) {
          return 'prevLeftSecond';
        } else {
          return diff > 2 ? 'hideRight' : 'hideLeft';
        }
      }
    },
  };
</script>

<template>
      <div class="relative">

        <div id="carousel" class="relative w-full">
          <div v-for="(img, index) in images" :class="getClass(index)" :key="index">
            <img :src="img">
          </div>
        </div>

        <div class="buttons absolute w-full flex  justify-between pr-5">
          <Button text class="soft-hover" @click="move('prev')">
              <!-- <chevron-left :size="25" class="text-danger"/> -->
              <i class="fa fa-chevron-left"></i>
          </Button>
          <Button text class="soft-hover border-0" @click="move('next')">
              <!-- <chevron-right :size="25" class="text-danger" /> -->
              <i class="fa fa-chevron-right"></i>
          </Button>
        </div>
      </div>
</template>

<style scoped>
  #carousel {
    height: 400px;
    overflow: hidden;
  }
  
  #carousel div {
    position: absolute;
    transition: transform 1s, left 1s, opacity 1s, z-index 0s;
    opacity: 1;
  }
  
  #carousel div img {
    width: 400px;
    transition: width 1s;
  }
  
  #carousel div.hideLeft {
    left: 0%;
    opacity: 0;
    transform: translateY(50%) translateX(-50%);
  }
  
  #carousel div.hideLeft img {
    width: 200px;
  }
  
  #carousel div.hideRight {
    left: 100%;
    opacity: 0;
    transform: translateY(50%) translateX(-50%);
  }
  
  #carousel div.hideRight img {
    width: 200px;
  }
  
  #carousel div.prev {
    z-index: 5;
    left: 30%;
    transform: translateY(50px) translateX(-50%);
  }
  
  #carousel div.prev img {
    width: 300px;
  }
  
  #carousel div.prevLeftSecond {
    z-index: 4;
    left: 15%;
    transform: translateY(50%) translateX(-50%);
    opacity: .7;
  }
  
  #carousel div.prevLeftSecond img {
    width: 200px;
  }
  
  #carousel div.selected {
    z-index: 10;
    left: 50%;
    transform: translateY(0px) translateX(-50%);
  }
  
  #carousel div.next {
    z-index: 5;
    left: 70%;
    transform: translateY(50px) translateX(-50%);
  }
  
  #carousel div.next img {
    width: 300px;
  }
  
  #carousel div.nextRightSecond {
    z-index: 4;
    left: 85%;
    transform: translateY(50%) translateX(-50%);
    opacity: .7;
  }
  
  #carousel div.nextRightSecond img {
    width: 200px;
  }
  
  .buttons {
    top: 35vh;
  }
  
</style>