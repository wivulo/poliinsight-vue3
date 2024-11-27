<script>
export default {
    name: "Marquee"
}
</script>

<template>
    <div ref="marqueeElement" class="marquee" >
        <slot></slot>
    </div>
</template>

<style>
.marquee {
  display: inline-block;
  animation: marquee 10s linear infinite;
  transform: translateX(0);
  animation-play-state: paused;
}

.marquee:hover {
  animation-play-state: running;
}

.marquee:not(:hover) {
  animation: none;
  transform: translateX(0);
}

@keyframes marquee {
  0% {
    transform: translateX(0);
  }
  100% {
    transform: translateX(-100%);
  }
}
</style>