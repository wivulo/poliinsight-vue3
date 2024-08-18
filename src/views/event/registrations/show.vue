<script>
import EventServices from '@/services/EventServices';
import { setDocumentTitleMixin } from "@/config/document.title.js"
import Image from 'primevue/image';
import FloatLabel from 'primevue/floatlabel';
import InputText from 'primevue/inputtext';
import Checkbox from 'primevue/checkbox';
import Button from 'primevue/button';
import Dropdown from 'primevue/dropdown';
import Calendar from 'primevue/calendar';
import RadioButton from 'primevue/radiobutton';

export default {
    name: "event.registrations.show",
    mixins: [setDocumentTitleMixin],
    components: {
        Image, FloatLabel, InputText, Checkbox, Button, Dropdown,
        Calendar, RadioButton
    },
    data() {
        return {
            title: 'Poliinsight | Inscrever participante',
            busy: false,
            event: null,
            data: {
                name: null,
                nickname: null,
                email: null,
                phone: null,
                gender: null,
                birthdate: null,
                registration_mode: null,
                payment_mode: null,
            },
            options: [
                "Masculino",
                "Feminino",
            ],
            payment_modes: [
                {label: 'Transferência Bancária', value: 'bank_transfer'},
                {label: 'Depósito Bancário', value: 'bank_deposit'},
                {label: 'Dinheiro em mão', value: 'cash'},
            ]
        };
    },
    created(){
        this.getEvent()
    },
    methods: {
        async getEvent(){
            this.busy = true
            const responde = await EventServices.show(this.$route.params.id)
            .catch(() => this.$toast.add({severity: 'error', summary: 'Erro', detail: 'Erro ao buscar evento'}))
            this.event = responde.data
            this.busy = false
        },

        handleMakeRegistration(){
            console.log(this.data)
        }
    }
}
</script>

<template>
    <div class="w-full flex flex-col relative">
        <div class="w-full h-1/2 overflow-hidden">
            <Image :src="event?.imageURL" :alt="event?.name" class="object-cover" />
        </div>

        <div class="w-full h-1/2">
            <!-- <h1 class="text-2xl font-bold">{{event?.name}}</h1> -->
        </div>

        <div id="registration-box" class="bg-slate-50/95">
            <div class="flex flex-col gap-5">
                <div class="text-slate-700">
                    <p class="text-xl font-bold">{{event?.name}}</p>
                    <p class="text-sm font-semibold">Boletim de inscrição</p>
                </div>

                <form @submit.prevent="handleMakeRegistration" class="flex gap-2 flex-col px-3">
                    <div class="flex gap-3">
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
                    </div>

                    <div class="flex flex-col gap-3 mt-4 mb-2 text-sm">
                        <p class="ml-2">Taxa de inscrição</p>
                        <div class="flex flex-col gap-2">
                            <div class="flex align-items-center">
                                <RadioButton v-model="data.registration_mode" inputId="mode1" name="mode1" value="single" />
                                <label for="mode1" class="ml-2">Individual - 5000 Kz</label>
                            </div>
                            <div class="flex align " >
                                <RadioButton v-model="data.registration_mode" inputId="mode2" name="mode2" value="group" />
                                <label for="mode2" class="ml-2">Grupo - 10000 Kz</label>
                            </div>
                        </div>

                        <p class="mt-2 ml-2">Método de pagamento</p>
                        <div class="flex flex-col gap-2">
                            <Dropdown id="payment" v-model="data.payment_mode" :options="payment_modes" optionLabel="label" placeholder="Selecione um método de pagamento" class="h-9 w-full"  />
                        </div>
                    </div>

                    <div class="flex w-full justify-end my-2">
                        <Button type="submit" size="small" class="h-9">
                            <i class="fas fa-save me-2"></i> Inscrever
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    </div>
</template>

<style scoped>
#registration-box{
    @apply absolute w-[600px] h-[520px] overflow-y-auto rounded-md px-6 py-6;
}
#registration-box {
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
}
</style>