<script setup>
import { ref, reactive, computed, onMounted, watch } from 'vue'
import { useNotification } from '@/composables/useNotification'
import { useRouter } from 'vue-router'
import ParticipantServices from '@/services/ParticipantServices';
import RegistrationServices from '@/services/RegistrationServices';
import Dialog from 'primevue/dialog';
import Button from 'primevue/button'
import InputText from 'primevue/inputtext';
import FloatLabel from 'primevue/floatlabel';
import InlineMessage from 'primevue/inlinemessage';

const emit = defineEmits(['checked']);
const router = useRouter()
const { notifyError, notifySuccess } = useNotification()

const visible = ref(false)
const busy = ref(false)
let submited = ref(false);
const email = ref(null)
const user = ref(null)

function show() {
    visible.value = true;
}

function handleReset() {
    user.value = null
    submited.value = false
}

function handleCancel() {
    handleHidden()
    handleReset()

    router.push({ name: 'home' })
}

function handleHidden() {
    visible.value = false;
}

function handleUserCloseWithuserCheckOpenAgain() {
    if(!submited.value && !user.value){
        visible.value = true
    }
}

async function handleOK() {
    try {
        if (!email.value) {
            notifyError("Por favor, informe o email.")
            return
        }

        if(!email.value.includes('@') || !email.value.includes('.')){
            notifyError("Por favor, informe um email válido.")
            return
        }

        if(!router.currentRoute.value.query.eventId){
            notifyError("Evento não encontrado.")
            return
        }

        busy.value = true
        const response = await RegistrationServices.checkUserByEmail(email.value, router.currentRoute.value.query.eventId)
        if(response.status === 200){
            submited.value = true
            user.value = response.data
            emit('checked', {email: email.value, participant: response.data})
            handleHidden()
            return
        }

        console.log(response)
        notifyError("Usuário não encontrado.")
    } catch (error) {
        console.error(error)
        notifyError(error.message)
    } finally {
        busy.value = false
    }
}

// watch(visible, (value) => {
//     if (value === false) {
//         handleUserCloseWithuserCheckOpenAgain()
//     }
// })

defineExpose({ show });
</script>

<template>
    <Dialog v-model:visible="visible" modal header="Verificar Utilizador" :style="{ width: '32rem' }" @hide="handleUserCloseWithuserCheckOpenAgain">
        <div class="mb-3 text-md text-surface-700">
            <p>Notamos que não está logado, porfavor informe o seu email</p>
            <p class="font-semibold">Precisa estar inscrito no evento, para poder responder a esse questionário!</p>
        </div>

        <FloatLabel class="my-3">
            <InputText id="email" v-model="email" class="w-full h-9 " :required="true" />

            <label for="email">
                <i class="fas fa-envelope me-1 "></i> <small> E-mail </small>
            </label>
        </FloatLabel>

        <template #footer>
            <div class="flex gap-3 justify-end">
                <Button severity="secondary" text @click.stop="handleCancel" size="small" class="h-8">
                    <i class="fa fa-times mr-1" /> Cancelar
                </Button>
                <Button @click.stop="handleOK" size="small" class="h-8" :loading="busy">
                    <i class="fas fa-spinner animate-spin mr-1" v-if="busy" />
                    <i class="fa fa-save mr-1" /> {{ busy ? 'Verificando...' : 'Verificar' }}
                </Button>
            </div>
        </template>
    </Dialog>
</template>