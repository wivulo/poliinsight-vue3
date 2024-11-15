<script>
import InputText from 'primevue/inputtext';
import InputNumber from 'primevue/inputnumber';
import Dropdown from 'primevue/dropdown'
import Calendar from 'primevue/calendar';
import PaidEvent from './PaidEvent.vue';
import ParticipantServices from '@/services/ParticipantServices.js'
import RegistrationServices from '@/services/RegistrationServices.js'

export default {
    name: 'Registration.template.seminar',
    props: ['fields'],
    components: {
        InputText, InputNumber,
        Dropdown, Calendar
    },
    data(){
        return {
            data: {},
            registration: {
                data: {},
                busy: false
            },
        }
    },
    methods: {
        reset(){
            this.data = {}
        },

        async handleMakeRegistration(){
            try {
                this.registration.data = this.$refs.SingleInformation.data

                this.registration.busy = true
                let response = await ParticipantServices.store(this.registration.data)

                if(response.data?.error || response.status > 299) throw new Error('Error')

                const participante = response.data

                response = await RegistrationServices.store({
                    eventId: this.event?.id,
                    userId: null,
                    participantId: participante?.id,
                    ticketId: null
                })

                if(response.data?.error || response.status > 299) throw new Error('Error')


                this.$swal.fire('Sucesso', 'Inscrição feita com sucesso', 'success')
                this.handleReset()
            } catch (error) {
                this.$toast.add({severity: 'error', summary: 'Erro', detail: 'Erro ao fazer a inscrição', life: 3000})
            } finally {
                this.registration.busy = false
            }
        },

    },
}
</script>

<template>
    <div class="flex flex-wrap gap-3">
        <template v-for="field in fields" :key="field.name">
            <template v-if="field.type === 'text' || field.type === 'email'">
                <div class="form-group">
                    <label :for="field.name" class="ml-2">
                        <i class="fas fa-user me-1 "></i> <small> {{ field.label }} </small>
                    </label>
                    <InputText :id="field.name" v-model="data[field.name]" class="w-full border-zinc-300 h-9" :required="field.required" :placeholder="field.placeholder" v-if="field.visibility" />
                </div>
            </template>

            <template v-else-if="field.type === 'tel'">
                <div class="form-group">
                    <label :for="field.name" class="ml-2">
                        <i class="fas fa-phone me-1 "></i> <small> {{ field.label }} </small>
                    </label>
                    <InputNumber :id="field.name" v-model="data[field.name]" class="w-full border-zinc-300 h-9" :required="field.required" :placeholder="field.placeholder" v-if="field.visibility" />
                </div>
            </template>

            <template v-else-if="field.type === 'date'">
                <div class="form-group">
                    <label :for="field.name" class="ml-2">
                        <i class="fas fa-calendar me-1" /> <small> {{ field.label }} </small>
                    </label>
                    <Calendar :id="field.name" v-model="data[field.name]" class="border-zinc-300 h-9 focus:outline-zinc-400 w-full" inputClass="hover:border-zinc-400" :required="field.required" :placeholder="field.placeholder" v-if="field.visibility" />
                </div>
            </template>

            <template v-else-if="field.type === 'dropdown'">
                <div class="form-group flex flex-col">
                    <label :for="field.name" class="ml-2">
                        <i class="fas fa-user me-1" /> <small> {{ field.label }} </small>
                    </label>
                    <Dropdown :id="field.name" v-model="data[field.name]" :options="field.options" optionLabel="label" optionValue="value" :required="field.required" :placeholder="field.placeholder" v-if="field.visibility" class="h-9 w-full bg-white"  />
                </div>
            </template>

        </template>
    </div>
</template>

<style>
.form-group {
    @apply my-1 w-[47%]
}
</style>