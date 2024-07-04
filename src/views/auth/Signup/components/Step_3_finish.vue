<script>
import InputText from 'primevue/inputtext';
import FloatLabel from 'primevue/floatlabel';
import Password from 'primevue/password';

export default {
    name: "Step_3_finish",
    props: {
        user: {
            type: Object,
            required: true
        }
    },
    components: {
        InputText, FloatLabel, Password
    },
}
</script>

<template>
    <div class="flex flex-col gap-3" >
        <div class="mb-3">
            <label for="password" class="mb-2">
                <i class="fas fa-lock me-1 text-zinc-500"></i> <small> Palavra passe </small>
            </label>

            <Password toogleMask id="password" v-model="user.password" class="w-full border-zinc-300 h-9 " :required="true" placeholder="A password mais forte que puderes"/>
        </div>

        <div class="mb-3">
            <label for="confirmPassword" class="mb-2">
                <i class="fas fa-lock me-1 text-zinc-500"></i> <small> Confirmar Palavra passe </small>
            </label>

            <Password toogleMask id="confirmPassword" v-model="user.confirmPassword" class="w-full border-zinc-300 h-9 " :required="true" placeholder="coloca igualzinho em cima"/>
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