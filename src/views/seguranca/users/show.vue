<script setup>
import { ref, reactive, computed, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useStore } from 'vuex'
import { useNotification } from '@/composables/useNotification'
import UserServices from '@/services/UserServices'
import { dateFormatter } from "@/utils/dateFormatter"
import CardRoot from '@/components/PCard/CardRoot.vue'
import Button from 'primevue/button'
import Image from 'primevue/image'
import TabView from 'primevue/tabview';
import TabPanel from 'primevue/tabpanel';
import RegistrationTable from './components/RegistrationTable.vue'
import EventsTable from './components/EventsTable.vue'

const route = useRoute()
const router = useRouter()
const store = useStore()
const { notifyError, notifySuccess } = useNotification()

const busy = ref(false)
const user = ref(null)

const date_formatter = computed(() => dateFormatter)

const getUser = async () => {
    try {
        busy.value = true
        const response = await UserServices.show(route.params.id)
        if (response.status === 200) {
            user.value = response.data
            return
        }
        throw new Error()
    } catch (error) {
        handleError('Erro ao buscar usuário')
    } finally {
        busy.value = false
    }
}

const handleError = (error) => {
    notifyError(error)
}

const tabItems = [
    { label: 'Eventos', component: EventsTable, icon: 'fa fa-tasks' },
    { label: 'Incrições', component: RegistrationTable, icon: 'fa fa-pencil' },
];

onMounted(() => {
    getUser()
})

watch(route, () => {
    getUser()
})
</script>

<template>
    <div id="userShow" class="flex flex-col px-5 pt-7 pb-5 gap-5 w-full flex-auto">
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
                    <div class="w-full h-[218px] border overflow-hidden">
                        <Image :src="user.imageURL" class="object-fill object-center w-full" imageClass="h-[218px] w-full" alt="user.name" preview/>
                    </div>

                    <div>
                        <p class="text-xl font-medium">
                            {{ user.name }}
                        </p>
                        <p>{{ user.email }}</p>
                    </div>

                    <div class="mt-2 min-h-160 relative">
                        <ul class="flex flex-col gap-2 text-sm">
                            <li>
                                <p><b>Gênero:</b></p>
                                <p>{{ user.gender }}</p>
                            </li>
                            <li>
                                <p><b>Data de nascimento:</b></p>
                                <p>{{ date_formatter(user.birthdate) }}</p>
                            </li>
                            <li>
                                <p><b>Telefone:</b></p>
                                <p>{{ user.phone }}</p>
                            </li>
                            <li>
                                <p><b>Curso:</b></p>
                                <p>{{ user.course }}</p>
                            </li>
                            <li>
                                <p><b>Instituição:</b></p>
                                <p>{{ user.institution }}</p>
                            </li>
                            <li>
                                <p><b>Departamento:</b></p>
                                <p>{{ user.department?.name }}</p>
                            </li>
                            <li>
                                <p><b>Nome de usuário:</b></p>
                                <p>{{ user.username }}</p>
                            </li>
                            <li>
                                <p class="font-semibold">Grupos:</p>
                                <div class="flex flex-wrap justify-end gap-1">
                                    <span v-for="userGroup in user.groups" :key="userGroup.id" class="bg-surface-300 text-black px-2 py-1 rounded-full text-xs">
                                        {{ userGroup.group.name }}
                                    </span>
                                </div>
                            </li>
                        </ul>
                    </div>
                </div>
            </CardRoot>

            <CardRoot class="w-[75%]">
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
                                        ref="componentTabelaRef"
                                    />
                                </transition>
                            </TabPanel>
                        </TabView>
                   </div>
            </CardRoot>
        </div>
    </div>
</template>

<style>
#userShow {
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