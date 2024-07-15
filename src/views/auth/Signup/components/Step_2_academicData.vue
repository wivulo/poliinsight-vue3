<script>
import InputText from 'primevue/inputtext';
import FloatLabel from 'primevue/floatlabel';
import Dropdown from 'primevue/dropdown';
import Checkbox from 'primevue/checkbox';

export default {
    name: "Step_1_PersonalData",
    props: {
        user: {
            type: Object,
            required: true
        }
    },
    components: {
        InputText, FloatLabel, Dropdown, Checkbox
    },
}
</script>

<template>
    <div class="flex flex-col gap-3" >

        <div class="flex items-center mb-3">
            <Checkbox v-model="user.isISPBStudent" :binary="true" class="mr-2" />
            <label for="isISPBStudent">Estudante do ISPB?</label>
        </div>

        <div class="transition-all overflow-y-hidden mb-3" :class="{'h-10': !user.isISPBStudent, 'h-0': user.isISPBStudent}">
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

        <FloatLabel>
            <InputText id="department" v-model="user.department" class="w-full border-zinc-300 h-9 " :required="true" />

            <label for="department">
                <i class="fas fa-book me-1 "></i> <small> Departamento </small>
            </label>
        </FloatLabel>
        
    </div>
</template>