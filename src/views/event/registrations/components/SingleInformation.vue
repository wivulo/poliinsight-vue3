<script>
import InputText from 'primevue/inputtext';
import InputNumber from 'primevue/inputnumber';
import Dropdown from 'primevue/dropdown'
import Calendar from 'primevue/calendar';

export default {
    name: 'Registration.SingleInformation',
    props: ['fields'],
    components: {
        InputText, InputNumber,
        Dropdown, Calendar
    },
    data(){
        return {
            data: {},
        }
    },
    methods: {
        reset(){
            this.data = {}
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

        <!-- <div class="flex gap-3">
            <div class="my-2 w-1/2">
                <label for="name" class="ml-2">
                    <i class="fas fa-user me-1 "></i> <small> Nome </small>
                </label>
                <InputText id="name" v-model="data.name" class="w-full border-zinc-300 h-9" :required="true" placeholder="Ex:. Valter"/>
            </div>

            <div class="my-2 w-1/2">
                <label for="nickname" class="ml-2">
                    <i class="fas fa-user me-1 "></i> <small> Sobrenome </small>
                </label>
                <InputText id="nickname" v-model="data.nickname" class="w-full border-zinc-300 h-9" :required="true" placeholder="Ex:. Ivulo"/>
            </div>
        </div>

        <div class="flex gap-3">
            <div class="my-2 w-1/2">
                <label for="email" class="ml-2">
                    <i class="fas fa-envelope me-1 "></i> <small> Email </small>
                </label>
                <InputText id="email" v-model="data.email" class="w-full border-zinc-300 h-9" :required="true" placeholder="Ex:. vivulo@gmail.com"/>
            </div>

            <div class="my-2 w-1/2">
                <label for="phone" class="ml-2">
                    <i class="fas fa-phone me-1 "></i> <small> Nº Telemóvel </small>
                </label>
                <InputText id="phone" v-model="data.phone" class="w-full border-zinc-300 h-9" :required="true" placeholder="Ex:. +244923xxxxxx"/>
            </div>
        </div>

        <div class="flex gap-3 my-2">
            <div class="w-1/2">
                <label for="birthDate" class="ml-2">
                    <i class="fas fa-calendar me-1" /> <small> Data de nascimento </small>
                </label>
                <Calendar id="birthDate" v-model="data.birthDate" class="border-zinc-300 h-9 focus:outline-zinc-400 w-full" inputClass="hover:border-zinc-400" placeholder="ex.: 10/12/1998" />
            </div>

            <div class="w-1/2 flex flex-col">
                <label for="gender" class="ml-2">
                    <i class="fas fa-user me-1" /> <small> Gênero </small>
                </label>
                <Dropdown id="gender" v-model="data.gender" :options="options" placeholder="Selecione um genero" class="h-9 w-full"  />
            </div>
        </div> -->
    </div>
</template>

<style>
.form-group {
    @apply my-1 w-[47%]
}
</style>