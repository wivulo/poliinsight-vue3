<script setup>
import { ref, onMounted, computed } from 'vue';
import { useStore } from 'vuex'
import { useRouter } from 'vue-router';
import { useNotification } from '@/composables/useNotification'
import RegistrationServices from '@/services/RegistrationServices.js';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import Button from 'primevue/button';
import InputText from 'primevue/inputtext';
import InputGroup from 'primevue/inputgroup';
import Dropdown from 'primevue/dropdown';
import CardRoot from "@/components/PCard/CardRoot.vue"
import SpeedDial from 'primevue/speeddial';

const router = useRouter();
const store = useStore()
const user = computed(() => store.getters['auth/user'])
const { notifyError } = useNotification()

const busy = ref(false);
const registrations = ref([]);
const totalRecods = ref(0);
const filter = ref(null);

const fetchUserRegistrations = async () => {
    try {
        busy.value = true;
        const response = await RegistrationServices.showByUser(user.value.id);
        if (response.status === 200) {
            registrations.value = response.data;
            totalRecods.value = registrations.value.length;
            return;
        }

        throw new Error('Erro ao buscar inscrições');
    } catch (error) {
        notifyError(error);
        console.log(error);
    } finally {
        busy.value = false;
    }
};

onMounted(() => {
    fetchUserRegistrations();
});
</script>

<template>
    <div class="flex">
        <DataTable :value="registrations" size="small" paginator :rows="5" :totalRecords="totalRecods" dataKey="id"
            class="ctable w-full" :loading="busy" lazy :rowsPerPageOptions="[5, 10, 20, 50]">

            <Column field="event.name" header="Evento" />
            <Column field="event.location" header="Localização" />
            <Column field="createdAt" header="Data da inscrição">
                <template #body="props">
                    <p><span v-formatDate="props.data.createdAt"></span></p>
                </template>
            </Column>
            <Column field="event.status" header="Estado" />
            <Column field="actions" header="Opções" class="relative">
                <template #body="props">
                    <Dropdown :options="[
                            {
                                label: 'Inscrição',
                                icon: 'pi pi-eye',
                                command: () => {
                                    router.push({ name: 'event.registrations.public.detail', params: {registrationid: props.data.id, id: props.data.eventId } })
                                }
                            },
                            {
                                label: 'Confirmar Presença',
                                icon: 'fa fa-check',
                                command: () => {}
                            },
                        ]" 
                        class="p-0 bg-primary-500" option-label="label"
                    >
                        <template #value>
                            <div class="flex justify-center items-center text-white">
                                <i class="fa fa-cog" />
                            </div>
                        </template>
                        <template #option="{ option }">
                            <div class="h-2 text-sm flex items-center text-zinc-700 py-2 w-full"
                                @click="option.command">
                                <i :class="option.icon" class="mr-1" /> {{ option.label }}
                            </div>
                        </template>
                        <template #dropdownicon>
                            <i class="fa fa-chevron-down text-white" />
                        </template>
                    </Dropdown>
                </template>
            </Column>

            <template #empty>
                <div class="flex items-center justify-center h-10">
                    <p class="text-gray-400">Nenhuma informação disponível</p>
                </div>
            </template>
        </DataTable>
    </div>
</template>