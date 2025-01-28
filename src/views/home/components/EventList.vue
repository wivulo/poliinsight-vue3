<script setup>
import Image from 'primevue/image';
import Card from 'primevue/card';
import Button from 'primevue/button';

const { header, events, busy } = defineProps({
    header: String,
    events: Array,
    busy: Boolean
});
</script>

<template>
    <div class="mb-3 px-20">
        <div class="my-5 border-b border-surface-100">
          <p class="text-xl font-bold text-surface-700">
            {{ header }}
          </p>
        </div>

        <div v-if="busy" class="flex-grow flex w-full h-full justify-center items-center">
            <i class="fa fa-spinner animate-spin text-black text-base" />
        </div>

        <div v-else-if="!busy && (events && events?.length === 0)" class="flex-grow flex w-full h-full justify-center items-center">
            <p class="text-xl text-surface-400 font-light">
                Nenhum evento encontrado!
            </p>
        </div>

        <div v-else class="my-2 flex gap-14 flex-wrap">
            <Card
                style="max-width: 15rem;"
                class="mb-2 h-96 overflow-hidden"
                v-for="event in events" :key="event.id"
            >
                <template #header>
                    <!-- <img :src="event.image" /> -->
                     <div class="overflow-hidden h-250px">
                        <Image :src="event.imageURL" width="270" image-class="!w-[550px] h-[250px] hover:scale-125 transform transition-all duration-500"/>
                    </div>
                </template>
        
                <template #content>
                    <div class="flex justify-between items-center text-ellipsis-2" :title="event.name">
                        <RouterLink :to="{name: 'public.event.show', params: {id: event.id}}" class="text-sm font-bold text-surface-900 cursor-pointer">
                            {{ event.name }}
                        </RouterLink>
                    </div>

                    <div class="flex flex-col gap-1 text-surface-500 text-xs mt-2">
                        <span class="flex items-center">
                            <i class="pi pi-calendar mr-1" /> <span v-formatDate="event.startDate" :title="event.startDate"/>
                        </span>
                        <p><i class="pi pi-map-marker"></i> {{ event.location }}</p>
                    </div>
                </template>
            </Card>
        </div>
        
        <div class="flex justify-end">
            <Button icon="fa fa-plus" label="Ver mais" text size="small" class="h-9" severity="secondary" />
        </div>
    </div>
</template>