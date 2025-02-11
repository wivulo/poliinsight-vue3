<script setup>
import { ref, onMounted, computed } from 'vue'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'
import { useEventServices } from '@/composables/useEventServices'
import SurveyServices from '@/services/SurveyServices'
import { useNotification } from "@/composables/useNotification";
import Button from 'primevue/button'
import Dropdown from 'primevue/dropdown'
import InputText from 'primevue/inputtext'
import SurveyQuestion from './components/SurveyQuestion .vue'
import { ConfirmSwal } from '@/helpers/fireSwal';
import TabView from 'primevue/tabview'
import TabPanel from 'primevue/tabpanel'
import SurveyQuestionResponses from './components/SurveyQuestionResponses.vue'

document.title = 'Questionário | Eventos'

const store = useStore()
const router = useRouter()
const { busy, events, fetchEventsOrganizer } = useEventServices()
const { notifyError, notifySuccess } = useNotification()

const loading = ref(false)
const questionnaireTitle = ref("Novo Questionário")
const selectedEvent = ref(null)
const questions = ref([
    { order: 1, type: 'open', question: 'Titulo da Pergunta' }
])
const focusedIndex = ref(null)

async function fetchSurvey() {
    try {
        loading.value = true
        const response = await SurveyServices.show(router.currentRoute.value.params.id)
        if(response.status === 200) {
            questionnaireTitle.value = response.data.title
            selectedEvent.value = response.data.event
            questions.value = [...response.data.questions]
            return
        }

        throw new Error()
    } catch (error) {
        console.error(error)
        notifyError(error)
    } finally {
        loading.value = false
    }
}

const addQuestion = () => {
    questions.value.push({
        order: questions.value.length + 1,
        type: 'open',
        question: 'Titulo da Pergunta',
    })
}

const updateQuestion = (index, updatedQuestion) => {
    questions.value[index] = updatedQuestion
}

const removeQuestion = (index) => {
    questions.value.splice(index, 1)
}

const setFocus = (index) => {
    focusedIndex.value = index
}

/**
 * Validação do formulário:
 * 1. Verifica se um evento foi selecionado.
 * 2. Verifica se há pelo menos uma pergunta completa.
 */
const validateQuestionnaire = () => {
    if (!selectedEvent.value) {
        notifyError('Selecione um evento antes de prosseguir.')
        return false
    }

    if (questions.value.length === 0) {
        notifyError('Adicione pelo menos uma pergunta.')
        return false
    }

    let completeQuestionExists = false

    // Percorre cada pergunta para verificar se está "completa"
    for (const q of questions.value) {
        // Verifica se o título está preenchido
        if (q.question && q.question.trim() !== '') {
            // Para perguntas abertas, considerar como completa se o título estiver preenchido
            if (q.type === 'open') {
                completeQuestionExists = true
                break
            }
            // Para perguntas com opções, garantir que existam opções com texto preenchido
            else if ((q.type === 'multiple_choice' || q.type === 'checkbox') && q.options && q.options.length > 0) {
                const validOptions = q.options.filter(o => o.text && o.optionText.trim() !== '')
                if (validOptions.length > 0) {
                    completeQuestionExists = true
                    break
                }
            }
        }
    }

    if (!completeQuestionExists) {
        notifyError('Adicione pelo menos uma pergunta completa antes de publicar.')
        return false
    }

    return true
}

const saveQuestionnaire = async () => {
    if(router.currentRoute.value.params.id) {
        update()
        return
    }

    try {
        // Validação: garante que um evento foi selecionado antes de salvar.
        if (!selectedEvent.value) {
            notifyError('Selecione um evento antes de prosseguir.')
            return
        }

        if(!questionnaireTitle.value || questionnaireTitle.value === 'Novo Questionário') {
            notifyError('Informe um título para o questionário.')
            return
        }

        const result = await ConfirmSwal()
        if (!result.isConfirmed) {
            return
        }

        loading.value = true
        const response = await SurveyServices.store({
            title: questionnaireTitle.value,
            eventId: selectedEvent.value.id,
            questions: questions.value
        })

        if(response.status === 201) {
            notifySuccess('Questionário salvo com sucesso!')
            return
        }

        throw new Error()
    } catch (error) {
        console.error(error)
        notifyError(error)
    } finally {
        loading.value = false
    }
}

const update = async () => {
    try {
        if (!selectedEvent.value) {
            notifyError('Selecione um evento antes de prosseguir.')
            return
        }

        if(!questionnaireTitle.value || questionnaireTitle.value === 'Novo Questionário') {
            notifyError('Informe um título para o questionário.')
            return
        }

        const result = await ConfirmSwal()
        if (!result.isConfirmed) {
            return
        }

        loading.value = true
        const response = await SurveyServices.update(router.currentRoute.value.params.id, {
            title: questionnaireTitle.value,
            eventId: selectedEvent.value.id,
            questions: questions.value
        })

        if(response.status === 200) {
            notifySuccess('Questionário atualizado com sucesso!')
            return
        }

        throw new Error()
    } catch (error) {
        console.error(error)
        notifyError(error)
    } finally {
        loading.value = false
    }
}

const publishQuestionnaire = () => {
    // Chama a função de validação antes de publicar
    if (validateQuestionnaire()) {
        console.log("Publicando questionário", {
            title: questionnaireTitle.value,
            event: selectedEvent.value,
            questions: questions.value
        })
        // Aqui você chama a API para publicar o questionário
    }
}

// Propriedade para calcular o total de respostas do questionário
const totalSurveyResponses = computed(() => {
	return questions.value.reduce((acc, q) => acc + (q.responses ? q.responses.length : 0), 0)
})

// Carrega a lista de eventos ao montar o componente
onMounted(() => {
    const user = computed(() => store.getters['auth/user'])
    user.value && fetchEventsOrganizer(user.value?.id)

    router.currentRoute.value.params.id && fetchSurvey()
})
</script>

<template>
    <div class="min-h-screen">
        <!-- Cabeçalho -->
        <header class="bg-white shadow p-4 flex flex-col md:flex-row items-end justify-between gap-4">
            <div class="flex flex-col gap-2">
                <InputText v-model="questionnaireTitle" type="text" placeholder="Título do Questionário"
                    class="text-2xl font-bold h-10 !border-0" />

                <Dropdown v-model="selectedEvent" :options="events" option-label="name"
                    placeholder="Selecione um evento" class="w-60" :loading="busy" />
            </div>

            <div class="flex items-end gap-3">
                <Button @click="saveQuestionnaire" icon="pi pi-save" severity="secondary" class="w-8 h-8" 
                    :loading="loading"/>
                <Button @click="saveQuestionnaire" icon="pi pi-eye" severity="secondary" class="w-8 h-8" />
                <!-- No botão de publicação, a validação é realizada para garantir que haja perguntas completas -->
                <Button @click="publishQuestionnaire" label="Publicar" class="h-8" />
            </div>
        </header>

        <TabView>
            <TabPanel header="Perguntas">
                <div class="flex w-full mx-auto mt-2 justify-center">
                    <main class="w-3/4 p-4 space-y-4">
                        <div v-for="(question, index) in questions" :key="question.order" class="relative mb-3">
                            <SurveyQuestion :question="question" :index="index" :is-focused="focusedIndex === index"
                                @update-question="updateQuestion" @remove-question="removeQuestion" @focus="setFocus"
                                @add-question="addQuestion" />
                        </div>
                    </main>
                </div>
            </TabPanel>
            
            <TabPanel :header="`Respostas (${totalSurveyResponses})`">
                <div class="flex w-full mx-auto mt-2 justify-center">
                    <main class="w-3/4 p-4 space-y-4">
                        <div v-for="(question, index) in questions" :key="question.order">
                            <SurveyQuestionResponses :question="question" />
                        </div>
                    </main>
                </div>
            </TabPanel>
        </TabView>
    </div>
</template>
