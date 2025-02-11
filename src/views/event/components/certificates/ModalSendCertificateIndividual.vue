<script setup>
import { ref, onMounted, shallowRef, reactive, watch } from 'vue';
import EventConfigServices from '@/services/EventConfigServices.js';
import { useRoute, useRouter } from 'vue-router';
import { useStore } from 'vuex';
import EventServices from '@/services/EventServices';
import CertificatesServices from '@/services/CertificatesServices';
import { useNotification } from '@/composables/useNotification';
import PLoading from '@/components/PLoading.vue';
import RegistrationServices from '@/services/RegistrationServices.js';
import Dialog from 'primevue/dialog';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import Button from 'primevue/button';
import InputText from 'primevue/inputtext';
import InputGroup from 'primevue/inputgroup';
import Dropdown from 'primevue/dropdown';
import dayjs from 'dayjs'
import { debounce } from 'lodash'
import { ConfirmSwal } from '@/helpers/fireSwal';

const emit = defineEmits(['sended']);

const { notifyError, notifySuccess } = useNotification();
const route = useRoute();
const router = useRouter();

let visible = ref(false);
const busy = ref(false);
const event = reactive({
    data: null,
    busy: false
})
const registrations = ref([])
const totalRecods = ref(0)
const search = ref('')
const params = reactive({
    take: 8,
    skip: 1,
    where: {
        OR: [
            {
                participant: {
                    name: {
                        contains: null
                    }
                }
            },
            {
                user: {
                    name: {
                        contains: null
                    }
                }
            }
        ]
    }
})

const templates = reactive({
    data: [],
    busy: false
});

const certificate = reactive({
    eventId: router.currentRoute.value.params.id,
    templateId: null,
    participantId: null,
    userId: null
})

function show() {
    visible.value = true;
    fetchEvent();
    fetchEventRegistrations()
    fetchTemplates()
}

function handleHidden() {
    visible.value = false;
}

function handleReset() {
    busy.value = false;
    event.data = null;
    registrations.value = []
    totalRecods.value = 0
    search.value = ''
    params.take = 8
    params.skip = 1
    params.where.OR[0].participant.name.contains = null
    params.where.OR[1].user.name.contains = null
    certificate.templateId = null
    certificate.participantId = null
    templates.data = []
}

function handleCancel() {
    visible.value = false;
    handleReset()
}

const fetchEvent = async () => {
    try {
        event.busy = true;
        const response = await EventServices.show(route.params.id);
        if (response.status === 200) {
            event.data = response.data;

            return;
        }

        throw new Error();
    } catch (error) {
        console.error(error);
        notifyError('Erro ao buscar configuração do evento');
    } finally {
        event.busy = false;
    }
}

const fetchEventRegistrations = debounce(async function () {
    try {
        busy.value = true
        const response = await RegistrationServices.showByEvent(route.params.id, params)
        if (response.status === 200) {
            response.data.data?.forEach(element => {
                if (element?.userId) {
                    registrations.value = [
                        ...registrations.value,
                        {
                            userId: element?.userId,
                            participant: element?.user
                        }
                    ]
                }

                if (element?.participantId) {
                    registrations.value = [
                        ...registrations.value,
                        {
                            participantId: element?.participantId,
                            participant: element?.participant
                        }
                    ]
                }

                if (element?.teamId) {
                    if (element?.team?.participants) {
                        registrations.value = [
                            ...registrations.value,
                            ...element?.team?.participants?.map(participant => {
                                return {
                                    teamName: element?.team.name,
                                    participantId: participant.id,
                                    participant: participant
                                }
                            })
                        ]
                    }

                    if(element?.team?.users) {
                        registrations.value = [
                            ...registrations.value,
                            ...element?.team?.users?.map(user => {
                                return {
                                    teamName: element?.team.name,
                                    userId: user.id,
                                    participant: user
                                }
                            })
                        ]
                    }
                }
            });

            totalRecods.value = response.data.total
            return
        }
    } catch (error) {
        console.error(error)
        notifyError(error)
    } finally {
        busy.value = false
    }
}, 300)

async function fetchTemplates() {
    try {
        templates.busy = true;
        const response = await CertificatesServices.listTemplates(router.currentRoute.value.params.id);
        if (response.status === 200) {
            templates.data = response.data.data;
            return;
        }

        throw new Error();
    } catch (error) {
        console.error(error);
        notifyError();
    } finally {
        templates.busy = false;
    }
}

async function handleSendCertificate(data) {
    try {
        const candidate = {
            participantId: null,
            userId: null,
            templateId: null,
            eventId: router.currentRoute.value.params.id
        }

        if(data?.participantId) {
            candidate.participantId = data?.participantId;
        }

        if(data?.userId) {
            candidate.userId = data?.userId;
        }

        if (!certificate.templateId) {
            notifyError('Selecione um template para emitir o certificado');
            return;
        } else {
            candidate.templateId = certificate.templateId.id;
        }

        const resilt = await ConfirmSwal()
        if (!resilt.isConfirmed) return;

        busy.value = true
        const response = await CertificatesServices.generate(candidate)
        if (response.status === 201) {
            notifySuccess('Certificado emitido com sucesso');
            emit('sended');
            visible.value = false;
            handleReset()
            return;
        }

        throw new Error();
    } catch (error) {
        console.error(error)
        notifyError(error)
    } finally {
        busy.value = false
    }
}

const componentTabelaRef = ref(null);
const updateComponent = () => {
    componentTabelaRef.value.updateComponent();
};

function onPageChange(event) {
    params.skip = event.page + 1
    params.take = event.rows
}

watch(search, (newSearch) => {
    params.where.OR[0].participant.name.contains = newSearch;
    params.where.OR[1].user.name.contains = newSearch;
}, { deep: true })

watch(params, (newSearch) => {
    fetchEventRegistrations()
}, { deep: true })

defineExpose({
    show,
    updateComponent
});
</script>

<template>
    <Dialog v-model:visible="visible" modal header="Emitir certificado" dismissableMask class="w-[45rem]">
        <div class="flex flex-col gap-3 w-full">
            <PLoading v-if="event.busy" />

            <div v-else class="flex flex-col gap-5 w-full">

                <div class="flex flex-col gap-1 w-full">
                    <label for="templateId">
                        Template:
                    </label>

                    <Dropdown id="templateId" v-model="certificate.templateId" :options="templates.data"
                        class="p-0 py-1 h-9 w-full" optionLabel="name">
                        <template #value="props">
                            <div v-if="props.value" class="flex align-items-center text-sm">
                                <div class="text-slate-800">
                                    {{ props.value.name }}
                                </div>
                            </div>
                            <div v-else class="flex items-center text-sm">
                                Selecione um template
                            </div>
                        </template>

                        <template #option="{ option }">
                            <div class="h-2 text-sm flex items-center text-zinc-700 py-2 w-full">
                                {{ option.name }}
                            </div>
                        </template>
                    </Dropdown>
                </div>

                <div class="w-full">
                    <div class="flex mb-2">
                        <InputGroup>
                            <Button size="small" class="h-9 bg-transparent border border-surface-300 border-r-0">
                                <i class="fa fa-search text-black" />
                            </Button>
                            <InputText size="small" v-model="search" id="search" type="text"
                                placeholder="Escreva para pesquisar..." class="w-full rounded-none h-9 border-l-0" />
                        </InputGroup>
                    </div>

                    <DataTable :value="registrations" size="small" paginator :rows="params.take"
                        :totalRecords="totalRecods" dataKey="id" class="ctable w-full" :loading="busy" lazy
                        :rowsPerPageOptions="[8, 10, 20, 50]" @page="onPageChange" v-model:rows="params.take"
                        v-model:page="params.skip">

                        <Column field="participant.name" header="Nome" />

                        <Column field="participant.email" header="Email" />

                        <Column field="participant.phone" header="Contacto" />

                        <Column v-if="event.data?.EventConfiguration[0]?.registrationType === 'Grupo'" header="Equipa">
                            <template #body="props">
                                {{ props.data?.teamName }}
                            </template>
                        </Column>

                        <Column field="actions" header="Opções" class="relative">
                            <template #body="props">
                                <Button severity="transparent" size="small" class="h-9" title="Emitir certificado"
                                    @click="handleSendCertificate(props.data)" :disabled="!certificate.templateId"
                                    :loading="busy">
                                    <i class="pi pi-send mr-1 text-sm" />
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
            </div>
        </div>
    </Dialog>
</template>