<script setup>
import Image from 'primevue/image';
import Card from 'primevue/card';
import Button from 'primevue/button';
import Chip from 'primevue/chip';
import PLoading from '@/components/PLoading.vue';
import PEmpty from '@/components/PEmpty.vue';
import Tag from 'primevue/tag';

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

        <PLoading v-if="busy" />

        <PEmpty v-else-if="!busy && !events" />

        <div v-else class="my-2 flex gap-14 flex-wrap">
            <Card
                style="max-width: 15rem;"
                class="mb-2 h-[24rem] overflow-hidden"
                :pt="{
                    content: 'py-0',
                }"
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
                            <p>{{ event.name }}</p>
                        </RouterLink>
                    </div>

                    <div class="flex flex-col gap-1 text-surface-500 text-xs mt-2">
                        <span class="flex items-center">
                            <i class="pi pi-calendar mr-1" /> <span v-formatDate="event.startDate" :title="event.startDate"/>
                        </span>
                        <p><i class="pi pi-map-marker"></i> {{ event.location }}</p>
                    </div>

                    <div>
                        <Tag :severity="event.status?.severity" :value="event.category?.name" class="my-0.5 !font-medium" />
                    </div>
                </template>
            </Card>
        </div>
        
        <div class="flex justify-end">
            <Button icon="fa fa-plus" label="Ver mais" text size="small" class="h-9" severity="secondary" />
        </div>
    </div>
</template>