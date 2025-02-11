<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useStore } from 'vuex';
import SurveyServices from '@/services/SurveyServices'
import { useNotification } from '@/composables/useNotification'
import Button from 'primevue/button'
import InputText from 'primevue/inputtext'
import Textarea from 'primevue/textarea'
import CardRoot from '@/components/PCard/CardRoot.vue'
import { ConfirmSwal } from '@/helpers/fireSwal'
import PotentialUserToResponseTheSurvey from './components/PotentialUserToResponseTheSurvey.vue';
import { extractUser } from './utils/extractUser';

const router = useRouter()
const store = useStore()
const { notifyError, notifySuccess } = useNotification()

const loading = ref(false)
const surveyTitle = ref("")
document.title = 'Responder Questionário ' + surveyTitle.value;

const surveyDescription = ref("")
const questions = ref([])
const submitted = ref(false)
// Armazena as respostas: chave = question.id; valor = '' para "open", ou option id(s) para outras
const responses = ref({})

//Usuário logado ou participante sem conta
const user = computed(() => store.getters['auth/user'])
const participant = ref(null)

async function fetchSurvey() {
    try {
        loading.value = true
        const res = await SurveyServices.show(router.currentRoute.value.params.id)
        if (res.status === 200) {
            surveyTitle.value = res.data.title
            surveyDescription.value = res.data.description || ""
            questions.value = res.data.questions
            // Inicializa respostas conforme o tipo da questão
            questions.value.forEach(q => {
                responses.value[q.id] = (q.type === 'checkbox') ? [] : ''
            })
            return
        }
        throw new Error("Erro ao carregar o questionário.")
    } catch (error) {
        notifyError(error.message)
    } finally {
        loading.value = false
    }
}

const submitResponses = async () => {
    try {

        // Valida se pelo menos uma pergunta foi respondida
        if (!Object.values(responses.value).some(r => r !== '')) {
            notifyError("Por favor, responda ao menos uma pergunta.")
            return
        }

        const result_swal = await ConfirmSwal()
        if (!result_swal.isConfirmed) return

        loading.value = true
        // Monta o payload com base no schema.prisma (SurveyResponse)
        let payload = Object.keys(responses.value).map(qId => {
            const q = questions.value.find(item => item.id == qId)
            if (q.type === 'open') {
                return { questionId: parseInt(qId), response: responses.value[qId] }
            } else if (q.type === 'multiple_choice') {
                return { questionId: parseInt(qId), selectedOptionId: responses.value[qId] }
            } else if (q.type === 'checkbox') {
                return { questionId: parseInt(qId), selectedOptionIds: responses.value[qId] }
            }
        })

        if(user.value) {
            payload = payload.map(item => {
                if(user.value?.userId) {
                    return {
                        ...item,
                        userId: user.value?.userId
                    }
                }

                else if(user.value?.participantId) {
                    return {
                        ...item,
                        participantId: user.value?.participantId
                    }
                }

                else if(user.value?.id) {
                    return {
                        ...item,
                        userId: user.value?.id
                    }
                }

                return item
            })
        }

        const result = await SurveyServices.submitResponses(router.currentRoute.value.params.id, payload)
        if (result.status === 200) {
            notifySuccess("Respostas enviadas com sucesso!")
            submitted.value = true
            // router.push('/') // redireciona ou realiza outra ação
        }
    } catch (error) {
        console.error(error)
        notifyError(error.message)
    } finally {
        loading.value = false
    }
}

const PotentialUserToResponseTheSurveyRef = ref(null)
function handleShowModalPotentialUserToResponseTheSurvey() {
    if (!PotentialUserToResponseTheSurveyRef.value) {
        PotentialUserToResponseTheSurveyRef.value = PotentialUserToResponseTheSurvey
    }
    PotentialUserToResponseTheSurveyRef.value.show()
}

function handleUserchecked({email, participant}) {
    const result = extractUser(participant, email)
    user.value = result.user
}

onMounted(() => {
    fetchSurvey()

    //checa se existe um usuário logado, caso não, exibe o modal para o usuário se identificar
    if (user.value) {
        handleShowModalPotentialUserToResponseTheSurvey()
    }
})
</script>

<template>
    <div class="min-h-screen w-full flex justify-center p-4">
        <PotentialUserToResponseTheSurvey ref="PotentialUserToResponseTheSurveyRef" @checked="handleUserchecked" />

        <div class="max-w-[1300px] w-3/5">
            <header class="mb-6">
                <CardRoot>
                    <h2 class="text-2xl font-bold mb-2">{{ surveyTitle }}</h2>
                    <p class="text-gray-700">{{ surveyDescription }}</p>
                </CardRoot>
            </header>

            <div v-if="submitted" class="mb-6">
                <CardRoot class="text-center w-full">
                    <p class="text-lg font-semibold">Obrigado por responder ao questionário!</p>
                </CardRoot>
            </div>

            <form v-else @submit.prevent="submitResponses" class="space-y-6">
                <CardRoot v-for="(question, idx) in questions" :key="question.id" class="border p-4 rounded-lg">
                    <p class="text-lg font-semibold mb-2">{{ question.question }}</p>
                    
                    <div v-if="question.type === 'open'">
                        <Textarea v-model="responses[question.id]" rows="3" placeholder="Sua resposta..."
                            class="w-full hover:border-surface-400" />
                    </div>

                    <div v-else-if="question.type === 'multiple_choice'">
                        <div v-for="option in question.options" :key="option.id" class="flex items-center mb-2">
                            <input type="radio" :value="option.id" v-model="responses[question.id]" class="mr-2 accent-primary" />
                            <label>{{ option.optionText }}</label>
                        </div>
                    </div>

                    <div v-else-if="question.type === 'checkbox'">
                        <div v-for="option in question.options" :key="option.id" class="flex items-center mb-2">
                            <input type="checkbox" :value="option.id" v-model="responses[question.id]" class="mr-2 accent-primary" />
                            <label>{{ option.optionText }}</label>
                        </div>
                    </div>

                    <div v-else>
                        <!-- fallback -->
                        <InputText v-model="responses[question.id]" placeholder="Sua resposta..." />
                    </div>
                </CardRoot>

                <div class="flex justify-end">
                    <Button label="Enviar" type="submit" :loading="loading" size="small" class="h-9" />
                </div>
            </form>
        </div>
    </div>
</template>
