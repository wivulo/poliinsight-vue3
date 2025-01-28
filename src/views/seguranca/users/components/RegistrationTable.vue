<script setup>
import { ref, onMounted, computed } from 'vue';
import { useStore } from 'vuex'
import { useRoute } from 'vue-router';
import { useNotification } from '@/composables/useNotification'
import RegistrationServices from '@/services/RegistrationServices.js';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import Button from 'primevue/button';
import InputText from 'primevue/inputtext';
import InputGroup from 'primevue/inputgroup';
import Dropdown from 'primevue/dropdown';
import CardRoot from "@/components/PCard/CardRoot.vue"

const route = useRoute()
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
        const response = await RegistrationServices.showByUser(route.params.id);
        if(response.status === 200) {
            registrations.value = response.data;
            totalRecods.value = registrations.value.length;
            return;
        }

        throw new Error('Erro ao buscar inscrições');
    } catch(error) {
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
        <DataTable :value="registrations" size="small" paginator :rows="5" :totalRecords="totalRecods"
            dataKey="id" class="ctable w-full" :loading="busy" lazy :rowsPerPageOptions="[5, 10, 20, 50]"
        >

            <Column field="event.name" header="Evento" />
            <Column field="event.location" header="Localização" />
            <Column field="createdAt" header="Data da inscrição" >
                <template #body="props">
                    <p><span v-formatDate="props.data.createdAt"></span></p>
                </template>
            </Column>
            <Column field="event.status" header="Estado" />
            <Column field="actions" header="Opções" class="relative">
                <template #body="props">
                    <Button severity="transparent" size="small" class="h-9">
                        <i class="fa fa-eye mr-1 text-sm" />
                    </Button>
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