<script setup>
import Card from 'primevue/card';
import Button from 'primevue/button';
import Image from 'primevue/image';
import logo from "@/assets/logo_without_bg.png"
import EventServices from '@/services/EventServices';
import InputText from 'primevue/inputtext';
import InputGroup from 'primevue/inputgroup';
import InputGroupAddon from 'primevue/inputgroupaddon';
</script>

<template>
  <div class="flex flex-col justify-center h-auto md:h-52 my-10 px-6">
    <div class="space-y-1 md:text-left">
      <p class="text-2xl sm:text-4xl pb-1">Conectando ideias, pessoas e realizações.</p>
      <p class="text-xs sm:text-sm" style="letter-spacing: 1px;">
        Bem-vindo à plataforma que transforma eventos académicos em experiências inesquecíveis.<br />
        Descubra, Participe e Inspire-se!
      </p>
    </div>

    <div class="flex items-center w-full sm:w-1/2 md:w-1/4 h-14 mt-10 mx-auto md:mx-0">
      <InputGroup class="w-full">
        <InputText placeholder="Escreva para pesquisar" size="small" class="w-full h-10" />
        <InputGroupAddon class="!p-0">
          <Button icon="pi pi-search" severity="transparent" size="small" class="h-9"/>
        </InputGroupAddon>
      </InputGroup>
    </div>
  </div>
</template>