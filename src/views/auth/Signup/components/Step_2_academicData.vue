<script setup>
import { ref } from 'vue'
import DepartamentService from '@/services/DepartamentService.js'
import InputText from 'primevue/inputtext';
import FloatLabel from 'primevue/floatlabel';
import Dropdown from 'primevue/dropdown';
import Checkbox from 'primevue/checkbox';
import { useNotification } from '@/composables/useNotification'

const { notifyError } = useNotification()

const props = defineProps({
    user: {
        type: Object,
        required: true
    }
})

const departments = ref({
    busy: false,
    data: []
})

const isISPBStudent = ref(false)
          
async function fetchDepartments(){
    try {
        departments.value.busy = true
        const response = await DepartamentService.index()
        if(response.status === 200) {
            departments.value.data = response.data
            return
        }

        throw new Error()
    } catch (error) {
        notifyError('Erro ao buscar os departamentos')
        console.log(error)
    } finally {
        departments.value.busy = false
    }
}
fetchDepartments()
</script>

<template>
    <div class="flex flex-col gap-3" >

        <div class="flex items-center mb-3">
            <Checkbox v-model="isISPBStudent" :binary="true" class="mr-2" />
            <label for="isISPBStudent">Estudante do ISPB?</label>
        </div>

        <div class="transition-all overflow-y-hidden mb-3" :class="{'h-10': !isISPBStudent, 'h-0': isISPBStudent}">
            <FloatLabel>
                <InputText id="institution" v-model="user.institution" class="w-full border-zinc-300 h-9" :required="true"/>
                <label for="institution">
                    <i class="fas fa-university me-1 "></i> <small> Instituição </small>
                </label>
            </FloatLabel>
        </div>

        <FloatLabel class="mb-3">
            <InputText id="course" v-model="user.course" class="w-full border-zinc-300 h-9" :required="true"/>

            <label for="course">
                <i class="fas fa-book me-1 "></i> <small> Curso </small>
            </label>
        </FloatLabel>

        <div class="flex flex-col gap-2">
            <label for="department" class="ml-3 text-zinc-500">
                <i class="fas fa-book me-1 "></i> <small> Selecione um departamento </small>
            </label>
            <Dropdown id="department" v-model="user.department_id"  :options="departments.data" optionLabel="name" option-value="id" class="h-9 w-full">
                <template #value="slotProps">
                    <div v-if="slotProps.value" class="flex items-center text-black">
                        {{ departments.data.find(department => department.id === slotProps.value).name }}
                    </div>
                    <div v-else>
                        {{ slotProps.placeholder }}
                    </div>
                </template>
            </Dropdown>
        </div>
        
    </div>
</template>