<script setup>
import { ref, watch } from 'vue' 
import InputText from 'primevue/inputtext';
import FloatLabel from 'primevue/floatlabel';
import Password from 'primevue/password';

const props = defineProps({
    user: {
        type: Object,
        required: true
    }
})

const emit = defineEmits(['changeCpassword'])
const confirmPassword = ref(null)
watch(confirmPassword, (value) => {
    console.log(value)
    emit('changeCpassword', value)
}, {deep: true})
</script>

<template>
    <div class="flex flex-col gap-3" >
        <div class="mb-3">
            <label for="password" class="mb-2">
                <i class="fas fa-lock me-1 text-zinc-500"></i> <small> Palavra passe </small>
            </label>

            <Password toogleMask id="password" v-model="props.user.password" class="w-full border-zinc-300 h-9 " :required="true" placeholder="A password mais forte que puderes"/>
        </div>

        <div class="mb-3">
            <label for="confirmPassword" class="mb-2">
                <i class="fas fa-lock me-1 text-zinc-500"></i> <small> Confirmar Palavra passe </small>
            </label>

            <Password toogleMask id="confirmPassword" v-model="confirmPassword" class="w-full border-zinc-300 h-9 " :required="true" placeholder="coloca igualzinho em cima"/>
        </div>

        <FloatLabel class="mb-3 opacity-0"><Password toogleMask class="w-full border-zinc-300 h-9 " :required="true"/><label><i class="fas fa-lock me-1 "></i> <small> Confirmar Palavra passe </small></label></FloatLabel>

        <FloatLabel class="opacity-0">
            <Password toogleMask class="w-full border-zinc-300 h-9 " :required="true"/>
            <label>
              <i class="fas fa-lock me-1 "></i> <small> Confirmar Palavra passe </small>
            </label>
        </FloatLabel>
        
    </div>
</template>