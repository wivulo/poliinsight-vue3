<script setup>
import { computed } from 'vue'

const props = defineProps({
  question: {
    type: Object,
    required: true
  }
})

// Total de respostas
const totalResponses = computed(() => props.question.responses ? props.question.responses.length : 0)

// Para perguntas de múltipla escolha ou checkbox, agrupar respostas pela opção
const groupedOptions = computed(() => {
  if (props.question.type === 'multiple_choice' || props.question.type === 'checkbox') {
    const counts = {}
    if (props.question.options) {
        props.question.options.forEach(option => {
        counts[option.id] = { text: option.optionText, count: 0 }
      })
    }
    if (props.question.responses) {
        props.question.responses.forEach(response => {
        if(response.selectedOptionId && counts[response.selectedOptionId]){
          counts[response.selectedOptionId].count++
        }
      })
    }
    return Object.values(counts)
  }
  return []
})
</script>

<template>
  <div class="survey-question-responses border p-4 rounded shadow mb-4">
    <!-- Cabeçalho com a pergunta e total de respostas -->
    <div class="header mb-3">
      <h3 class="text-lg font-bold">{{ props.question.question }}</h3>
      <span class="text-sm text-gray-600">{{ totalResponses }} resposta(s)</span>
    </div>

    <!-- Exibição das respostas -->
    <div v-if="props.question.type === 'open'">
      <!-- Lista simples para respostas em texto aberto -->
      <ul class="list-disc pl-5">
        <li v-for="(resp, idx) in props.question.responses" :key="idx" class="mb-2">
          {{ resp.response }}
        </li>
      </ul>
    </div>

    <div v-else-if="props.question.type === 'multiple_choice' || props.question.type === 'checkbox'">
      <!-- Exibe cada opção com sua contagem -->
      <ul class="list-none">
        <li v-for="(option, idx) in groupedOptions" :key="idx" class="flex justify-between mb-2">
          <span>{{ option.text }}</span>
          <span class="font-semibold">{{ option.count }}</span>
        </li>
      </ul>
    </div>

    <div v-else>
      <!-- Exibe o JSON das respostas para casos não identificados -->
      <pre>{{ JSON.stringify(props.question.responses, null, 2) }}</pre>
    </div>
  </div>
</template>
