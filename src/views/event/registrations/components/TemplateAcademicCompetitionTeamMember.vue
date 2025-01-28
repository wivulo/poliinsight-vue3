<script>
import Dropdown from 'primevue/dropdown';
import InputText from 'primevue/inputtext';
import Calendar from 'primevue/calendar';

export default {
    name: 'Registration.templateAcademicCompetition.TeamMember',
    props: ['index'],
    components: {
        InputText, Calendar, Dropdown
    },
    data(){
        return {
            member: {
                name: null,
                email: null,
                phone: null,
                birthdate: null,
                gender: null
            },
            genders: [
                { label: 'Masculino', value: 'male' },
                { label: 'Feminino', value: 'female' }
            ]
        }
    },
    methods: {
        reset(){
            this.member = {
                name: null,
                email: null,
                phone: null,
                birthdate: null,
                gender: null
            }
        }
    },
    watch: {
        member: {
            handler(){
                if(this.member.name && this.member.email && this.member.phone){
                    this.$emit('update:member', { 
                        ...this.member,
                        gender: this.member.gender?.value
                    })
                }
            },
            deep: true
        }
    }
}
</script>

<template>
    <div class="flex flex-wrap gap-3">
        <div class="form-group">
            <label :for="'member-'+index" class="ml-2">
                <i class="fas fa-user me-1 "></i> <small> Nome </small> 
            </label>
            <InputText :id="'member-'+index" v-model="member.name" class="w-full border-zinc-300 h-9" :required="true" placeholder="Ex.: João da Silva" />
        </div>

        <div class="form-group">
            <label :for="'member-'+index" class="ml-2">
                <i class="fas fa-envelope me-1 "></i> <small> Email </small> 
            </label>
            <InputText :id="'member-'+index" v-model="member.email" class="w-full border-zinc-300 h-9" :required="true" placeholder="Ex.: joaosilva@gmail.com" />
        </div>

        <div class="form-group">
            <label :for="'member-'+index" class="ml-2">
                <i class="fas fa-phone me-1 "></i> <small> Telefone </small> 
            </label>
            <InputText :id="'member-'+index" v-model="member.phone" class="w-full border-zinc-300 h-9" :required="true" placeholder="Ex.: (244) 999xxxxxx" />
        </div>

        <div class="form-group">
            <label :for="'member-'+index" class="ml-2">
                <i class="fas fa-calendar me-1 "></i> <small> Data de Nascimento </small>
            </label>
            <Calendar :id="'member-'+index" v-model="member.birthdate" class="w-full border-zinc-300 hover:border-zinc-400 h-9" :required="true" placeholder="Ex.: 01/01/2000" />
        </div>

        <div class="form-group">
            <label :for="'member-'+index" class="ml-2">
                <i class="fas fa-venus-mars me-1 "></i> <small> Gênero <span class="text-xs text-surface-300">(opcional)</span></small>
            </label>
            <Dropdown :id="'member-'+index" v-model="member.gender" :options="genders" optionLabel="label" class="w-full border-zinc-300 h-9" placeholder="Ex.: Masculino">
                <template #value="slotProps">
                    <div v-if="slotProps.value" class="flex items-center text-slate-800">
                        {{ slotProps.value.label }}
                    </div>
                    <span v-else>
                        {{ slotProps.placeholder }}
                    </span>
                </template>
            </Dropdown>
        </div>
    </div>
</template>