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
    <div class="flex flex-col justify-center h-52 my-10 px-6">
        <div class="space-y-1">
          <p class="text-4xl pb-1">Conectando ideias, pessoas e realizações.</p>
          <p class="text-sm" style="letter-spacing: 1px;">
            Bem-vindo à plataforma que transforma eventos académicos em experiências inesquecíveis. <br />
            Descubra, Participe e Inspire-se!
          </p>
        </div>

        <div class="flex items-center w-1/4 h-14 mt-10">
          <InputGroup>
            <InputText placeholder="Escreva para pesquisar" size="small" class="w-32 h-10" />
            <InputGroupAddon class="!p-0">
              <Button icon="pi pi-search" severity="transparent" size="small" class="h-9"/>
            </InputGroupAddon>
        </InputGroup>
        </div>
      </div>
</template>