<script>
import TabView from 'primevue/tabview'
import TabPanel from 'primevue/tabpanel'

export default {
    name: 'EventSchedulesTab',
    components: {
        TabView,
        TabPanel
    },
    data(){
        return {
            schedules: [
                {
                    day: 'Day 1',
                    date: 'June 1, 2021',
                    ceremonies: [
                        {
                            title: 'Opening Ceremony',
                            description: 'The opening ceremony of the conference',
                            time: '9:00 AM - 10:00 AM',
                            speaker: {
                                name: 'John Doe',
                                office: 'CEO, Leader Conference'
                            }
                        },
                        {
                            title: 'Keynote Address',
                            description: 'The keynote address of the conference',
                            time: '10:00 AM - 11:00 AM',
                            speaker: {
                                name: 'Jane Doe',
                                office: 'COO, Leader Conference'
                            }
                        },
                        {
                            title: 'Panel Discussion',
                            description: 'A panel discussion on the future of leadership',
                            time: '11:00 AM - 12:00 PM',
                            speaker: {
                                name: 'Walter Ivulo',
                                office: 'Frontend Developer, Leader Conference'
                            }
                        },
                    ]
                },

                {
                    day: 'Day 2',
                    date: 'June 2, 2021',
                    ceremonies: [
                        {
                            title: 'Opening Ceremony',
                            description: 'The opening ceremony of the conference',
                            time: '9:00 AM - 10:00 AM',
                            speaker: {
                                name: 'Valtercio Iulo',
                                office: 'Backend Developer, Co-Leader Conference'
                            }
                        },
                        {
                            title: 'Keynote Address',
                            description: 'The keynote address of the conference',
                            time: '10:00 AM - 11:00 AM',
                            speaker: {
                                name: 'Eclater BC',
                                office: 'CTO, Admin Conference'
                            }
                        },
                        {
                            title: 'Panel Discussion',
                            description: 'A panel discussion on the future of leadership',
                            time: '11:00 AM - 12:00 PM',
                            speaker: {
                                name: 'Kelson Stress',
                                office: 'CFO, Logist Conference'
                            }
                        },
                    ]
                },

                {
                    day: 'Day 3',
                    date: 'June 3, 2021',
                    ceremonies: [
                        {
                            title: 'Opening Ceremony',
                            description: 'The opening ceremony of the conference, about destroy thanos',
                            time: '9:00 AM - 10:00 AM',
                            speaker: {
                                name: 'Iron Man',
                                photoURL: 'https://wallpapercave.com/wp/wp4516856.jpg',
                                office: 'Avengers Co-Leader'
                            }
                        },
                        {
                            title: 'I Will Be Back',
                            description: 'The keynote address of the conference, about the future of the world',
                            time: '10:00 AM - 11:00 AM',
                            speaker: {
                                name: 'Thor',
                                photoURL: 'https://wallpapercave.com/wp/wp5790870.jpg',
                                office: 'God of Thunder'
                            }
                        },
                        {
                            title: 'The Only One capable of Using the Infinity Gauntlet',
                            description: 'A panel discussion off who is the only one capable of using the infinity gauntlet and survive, about save the other dieded avengers',
                            time: '11:00 AM - 12:00 PM',
                            speaker: {
                                name: 'Hulk',
                                photoURL: 'https://wallpapercave.com/wp/wp5511383.jpg',
                                office: 'The Strongest Avenger'
                            }
                        },
                    ]
                },
            ]
        }
    }
}
</script>

<template>
    <div class="card" id="EventSchedulesTab">
        <TabView class="tabview-custom flex gap-2">
            <TabPanel v-for="(schedule, i) in schedules" :key="i">
                <template #header>
                    <div class="flex flex-col justify-center items-end gap-2 h-40 bg-primary-500 w-full text-white pl-10 pr-4 text-xl">
                        <p class="font-bold whitespace-nowrap">
                            {{ schedule.day }}
                        </p>
                        <p class="font-light">
                            {{ schedule.date }}
                        </p>
                    </div>
                </template>

                <div class="flex flex-col gap-3">
                    <div v-for="(ceremonies, i) in schedule.ceremonies" :key="i"
                        class="flex gap-7 border-b border-surface-200">
                        <div v-if="ceremonies.speaker.photoURL" 
                            class="flex justify-center items-center basis-2/6">
                            <img :src="ceremonies.speaker.photoURL" alt="Speaker Photo"
                                class="h-60 w-56 object-cover" />
                        </div>

                        <div class="flex flex-col gap-4 basis-4/6" 
                            :class="{'basis-auto': !ceremonies.speaker.photoURL}"
                        >
                            <h3 class="text-2xl font-bold text-primary break-words">{{ ceremonies.title }}</h3>
                            <p class="text-md font-light text-surface-700 break-words">{{ ceremonies.description }}</p>

                            <div class="text-lg font-light text-primary">
                                <p >{{ ceremonies.time }}</p>
                                <p class="text-surface-600">
                                    <i class="fa fa-calendar-alt mr-2"></i>
                                    {{ schedule.date }}
                                </p>
                            </div>
                            <p class="text-lg font-medium">
                                --- 
                                <span class="text-primary mr-2">{{ ceremonies.speaker.name }}</span>
                                <span class="text-sm text-surface-400">{{ ceremonies.speaker.office }}</span>
                            </p>
                        </div>
                    </div>
                </div>
            </TabPanel>
        </TabView>
    </div>
</template>

<style>
#EventSchedulesTab .tabview-custom ul[data-pc-section="nav"]{
    @apply flex flex-col gap-2
}
</style>