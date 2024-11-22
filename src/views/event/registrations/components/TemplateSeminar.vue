<script>
import InputText from 'primevue/inputtext';
import InputNumber from 'primevue/inputnumber';
import Dropdown from 'primevue/dropdown'
import Calendar from 'primevue/calendar';
import PaidEvent from './PaidEvent.vue';
import ParticipantServices from '@/services/ParticipantServices.js'
import RegistrationServices from '@/services/RegistrationServices.js'
import Button from 'primevue/button';
import { data } from 'autoprefixer';

export default {
    name: 'Registration.template.seminar',
    props: ['fields', 'event'],
    components: {
        InputText, InputNumber, Button,
        Dropdown, Calendar, PaidEvent,
    },
    data(){
        return {
            data: {
                name: null,
                email: null,
                phone: null,
                birthdate: null,
                gender: null
            },
            registration: {
                data: {},
                busy: false
            },
            genders: [
                { label: 'Masculino', value: 'male' },
                { label: 'Feminino', value: 'female' }
            ],

            validation: {
                data: {
                    name: {required: true},
                    email: {required: true},
                    phone: {required: true},
                }
            },
        }
    },
    methods: {
        reset(){
            this.data = {}
        },

        async handleMakeRegistration(){
            try {
                const [valid, names] = this.verifyRequiredFields(this.data)
                if(!valid) {
                    this.handleErrorMessage('Preencha todos os campos obrigatórios');
                    return;
                };

                const result = await this.$swal.fire({
                    text: 'Tem a certeza?',
                    icon: 'warning',
                    showCancelButton: true,
                    cancelButtonText: 'Não',
                    confirmButtonText: 'Sim, tenho',
                    confirmButtonColor: '#EF4444',
                    cancelButtonColor: '#CBD5E1',
                })

                if(!result.isConfirmed) return

                this.registration.data = {
                    ...this.registration.data,
                    ...this.data
                }

                this.registration.busy = true

                // console.log(this.registration.data)
                
                const response = await RegistrationServices.store({
                    eventId: this.$route.params.id,
                    participant: {
                        name: this.registration.data?.name,
                        email: this.registration.data?.email,
                        phone: this.registration.data?.phone,
                        birthdate: this.registration.data?.birthdate,
                        gender: this.registration.data?.gender
                    },
                    team: null,
                    ticketId: this.registration.data?.ticket.ticketId ?? null,
                    data: {
                        ...this.registration.data?.data,
                        paymentMode: this.registration.data?.ticket.payment_mode ?? null,
                    }
                })

                if(response.data?.error || response.status > 299) throw new Error('Erro ao fazer a inscrição')


                this.$swal.fire('', 'Inscrição feita com sucesso', 'success')
                this.$emit('created:registration')
                this.reset()
            } catch (error) {
                this.handleErrorMessage(error)
            } finally {
                this.registration.busy = false
            }
        },

        handleRegistrationUpdate(value){
            this.registration.data = {
                ...this.registration.data,
                ticket: value
            }
        },

        verifyRequiredFields(fields){
            let fieldInvalidName = [];

            const fieldInvalid = Object.entries(fields).reduce((acc, [key, value]) => {
                if (this.validation.data[key]?.required && (value === '' || value === null)) {
                    acc[key] = value;
                    fieldInvalidName.push(key);
                }
                return acc;
            }, {});

            const count = fieldInvalidName.length;
            const valid = count === 0;

            return [valid, fieldInvalidName];
        },

        handleErrorMessage(message = 'Erro ao fazer a inscrição'){
            this.$toast.add({severity: 'error', summary: 'Erro', detail: message, life: 3000})
        },

    }
}
</script>

<template>
    <form @submit.prevent="handleMakeRegistration" class="flex gap-3 flex-col px-3">
        <div class="flex flex-wrap gap-3">
            <div class="form-group w-full">
                <label for="name" class="ml-2">
                    <i class="fas fa-user me-1 "></i> <small> Nome </small> <span class="text-primary-500">*</span>
                </label>
                <InputText id="name" v-model="data.name" class="w-full border-zinc-300 h-9" :required="true" placeholder="Ex.: João da Silva" />
            </div>

            <div class="form-group">
                <label for="email" class="ml-2">
                    <i class="fas fa-envelope me-1 "></i> <small> Email </small> <span class="text-primary-500">*</span>
                </label>
                <InputText id="email" v-model="data.email" class="w-full border-zinc-300 h-9" :required="true" placeholder="Ex.: joaosilva@gmail.com" />
            </div>

            <div class="form-group">
                <label for="phone" class="ml-2">
                    <i class="fas fa-phone me-1 "></i> <small> Telefone </small> <span class="text-primary-500">*</span>
                </label>
                <InputText id="phone" v-model="data.phone" class="w-full border-zinc-300 h-9" :required="true" placeholder="Ex.: (244) 999xxxxxx" />
            </div>

            <div class="form-group">
                <label for="birthdate" class="ml-2">
                    <i class="fas fa-calendar me-1 "></i> <small> Data de Nascimento </small>
                </label>
                <Calendar id="birthdate" v-model="data.birthdate" dateFormat="dd/mm/yy" class="w-full border-zinc-300 hover:border-zinc-400 h-9" :required="true" placeholder="Ex.: 01/01/2000" />
            </div>

            <div class="form-group">
                <label for="gender" class="ml-2">
                    <i class="fas fa-venus-mars me-1 "></i> <small> Gênero </small>
                </label>

                <Dropdown id="gender" v-model="data.gender" :options="genders" optionLabel="label" optionValue="value" class="w-full border-zinc-300 h-9" placeholder="Ex.: Masculino">
                    <template #value="slotProps">
                        <div v-if="slotProps.value" class="flex items-center text-slate-800">
                            {{ genders.find(gn => gn.value === slotProps.value).label }}
                        </div>
                        <span v-else>
                            {{ slotProps.placeholder }}
                        </span>
                    </template>
                </Dropdown>
            </div>
        </div>

        <!-- <div class="flex flex-wrap gap-3">
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
        </div> -->

        <PaidEvent
            v-if="event?.type === 'paid'" 
            :event="event" 
            @update:registration="handleRegistrationUpdate" 
        />

        <div class="flex w-full justify-end my-2">
            <Button type="submit" size="small" class="h-9" :loading="registration.busy">
                <i class="fas fa-spinner animate-spin mr-2" v-if="registration.busy"/>
                <i class="fas fa-save me-2" v-else/> {{registration.busy ? 'Inscrevendo': 'Inscrever'}}
            </Button>
        </div>
    </form>
</template>

<style>
.form-group {
    @apply my-1 w-[47%]
}
</style>