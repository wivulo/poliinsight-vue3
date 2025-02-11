<script setup>
import { ref, watch } from 'vue'
import Button from 'primevue/button'
import Dropdown from 'primevue/dropdown'
import Textarea from 'primevue/textarea'

const props = defineProps({
    question: {
        type: Object,
        required: true
    },
    index: {
        type: Number,
        required: true
    },
    isFocused: {
        type: Boolean,
        default: false
    }
})

const emit = defineEmits(['update-question', 'remove-question', 'focus', 'add-question'])

const editableQuestion = ref({ ...props.question })

const questionTypes = [
    { label: 'Texto Aberto', value: 'open' },
    { label: 'Múltipla Escolha', value: 'multiple_choice' },
    { label: 'Caixa de Seleção', value: 'checkbox' }
]

// Watch para monitorar mudanças no tipo da pergunta
watch(
    () => editableQuestion.value.type,
    (newType) => {
        if (newType === 'open') {
            // Se o tipo for "open", elimina as opções, se existirem.
            if (editableQuestion.value.options) {
                delete editableQuestion.value.options
            }
        } else if (newType === 'multiple_choice' || newType === 'checkbox') {
            // Se o tipo for de opção, mantém as existentes,
            // mas garante que haja pelo menos uma opção vazia.
            if (!editableQuestion.value.options || editableQuestion.value.options.length === 0) {
                editableQuestion.value.options = [{ optionText: '', order: 1 }]
            }
        }
    }
)

// Função para adicionar uma nova opção
const handleAddOption = () => {
    if (!editableQuestion.value?.options) {
        editableQuestion.value.options = []
    }
    editableQuestion.value.options.push({ optionText: '', order: editableQuestion.value.options.length + 1 })
}

// Função para remover uma opção específica
const removeOption = (optionIndex) => {
    if (editableQuestion.value?.options) {
        editableQuestion.value.options.splice(optionIndex, 1)
    }
}

const removeThisQuestion = () => {
    emit('remove-question', props.index)
}

const focusQuestion = () => {
    emit('focus', props.index)
}

// Atualiza o pai sempre que a pergunta for modificada
watch(
    editableQuestion,
    (newVal) => {
        emit('update-question', props.index, newVal)
    },
    { deep: true }
)

watch(
    () => props.question,
    (newQuestion) => {
        // Compara os valores para evitar atualização redundante
        if (JSON.stringify(newQuestion) !== JSON.stringify(editableQuestion.value)) {
            editableQuestion.value = { ...newQuestion }
        }
    },
    { deep: true }
)
</script>

<template>
    <div class="relative border border-gray-300 p-4 rounded-lg shadow-sm bg-white cursor-pointer"
         @click="focusQuestion">
        <!-- Campo para editar o título da pergunta -->
        <div class="flex items-center justify-between gap-4">
            <input type="text" v-model="editableQuestion.question" placeholder="Título da pergunta"
                   class="w-full font-semibold text-lg border-b border-gray-200 p-1 focus:outline-none" />

            <Dropdown v-model="editableQuestion.type" :options="questionTypes" optionLabel="label" optionValue="value"
                      class="w-40" />
        </div>

        <div v-if="editableQuestion.type === 'open'">
            <Textarea 
                placeholder="Digite sua resposta..."
                class="w-full my-3 p-1 border border-gray-200 rounded focus:outline-none" 
                rows="2" />
        </div>

        <div v-else-if="editableQuestion.type === 'multiple_choice'">
            <div v-for="(option, index) in editableQuestion?.options" :key="option.order" class="flex gap-2 items-center mt-2">
                <div class="flex gap-2 items-center my-1 w-full">
                    <input type="radio" class="w-5 h-5 accent-primary" disabled />
                    <input type="text" v-model="option.optionText" placeholder="Opção" class="w-full p-1 border-b border-gray-200 rounded focus:outline-none" />
                </div>
                <Button icon="pi pi-times" severity="danger" text rounded class="w-6 h-6" @click="removeOption(index)" />
            </div>

            <Button icon="pi pi-plus" severity="secondary" label="Adicionar opção" @click="handleAddOption" class="mt-2 h-8" text size="small" />
            <span class="text-sm text-surface-400 mx-2">ou adicionar</span>
            <Button severity="secondary" label="Outro" @click="handleAddOption" class="mt-2 h-8" text size="small" />
        </div>

        <div v-else-if="editableQuestion.type === 'checkbox'">
            <div v-for="(option, index) in editableQuestion?.options" :key="option.order" class="flex gap-2 items-center mt-2">
                <div class="flex gap-2 items-center my-1 w-full">
                    <input type="checkbox" class="w-5 h-5 accent-primary" disabled />
                    <input type="text" v-model="option.optionText" placeholder="Opção" class="w-full p-1 border-b border-gray-200 rounded focus:outline-none" />
                </div>
                <Button icon="pi pi-times" severity="danger" text rounded class="w-6 h-6" @click="removeOption(index)" />
            </div>

            <Button icon="pi pi-plus" severity="secondary" label="Adicionar opção" @click="handleAddOption" class="mt-2 h-8" text size="small" />
            <span class="text-sm text-surface-400 mx-2">ou adicionar</span>
            <Button severity="secondary" label="Outro" @click="handleAddOption" class="mt-2 h-8" text size="small" />
        </div>

        <!-- Toolbox flutuante que acompanha a pergunta em foco -->
        <div v-if="isFocused"
             class="absolute top-0 right-[-60px] w-[50px] bg-gray-100 p-2 px-3 rounded-lg shadow-xl flex flex-col items-center gap-4">

            <Button @click.stop="$emit('add-question')" icon="pi pi-plus-circle" severity="secondary" rounded
                    size="small" class="w-8 h-8" v-tooltip.right="'Nova pergunta'" />

            <Button icon="pi pi-pen-to-square" severity="secondary" rounded size="small"
                    class="w-8 h-8" v-tooltip.right="'Descrição'" />

            <Button @click.stop="removeThisQuestion" icon="pi pi-trash" severity="secondary" rounded size="small"
                    class="w-8 h-8" v-tooltip.right="'Eliminar pergunta'" />
        </div>
    </div>
</template>
