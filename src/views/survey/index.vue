<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router';
import { useStore } from 'vuex';
import { useNotification } from '@/composables/useNotification'
import SurveyServices from '@/services/SurveyServices'
import Button from "primevue/button";
import InputText from "primevue/inputtext";
import CardRoot from "@/components/PCard/CardRoot.vue"
import PLoading from '@/components/PLoading.vue';
import InputGroup from 'primevue/inputgroup';

document.title = 'Questionários | Eventos'

const store = useStore()
const user = computed(() => store.getters['auth/user'])
const router = useRouter()

const surveys = ref([])
const busy = ref(false)

async function fetchSurvey() {
  try {
    busy.value = true

    const response = await SurveyServices.showByUser(user.value.id)
    if (response.status === 200) {
      surveys.value = response.data
      return;
    }

    throw new Error()
  } catch (error) {
    console.error(error)
    notifyError(error)
  } finally {
    busy.value = false
  }
}

const store_busy = ref(false)
async function handleCreateEmptySurveyAndGoToShow() {
  try {
    store_busy.value = true

    const response = await SurveyServices.store({
      title: 'Novo Questionário',
      user_id: user.value.id
    })

    if (response.status === 201) {
      router.push({ name: 'survey.show', params: { id: response.data.id } })
      return
    }

    throw new Error()
  } catch (error) {
    console.error(error)
    notifyError(error)
  } finally {
    store_busy.value = false
  }
}

onMounted(() => {
  fetchSurvey()
})
</script>

<template>
  <div class="p-4 px-5 w-full">
    <CardRoot class="mt-4">
      <PLoading v-if="busy" />

      <div v-else class="flex flex-col gap-5">
        <h1 class="text-xl">Questionários</h1>

        <div class="flex flex-col gap-3">
          <div class="flex">
            <InputGroup>
              <Button size="small" class="h-9 bg-transparent border border-surface-300 border-r-0">
                <i class="fa fa-search text-black" />
              </Button>

              <InputText size="small" id="search" type="text" placeholder="Pesquisar..."
                class="w-full rounded-none h-9 border-l-0" :loading="busy" />
            </InputGroup>
          </div>

          <div class="flex flex-wrap gap-3">
            
            <router-link :to="{name: 'survey.create'}">
              <Button icon="pi pi-plus" class="w-32 h-32" severity="secondary" />
            </router-link>


            <RouterLink v-for="survey in surveys" :key="survey.id" :to="{name: 'survey.show', params: {id: survey.id}}" class="w-40 h-32 cursor-pointer bg-surface-200 border hover:bg-surface-100 hover:border-primary">
                <div class="h-full flex flex-col justify-between p-3">
                  <div class="flex">
                    <h2 class="text-sm font-semibold">{{ survey.title }}</h2>
                  </div>

                  <div class="flex justify-end gap-2 self-end">
                    <Button icon="pi pi-pencil" class="w-8 h-8" size="small" severity="secondary" text />
                  </div>
                </div>
            </RouterLink>
          </div>
        </div>
      </div>
    </CardRoot>
  </div>
</template>