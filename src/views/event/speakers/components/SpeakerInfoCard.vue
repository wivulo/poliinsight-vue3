<script>
import CCard from "@/components/PCard/index.js"
import Marquee from '@/components/Marquee/index.vue';

export default {
    name: "event.speakers.info",
    props: {
        speaker_event: {
            type: Object,
            required: true
        }
    },
    components: {
        CardRoot: CCard.Root, Marquee
    },
}
</script>

<template>
    <div class="flex flex-col items-center gap-2 border border-zinc-200 rounded-md p-2 bg-zinc-200/80 hover:bg-gray-300/80 cursor-pointer min-w-[180px] max-w-[250px]">
        <div>
            <img :src="speaker_event.speaker.imageURL" :alt="speaker_event.speaker.imageURL" class="w-14 h-14 rounded-full" />
        </div>
        <div class="flex flex-col justify-center">
            <div class="text-sm font-semibold">
                {{ speaker_event.speaker.name }}
            </div>
            <div class="text-xs text-gray-500">
                {{ speaker_event.speaker.email }}
            </div>
        </div>
    </div>
</template>