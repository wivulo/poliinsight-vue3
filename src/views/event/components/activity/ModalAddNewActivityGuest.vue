<script lang="ts" setup>
import { ref, reactive, watch } from 'vue';
import ActivityServices from '@/services/ActivityServices';
import UserServices from '@/services/UserServices'
import { useNotification } from '@/composables/useNotification';
import { useRouter } from 'vue-router';
import { useVuelidate } from '@vuelidate/core'
import { required } from '@vuelidate/validators'
import { GuestType } from '@/model/activity.model';
import { useUploadImage } from '@/composables/useUploadImage';
import Dialog from 'primevue/dialog';
import Button from 'primevue/button';
import InputText from 'primevue/inputtext';
import Textarea from 'primevue/textarea';
import InputGroup from 'primevue/inputgroup';
import Dropdown from 'primevue/dropdown';
import RadioButton from 'primevue/radiobutton';
import InputNumber from 'primevue/inputnumber';
import Avatar from 'primevue/avatar';
import Image from 'primevue/image';
import { SwalConfirmAlert } from '@/helpers/swalConfirmAlert';

const emit = defineEmits(['created']);
const { notifyError, notifySuccess } = useNotification();
const router = useRouter();
const { upload } = useUploadImage();


let visible = ref(false);
let busy = ref(false);

let guest = ref({
    name: null,
    email: null,
    phone: null,
    imageURL: null,
    biography: null,
    roleInActivity: null,
    userId: null,
    activityId: null
});
let activity = ref(null);
const rules = {
    phone: { required },
    activityId: { required },
    roleInActivity: { required },
};
const v$ = useVuelidate(rules, guest);

const haveAccount = ref(false);
const users = ref({
    busy: false,
    data: []
});
const file = ref<File | null>(null);
const fileInputRef = ref<HTMLInputElement | null>(null);
const imageUrl = ref<string | null>(guest.value.imageURL);
const uploadImage = ref({
    busy: false,
    url: null
});

function show(activity: any) {
    visible.value = true;
    activity.value = activity;
    guest.value.activityId = activity.id;
}

function handleHidden() {
    visible.value = false;
}

function handleReset() {
    busy.value = false;
    activity.value = null;
    guest.value = null;
    v$.value.$reset()
}

function handleCancel() {
    handleHidden()
    handleReset()
}


function handleOK() {
    v$.value.$touch()
    if(v$.value.$error) {
        notifyError('Preencha todos os campos obrigatórios!')
        return
    }

    store()
}

async function store() {
    try {
        if(!await SwalConfirmAlert())  return

        busy.value = true;

        const response = await ActivityServices.storeGuest(guest.value);
        if(response.status === 201 || response.status === 200) {
            notifySuccess('Convidado adicionado com sucesso!');
            emit('created', guest.value.activityId);
            handleCancel();
            return;
        }

        throw new Error();
    } catch (error) {
        console.error(error);
        notifyError('Erro ao adicionar convidado!');
    } finally {
        busy.value = false;
    }
}

async function fetchUsers(){
    const params = {
        where: [{field: 'groups', value: { some: { group: { name: "convidado"}}}}]
    }

    try {
        users.value.busy = false
        const response = await UserServices.search(params)

        if(response.status === 200) {
            users.value.data = response.data
            return
        }

        throw new Error()
    } catch(error) {
        notifyError('Erro ao buscar os usuários')
        console.log(error)
    }
}

const handleFileChange = (event: Event) => {
    const target = event.target as HTMLInputElement;
    if (target.files && target.files.length > 0) {
        file.value = target.files[0];
        imageUrl.value = URL.createObjectURL(file.value);
    }
};

const triggerFileInput = () => {
    if (fileInputRef.value) {
        fileInputRef.value.click();
    }
};

const handleUploadGuestImage = async () => {
    try {
        if(!file.value) return

        if(!await SwalConfirmAlert()) {
            file.value = null;
            return
        };

        uploadImage.value.busy = true;
        const imageUrl = await upload(file.value);
        if(imageUrl) {
            guest.value.imageURL = imageUrl;
            return
        }
    } catch (error) {
        notifyError('Erro no upload da imagem')
        console.log(error)
    } finally {
        uploadImage.value.busy = false;
    }
}

watch(haveAccount, (value) => {
    if(value) {
        fetchUsers()
    }
})

//expor a função show para ser usada no componente pai
defineExpose({ show });
</script>

<template>
    <Dialog v-model:visible="visible" modal header="Novo Convidado" :style="{ width: '35rem' }">        
        <div class="flex flex-col gap-5 text-sm">
            <div class="flex flex-col gap-1">
                <label>O convidade tem uma conta no App?</label>
                
                <div class="flex align-items-center">
                    <RadioButton v-model="haveAccount" inputId="dont" name="dont" :value="false" />
                    <label for="dont" class="ml-2">Não</label>
                </div>
                <div class="flex align-items-center">
                    <RadioButton v-model="haveAccount" inputId="yes" name="yes" :value="true" />
                    <label for="yes" class="ml-2">Sim</label>
                </div>
            </div>

            <div class="flex flex-col gap-1" v-if="haveAccount">
                <label for="user">Convidado</label>
                <!-- <PDropdown :options="users.data" :data="users.data" :loading="users.busy" /> -->
                <Dropdown id="department" v-model="guest.userId"  :options="users.data" optionLabel="name" option-value="id" placeholder="Selecione um convidado" class="h-9">
                    <template #value="slotProps">
                        <div v-if="slotProps.value" class="flex items-center text-black">
                            {{ users.data.find(user => user.id === slotProps.value).name }}
                        </div>
                        <div v-else>
                            {{ slotProps.placeholder }}
                        </div>
                    </template>
                </Dropdown>
            </div>

            <div v-else class="flex gap-5 w-full justify-center items-center mb-5">
                <div class="flex justify-center items-center basis-1/3 h-42 relative group">
                    <div class="relative w-36 h-36 rounded-full overflow-hidden flex justify-center items-center">
                        <Image v-if="imageUrl" :src="imageUrl" alt="Foto do convidado" class="object-fit" />

                        <Avatar 
                            v-else icon="fa fa-user" shape="circle" size="xlarge" 
                            class="cursor-pointer hover:scale-110 transform transition-transform w-36 h-36"
                        />
                    </div>

                    <div class="w-full hidden group-hover:flex items-end justify-end absolute bottom-0 gap-2">
                        <Button 
                            icon="pi pi-plus text-black"
                            severity="secondary" size="small"
                            class="w-8 h-8" rounded
                            @click="triggerFileInput"
                            title="escolher foto do convidado"
                        />

                        <Button 
                            icon="pi pi-times text-primary"
                            severity="secondary" size="small"
                            class="w-8 h-8" rounded
                            @click="imageUrl = null"
                            title="Remover foto actual"
                        />

                        <Button 
                            icon="pi pi-cloud-upload text-green-500"
                            severity="secondary" size="small"
                            class="w-8 h-8" rounded
                            @click="handleUploadGuestImage"
                            title="Fazer upload da foto do convidado"
                            :loading="uploadImage.busy"
                        >
                            <span class="ml-1" v-if="uploadImage.busy">
                                carregando...
                            </span>
                        </Button>
                    </div>
                    
                    <input 
                        type="file" 
                        class="hidden" 
                        ref="fileInputRef"
                        accept="image/*"
                        @change="handleFileChange"
                    />
                </div>

                <div class="flex flex-col gap-3 w-2/3">
                    <div class="flex flex-col gap-1 w-full">
                        <label for="name">Nome</label>
                        <InputText v-model="guest.name" id="name" class="h-9" 
                            placeholder="Ex.: João da Silva"
                        />
                    </div>

                    <div class="flex flex-col gap-1 w-full">
                        <label for="email">E-mail</label>
                        <InputText v-model="guest.email" id="email" class="h-9" 
                            placeholder="Ex.: sample@poliinsight.ao" />
                    </div>
                </div>
            </div>

            <div class="flex gap-5 items-center">
                <div class="flex flex-col gap-1 grow">
                    <label for="phone">Contacto</label>
                    <InputNumber v-model="guest.phone" id="phone" class="h-9" 
                        placeholder="Ex.: 92xxxxxxx" />
                </div>

                <div class="flex flex-col gap-1 justify-center grow">
                    <!-- <p class="text-xs text-zinc-400">O que o convidado fará?</p> -->
                    <label for="roleInActivity">Função</label>

                    <Dropdown id="roleInActivity" v-model="guest.roleInActivity"  :options="['Palestrante', 'Apresentador', 'Discursor', 'Telespectador']" placeholder="Selecione uma função" class="h-9">
                        <template #value="slotProps">
                            <div v-if="slotProps.value" class="flex items-center text-black">
                                {{ slotProps.value }}
                            </div>
                            <div v-else>
                                {{ slotProps.placeholder }}
                            </div>
                        </template>
                    </Dropdown>
                </div>
            </div>

            <div class="flex flex-col gap-1">
                <label for="biography">
                    Biografia <span class="text-xs text-zinc-400">(opcional)</span>
                </label>
                <Textarea v-model="guest.biography" id="biography" rows="2" 
                    class="hover:border-zinc-300" placeholder="Ex.: Engenheiro de software, especialista em desenvolvimento web..."
                />
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