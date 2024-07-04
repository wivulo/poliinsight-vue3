<script>
import Button from 'primevue/button'
export default {
  name: 'Navbar',
  components: {
      Button
  },
  methods: {
    smoothScroll(event, selector) {
      // Prevenir o comportamento padrão do link
      event.preventDefault();

      // Encontrar o elemento alvo
      const targetElement = document.querySelector(selector);

      if (targetElement) {
        // Realizar o scroll suave até o elemento alvo
        targetElement.scrollIntoView({ behavior: 'smooth' });
      }
    }
  }
}
</script>

<template>
  <nav>
    <ul class="list-none flex gap-8 items-center">
      <li class="nav-item">
        <a href="#home" @click="smoothScroll($event, '#home')">Home</a>
      </li>
      <li class="nav-item">
        <a href="#aboutus" @click="smoothScroll($event, '#aboutus')">About</a>
      </li>
      <li class="nav-item">
        <a href="#schedules" @click="smoothScroll($event, '#schedules')">Schedule</a>
      </li>
      <li class="nav-item">
        <a href="#speakers" @click="smoothScroll($event, '#speakers')">Speakers</a>
      </li>
      <li class="nav-item">
        <Button class="rounded-none">Buy ticket</Button>
      </li>

    </ul>
  </nav>
</template>