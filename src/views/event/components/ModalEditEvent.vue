<script setup>
import { ref, computed } from 'vue';
import { useStore } from 'vuex';
import { useNotification } from '@/composables/useNotification';
import EventServices from '@/services/EventServices';
import CategoryService from '@/services/CategoryService';
import DepartamentService from '@/services/DepartamentService';
import { SwalConfirmAlert } from '@/helpers/swalConfirmAlert';
import { useVuelidate } from '@vuelidate/core'
import { required } from '@vuelidate/validators'
import Dialog from 'primevue/dialog';
import Dropdown from 'primevue/dropdown';
import InputText from 'primevue/inputtext';
import FloatLabel from 'primevue/floatlabel';
import Textarea from 'primevue/textarea';
import Calendar from 'primevue/calendar';
import IconField from 'primevue/iconfield';
import InputIcon from 'primevue/inputicon';
import InputNumber from 'primevue/inputnumber';
import Button from 'primevue/button';

const emit = defineEmits(['updated']);
const store = useStore();
const user = computed(() => store.getters['auth/user']);
const { notifyError, notifySuccess } = useNotification();

const visible = ref(false);
const categories = ref({ data: [], busy: false, selected: null });
const department = ref({ data: [], busy: false, selected: null });
const event_type = ref([
    { label: 'Gratuito', value: 'Gratuito' },
    { label: 'Pago', value: 'Pago' }
]);
const event = ref({
    id: null,
    organizerId: user.value.id,
    name: '',
    description: '',
    startDate: null,
    endDate: null,
    startTime: '',
    endTime: '',
    location: '',
    departmentId: '',
    vacancies: 0,
    type: '',
    categoryId: null
});
const busy = ref(false);
const rules = {
    name: { required },
    startDate: { required },
    endDate: { required },
    startTime: { required },
    location: { required },
    departmentId: { required },
    vacancies: { required },
    type: { required },
    categoryId: { required }
};
const v$ = useVuelidate(rules, event);

const show = (id) => {
    visible.value = true;
    fetchEvent(id);
    buscarCategorias();
    fetchDepartments();
};

async function fetchEvent(eventId) {
    try {
        busy.value = true;
        const response = await EventServices.show(eventId);
        if (response.status === 200) {
            event.value = response.data;
            return;
        }

        throw new Error();
    } catch (error) {
        console.error(error);
        notifyError('Erro ao buscar o evento');
    } finally {
        busy.value = false;
    }
}

function handleOK() {
    v$.value.$touch()
    if(v$.value.$error) {
        notifyError('Preencha todos os campos obrigatórios!')
        return
    }

    update();
}

async function update() {
    try {
        if(!await SwalConfirmAlert())  return

        busy.value = true;
        const response = await EventServices.update({ ...event.value })
        if (response.status === 200 || response.status === 201) {
            visible.value = false;
            notifySuccess('Evento actualizado!');
            emit('updated');
            handleCancel();
            return;
        }

        throw new Error();
    } catch (error) {
        notifyError('Erro ao editar o evento');
        console.error(error);
    } finally {
        busy.value = false;
    }
};

const buscarCategorias = async () => {
    try {
        categories.value.busy = true;
        const response = await CategoryService.index();
        if (response && response?.error) {
            throw new Error('Erro ao buscar as categorias');
        }
        categories.value.data = response.data;
    } catch (error) {
        notifyError('Erro ao buscar as categorias');
    } finally {
        categories.value.busy = false;
    }
};

const fetchDepartments = async () => {
    try {
        department.value.busy = true;
        const response = await DepartamentService.index();
        if (response && response?.error) {
            throw new Error('Erro ao buscar os departamentos');
        }
        department.value.data = response.data;
    } catch (error) {
        notifyError('Erro ao buscar os departamentos');
    } finally {
        department.value.busy = false;
    }
};

function handleCancel() {
    visible.value = false;
    event.value = {
        id: null,
        organizerId: null,
        name: null,
        description: null,
        startDate: null,
        endDate: null,
        startTime: null,
        endTime: null,
        location: null,
        departmentId: null,
        vacancies: 0,
        type: null,
        categoryId: null
    };
    v$.value.$reset()
    busy.value = false;
    department.value.data = [];
    categories.value.data = [];
    department.value.selected = null;
    categories.value.selected = null;

};

defineExpose({
    show
});
</script>

<template>
    <Dialog v-model:visible="visible" modal header="Editar evento" :style="{ width: '35rem' }">
        <div v-if="busy" class="flex-grow flex w-full h-full justify-center items-center">
            <i class="fa fa-spinner animate-spin text-black text-base" />
        </div>

        <div v-else class="flex flex-col gap-5">
            <div class="flex gap-5 w-full mb-3">
                <div class="flex flex-col grow">
                    <label for="category" class="flex-grow pl-3 text-surface-400">
                        <small>Catégoria</small>
                    </label>
                    <Dropdown 
                        id="category" v-model="event.categoryId" 
                        optionLabel="name" option-value="id"  
                        :options="categories.data" placeholder="Selecione uma categória" class="h-9 w-full"
                        :loading="categories.busy"
                    >
                        <template #value="slotProps">
                            <div v-if="slotProps.value" class="flex items-center">
                                {{ categories.data.find(cat => cat.id === slotProps.value)?.name }}
                            </div>
                            <div v-else>
                                {{ slotProps.placeholder }}
                            </div>
                        </template>
                    </Dropdown>
                </div>

                <div class="flex flex-col grow">
                    <label for="departament" class="pl-3 text-surface-400">
                        <small> Departamento </small>
                    </label>
                    <Dropdown 
                        id="department" v-model="event.departmentId"  :options="department.data" 
                        optionLabel="name" option-value="id" placeholder="Selecione um departamento" class="h-9 w-full"
                        :loading="department.busy"
                    >
                        <template #value="slotProps">
                            <div v-if="slotProps.value" class="flex items-center">
                                {{ department.data.find(department => department.id === slotProps.value)?.name }}
                            </div>
                            <div v-else>
                                {{ slotProps.placeholder }}
                            </div>
                        </template>
                    </Dropdown>
                </div>
            </div>

            <FloatLabel>
                <InputText id="name" v-model="event.name" class="w-full border-slate-300 h-9" :required="true"/>
                <label for="name" class="text-slate-400">
                    <small class="text-slate-400"> Nome do evento </small>
                </label>
            </FloatLabel>

            <Textarea v-model="event.description" rows="5" cols="30" placeholder="Descrição do evento" class="hover:border-slate-400"/>

            <FloatLabel class="mt-2">
                <InputText id="localization" v-model="event.location" class="w-full border-slate-300 h-9" :required="true"/>
                <label for="localization" class="text-slate-400">
                    <small class="text-slate-400"> Localização </small>
                </label>
            </FloatLabel>

            <div class="flex flex-col">
                <label for="vacancies" class="pl-3 text-surface-400">
                    <small> Número de vagas </small>
                </label>
                <InputNumber id="vacancies" v-model="event.vacancies" class="w-full border-slate-300 h-9" :required="true"/>
            </div>

            <div class="flex flex-col">
                <label for="freeOrPaid" class="pl-3 text-surface-400">
                    <small> Acesso ao evento </small>
                </label>
                <Dropdown id="freeOrPaid" v-model="event.type"  :options="event_type" optionLabel="label" optionValue="value" placeholder="Selecione a forma de acesso ao evento" class="h-9 w-full">
                    <template #value="slotProps">
                        <div v-if="slotProps.value" class="flex items-center">
                            {{ slotProps.value }}
                        </div>
                        <div v-else>
                            {{ slotProps.placeholder }}
                        </div>
                    </template>
                </Dropdown>
            </div>

            <div class="flex gap-3">
                <Calendar 
                    v-model="event.startDate" placeholder="Data de inicio" :showIcon="true" 
                    :readonlyInput="true" :showOnFocus="true" 
                    :minDate="new Date()" :maxDate="new Date(2025, 12, 31)" 
                    iconDisplay="input" dateFormat="dd/mm/yy"
                    class="flex-grow border-slate-300 h-9 focus:outline-slate-400" 
                    inputClass="hover:border-slate-400"
                />

                <Calendar v-model="event.endDate" placeholder="Data de fim" :showIcon="true" :readonlyInput="true" :showOnFocus="true" :minDate="new Date()" :maxDate="new Date(2025, 12, 31)"  iconDisplay="input" class="flex-grow border-slate-300 h-9 focus:outline-slate-400" inputClass="hover:border-slate-400"/>
            </div>

            <div class="flex gap-3">
                <IconField class="border border-surface-300 rounded-md h-10 flex-grow">
                    <InputIcon>
                        <i class="fa fa-clock" />
                    </InputIcon>
                    <Calendar id="calendar-timeonly" v-model="event.startTime" timeOnly class="remove-border h-9 w-full" placeholder="Hora de inicio"/>
                </IconField>

                <IconField class="border border-surface-300 rounded-md h-10 flex-grow">
                    <InputIcon>
                        <i class="fa fa-clock" />
                    </InputIcon>
                    <Calendar id="calendar-timeonly" v-model="event.endTime" timeOnly class="remove-border h-9 w-full" placeholder="Hora de termino"/>
                </IconField>
            </div>
        </div>

        <template #footer>
            <div class="flex gap-3 justify-endTime">
                <Button severity="secondary" text @click="handleCancel" size="small" class="h-8">
                    <i class="fa fa-times mr-1"/> Cancelar
                </Button>
                <Button @click="handleOK" size="small" class="h-8" :loading="busy">
                    <i class="fas fa-spinner animate-spin mr-1" v-if="busy" />
                    <i class="fa fa-save mr-1"/> {{ busy ? 'Salvando...' : 'Salvar' }}
                </Button>
            </div>
        </template>
    </Dialog>
</template>

<style>
#calendar-timeonly.remove-border input {
   border: none !important;
}
</style>