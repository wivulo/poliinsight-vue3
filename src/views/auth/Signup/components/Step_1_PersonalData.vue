<script>
import InputText from 'primevue/inputtext';
import FloatLabel from 'primevue/floatlabel';
import Calendar from 'primevue/calendar';
import Dropdown from 'primevue/dropdown';

export default {
    name: "Step_1_PersonalData",
    props: {
        user: {
            type: Object,
            required: true
        }
    },
    components: {
        InputText, FloatLabel, Calendar, Dropdown
    },
    data(){
        return {
            selected: null,
            options: [
                "Masculino",
                "Feminino",
            ],
        }
    }
}
</script>

<template>
    <div class="flex flex-col gap-5" >
        <FloatLabel class="mb-3">
            <InputText id="email" v-model="user.email" class="w-full border-zinc-300 h-9 " :required="true"/>
            <label for="email">
            <i class="fas fa-envelope me-1 "></i> <small> E-mail </small>
            </label>
        </FloatLabel>

        <div class="mb-3 w-full">
            <FloatLabel>
                <InputText id="name" v-model="user.name" class="w-full border-zinc-300 h-9 " :required="true"/>
                <label for="name">
                  <i class="fas fa-user me-1 "></i> <small> Nome completo </small>
                </label>
            </FloatLabel>
    
            <!-- <FloatLabel class="basis-1/2">
                <InputText id="nickname" v-model="user.nickname" class="w-full border-zinc-300 h-9 " :required="true"/>
                <label for="nickname">
                  <i class="fas fa-user me-1 "></i> <small> Sobrenome </small>
                </label>
            </FloatLabel> -->
        </div>

        <FloatLabel class="mb-3">
            <InputText id="username" v-model="user.username" class="w-full border-zinc-300 h-9" :required="true"/>
            <label for="username">
              <i class="fas fa-user me-1 "></i> <small> Nome de usuario </small>
            </label>
        </FloatLabel>

        <div class="flex flex-col md:flex-row gap-2 lg:items-center mb-3 w-full">
            <label for="birthDate" class="flex-grow pl-3">
                <i class="fas fa-calendar me-1 text-zinc-500" /> <small> Data de nascimento </small>
            </label>
            <Calendar id="birthDate" v-model="user.birthdate" 
            class="flex-grow border-zinc-300 h-9 focus:outline-zinc-400" inputClass="hover:border-zinc-400" placeholder="ex.: 10/12/1998" dateFormat="dd/mm/yyy" />
        </div>
        
        <div class="flex gap-2 lg:items-center mb-3 flex-col md:flex-row w-full">
            <label for="gender" class="flex-grow pl-3">
                <i class="fas fa-user me-1 text-zinc-500" /> <small> Gênero </small>
            </label>
            <Dropdown id="gender" v-model="user.gender" :options="options" placeholder="Selecione um genero" 
            class="h-9 flex-grow w-full lg:w-[125px]"  />
        </div>

    </div>
</template>