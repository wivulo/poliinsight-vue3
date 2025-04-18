<script setup>
import { ref, shallowRef } from 'vue'
import UserServices from '@/services/UserServices'
import { useRouter } from 'vue-router'
import { useStore } from 'vuex'
import { useNotification } from '@/composables/useNotification'
import Card from 'primevue/card';
import InputGroup from 'primevue/inputgroup';
import Button from 'primevue/button'
import Image from 'primevue/image';
import Dropdown from 'primevue/dropdown';
import CardRoot from "@/components/PCard/CardRoot.vue"
import TabMenu from 'primevue/tabmenu';
import TabView from 'primevue/tabview';
import TabPanel from 'primevue/tabpanel';
import Multiselect from 'vue-multiselect';
import Avatar from 'primevue/avatar';
import MyEventsTable from './components/myEvents/MyEventsTable.vue'
import MyCertificates from './components/myCertificates/MyCertificates.vue'
import MyRegistrationTable from './components/myRegistration/MyRegistrationTable.vue'

const router = useRouter()
const store = useStore()
const { notifyError } = useNotification()

const busy = ref(false)
const user = ref(null)

const tabItems = ref([
    { label: 'Meus Eventos', component: shallowRef(MyEventsTable), icon: 'fa fa-tasks', roles: ['administrator, organizer'] },
    { label: 'Minhas inscrições', component: shallowRef(MyRegistrationTable), icon: 'fa fa-pencil', roles: ['participant'] },
    { label: 'Meus Certificados', component: shallowRef(MyCertificates), icon: 'fa fa-certificate', roles: ['participant', 'convidado'] },
])

const tabICurrenttem = ref('MyEventsTable')
const showMoreDetails = ref(false)

async function fetchUser(){
    try {
        busy.value = true        
        const responde = await UserServices.show(store.getters['auth/user'].id)
        user.value = responde.data
    } catch (error) {
        notifyError(error)
    } finally {
        busy.value = false
    }
}
fetchUser()
</script>

<template>
    <div id="profile" class="flex flex-col px-5 pt-7 pb-5 gap-5 w-full flex-auto">
        <div v-if="busy" class="flex-grow flex w-full h-full justify-center items-center">
            <i class="fa fa-spinner animate-spin text-black text-base" />
        </div>

        <div v-else-if="!busy && !user" class="flex-grow flex w-full h-full justify-center items-center">
            <p class="text-xl text-surface-400 font-light">
                Nenhum usuário encontrado!
            </p>
        </div>

        <div class="flex gap-5 w-full" v-else>
            <CardRoot class="w-[25%]">
                <div class="flex flex-col gap-3">

                    <div class="w-full h-[218px] border overflow-hidden flex justify-center items-center group relative">
                        <Avatar v-if="user.imageURL" :image="user.imageURL" shape="circle" class="object-fill object-center" alt="foto de perfil do usuário"/>
                        <Avatar v-else icon="pi pi-user" class="text-6xl w-full h-full" alt="foto de perfil do usuário"/>
                        <!-- <Image :src="user.imageURL" class="object-fill object-center" imageClass="h-[218px]" alt="user.name" preview/> -->

                        <div class="absolute right-0 bottom-0 m-5">
                            <Button text severity="secondary" size="small" @click="" class="group-hover:flex justify-center items-center hidden h-8 border border-zinc-300" rounded>
                                <i class="fa fa-edit" />
                            </Button>
                        </div>
                    </div>
                    <div>
                        <p class="text-lg font-medium">
                            {{ user.name }}
                        </p>
                        <p class="text-sm">@{{ user.username }}</p>
                    </div>
                    <div class="mt-2 min-h-160 relative">
                        <ul class="flex flex-col gap-2 text-sm">
                            <li>
                                <p><b>Email:</b></p>
                                <p>{{ user.email }}</p>
                            </li>
                            <li>
                                <p><b>Telefone:</b></p>
                                <p>{{ user.phone }}</p>
                            </li>
                            <li>
                                <p><b>Nascimento:</b></p>
                                <p v-formatDateDDMMMYYY="user.birthdate"></p>
                            </li>
                            <li>
                                <p><b>Gênero:</b></p>
                                <p>{{ user.gender }}</p>
                            </li>
                            <li>
                                <p><b>Departamento:</b></p>
                                <p>{{ user.department?.name }}</p>
                            </li>
                        </ul>
                        <ul v-show="showMoreDetails" class="flex flex-col gap-2 text-sm mt-5">
                            <li v-for="group in user.groups" :key="group.id">
                                <p><b>Grupo</b>:</p>
                                <p>{{ group?.group?.name }}</p>
                            </li>
                        </ul>
                        <div class="flex justify-end my-1">
                            <Button text severity="secondary" size="small" @click="showMoreDetails = !showMoreDetails"
                                class="h-8 bg-gray-400/80 hover:bg-gray-400 border-0"
                            >
                                <span class="text-slate-700 text-xs" v-if="!showMoreDetails">
                                    <i class="fa fa-plus text-sm " /> Ver mais
                                </span>
                                <span class="text-slate-700 text-xs" v-else>
                                    <i class="fa fa-minus text-sm " /> Ver menos
                                </span>
                            </Button>
                        </div>
                    </div>
                </div>
            </CardRoot>

            <CardRoot class="w-[73%]">
               <div class="flex flex-col gap-5">
                    <TabView id="custom_tabview" :unstyled="true">
                        <TabPanel v-for="item in tabItems" :key="item.id">
                            <template #header>
                                <div>
                                    <span :class="'mr-1 fa ' + item.icon" />
                                    <span >{{ item.label }}</span>
                                </div>
                            </template>
                            <transition>
                                <component 
                                    :is="item.component" 
                                    ref="componentTabela"
                                    :eventType="user.category?.name" 
                                />
                            </transition>
                        </TabPanel>
                    </TabView>
               </div>
            </CardRoot>
        </div>
        <!-- </div> -->
    </div>
</template>

<style>

#profile {
    div.cardroot div[data-pc-section="content"]{
        @apply py-[5px]
    }

    .cardroot div[data-pc-section="body"] {
        @apply px-[5px]
    }

    ul li{
        @apply flex justify-between gap-1
    }
}
</style>