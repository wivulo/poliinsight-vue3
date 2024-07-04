<script>
export default {
    name: 'EventSpeakersList',
    data(){
        return {
            speakers: [
                {
                    name: 'John Doe',
                    office: 'CEO, Leader Conference',
                    photo: 'https://via.placeholder.com/150',
                    description: 'The opening ceremony of the conference',
                },
                {
                    name: 'Jane Doe',
                    office: 'COO, Leader Conference',
                    photo: 'https://via.placeholder.com/150',
                    description: 'The keynote address of the conference',
                },
                {
                    name: 'Walter Ivulo',
                    office: 'Frontend Developer, Leader Conference',
                    photo: 'https://via.placeholder.com/150',
                    description: 'A panel discussion on the future of leadership',
                },
                {
                    name: 'Valtercio Iulo',
                    office: 'Backend Developer, Co-Leader Conference',
                    photo: 'https://via.placeholder.com/150',
                    description: 'The opening ceremony of the conference',
                },
            ]
        }
    }
}
</script>

<template>
    <div class="grid gap-x-3 gap-y-5 grid-cols-3">
        <div class="flex gap-x-3" v-for="(speaker, i) in speakers" :key="i">
            <img :src="speaker.photo" alt="Speaker photo" class="w-28 h-40" />
            <div class="relative h-full">
                <p class="font-bold text-xl text-primary">{{ speaker.name }}</p>
                <p class="text-sm font-light my-3">{{ speaker.office }}</p>
                <p class="text-sm font-normal">{{ speaker.description }}</p>

                <div class="flex gap-3 mt-5 absolute bottom-3 left-0">
                    <div class="w-4 h-4 ">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" stroke="none" stroke-width="1" stroke-linecap="round" stroke-linejoin="round" class="feather feather-facebook fill-primary">
                            <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
                        </svg>
                    </div>
                    <div class="w-4 h-4">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" stroke="none" stroke-width="1" stroke-linecap="round" stroke-linejoin="round" class="feather feather-twitter fill-primary">
                            <path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z"></path>
                        </svg>
                    </div>

                    <div class="w-4 h-4">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-instagram stroke-primary" fill="none">
                            <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                            <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                            <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
                        </svg>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>