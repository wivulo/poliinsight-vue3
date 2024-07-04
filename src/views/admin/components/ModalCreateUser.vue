<script>
import { mapGetters } from 'vuex';
import Dialog from 'primevue/dialog';
import Button from "primevue/button";
import InputText from "primevue/inputtext";
import FloatLabel from 'primevue/floatlabel';
import Calendar from 'primevue/calendar';
import Checkbox from 'primevue/checkbox';
import Dropdown from 'primevue/dropdown';
import RadioButton from 'primevue/radiobutton';

export default {
    components: { Dialog, Button, InputText, FloatLabel, 
        Calendar, Checkbox, Dropdown, RadioButton
    },
    data(){
        return {
            isVisible: false,
            user: {
                name: null,
                nickname: null,
                username: null,
                email: null,
                password: null,
                isISPBStudent: false,
                isEventOrganizer: false,
                gender: null,
                office: null,
                department: null,
                course: null,
                birthDate: null,
                institution: null,
                documentProving: null,
                groupId: null
            },
            selected: null,
            options: [
                "Masculino",
                "Feminino",
            ],
            studentOrOrganizer: true
        }
    },
    methods: {
        resetForm(){
            this.user = {
                name: null,
                nickname: null,
                username: null,
                email: null,
                password: null,
                isISPBStudent: false,
                isEventOrganizer: false,
                gender: null,
                office: null,
                department: null,
                course: null,
                birthDate: null,
                institution: null,
                documentProving: null,
                groupId: null
            }
        },

        closeModal(){
            this.isVisible = false
        },

        handleCreateUser(){
            this.$store.dispatch('admin/createUser', this.user).then(response => {
                if(!response.error){
                    this.resetForm();
                    this.closeModal();
                    this.$store.dispatch('admin/fetchUsers');
                }
            })
        },
    },
    computed: {
        ...mapGetters({
            onSignup: 'admin/onSignup'
        }),
    },
}
</script>

<template>
    <Dialog v-model:visible="isVisible" modal header="Criar Usuário" class="w-[40vw]">
        <div class="flex flex-col gap-7">
            <div>
                <div class="my-4">
                    <p>Informações Pessoais</p>
                </div>

                <div class="flex flex-col gap-6">
                    <div class="flex gap-2 w-full">
                        <FloatLabel class="basis-1/2">
                            <InputText id="name" v-model="user.name" class="w-full border-zinc-300 h-9 " :required="true"/>
                            <label for="name">
                              <i class="fas fa-user me-1 "></i> <small> Nome </small>
                            </label>
                        </FloatLabel>
                
                        <FloatLabel class="basis-1/2">
                            <InputText id="nickname" v-model="user.nickname" class="w-full border-zinc-300 h-9 " :required="true"/>
                            <label for="nickname">
                              <i class="fas fa-user me-1 "></i> <small> Sobrenome </small>
                            </label>
                        </FloatLabel>
                    </div>

                    <FloatLabel>
                        <InputText id="email" v-model="user.email" class="w-full border-zinc-300 h-9 " :required="true"/>
                        <label for="email">
                            <i class="fas fa-envelope me-1 "></i> <small> E-mail </small>
                        </label>
                    </FloatLabel>
            
                    <FloatLabel>
                        <InputText id="username" v-model="user.username" class="w-full border-zinc-300 h-9" :required="true"/>
                        <label for="username">
                          <i class="fas fa-user me-1 "></i> <small> Nome de usuario </small>
                        </label>
                    </FloatLabel>
            
                    <div class="flex gap-2 items-center">
                        <label for="birthDate" class="flex-grow pl-3">
                            <i class="fas fa-calendar me-1 text-zinc-500"></i> <small> Data de nascimento </small>
                        </label>
                        <Calendar id="birthDate" v-model="user.birthDate" class="flex-grow border-zinc-300 h-9 focus:outline-zinc-400" inputClass="hover:border-zinc-400" placeholder="ex.: 10/12/1998" />
                    </div>

                    <Dropdown v-model="user.gender" :options="options" placeholder="Selecione um genero" class="h-9"  />
                </div>
            </div>

            <div class="border-t border-surface-200">
                <div class="my-4">
                    <p>Informações Academicas</p>
                </div>

                <div class="flex flex-col gap-7">
                    <div class="flex flex-wrap gap-3">
                        <div class="flex items-center">
                            <RadioButton v-model="studentOrOrganizer" inputId="ingredient1" 
                            value="student" />
                            <label for="ingredient1" class="ml-2">Estudante?</label>
                        </div>
                        <div class="flex items-center">
                            <RadioButton v-model="studentOrOrganizer" inputId="ingredient2" value="organizer" />
                            <label for="ingredient2" class="ml-2">Organizador de evento?</label>
                        </div>
                    </div>

                    <div v-if="studentOrOrganizer === 'student'" class="flex flex-col gap-7">
                        <div>
                            <Checkbox v-model="user.isISPBStudent" id="isISPBStudent" :binary="true" />
                            <label for="isISPBStudent" class="ml-3">Estudante do ISPB?</label>
                        </div>

                        <FloatLabel v-if="!user.isISPBStudent">
                            <InputText id="institution" v-model="user.institution" class="w-full border-zinc-300 h-9" :required="true"/>
                            <label for="institution">
                                <i class="fas fa-university me-1 "></i> <small> Instituição </small>
                            </label>
                        </FloatLabel>

                        <FloatLabel>
                            <InputText id="course" v-model="user.course" class="w-full border-zinc-300 h-9" :required="true"/>
                
                            <label for="course">
                                <i class="fas fa-book me-1 "></i> <small> Curso </small>
                            </label>
                        </FloatLabel>
                    </div>

                    <div v-else>
                        <FloatLabel>
                            <InputText id="office" v-model="user.office" class="w-full border-zinc-300 h-9" :required="true"/>
                            <label for="office">
                                <i class="fas fa-university me-1 "></i> <small> Cargo </small>
                            </label>
                        </FloatLabel>
                    </div>        
            
                    <FloatLabel>
                        <InputText id="department" v-model="user.department" class="w-full border-zinc-300 h-9 " :required="true" />
            
                        <label for="department">
                            <i class="fas fa-book me-1 "></i> <small> Departamento </small>
                        </label>
                    </FloatLabel>
                </div>
            </div>

             <div class="basis-1/3 flex flex-col justify-between">
                <div class="my-4">
                    <p>Outras Informações</p>
                </div>

                <div class="flex flex-col gap-3">
                    <FloatLabel>
                        <InputText id="password" v-model="user.password" class="w-full border-zinc-300 h-9" :required="true"/>
                        <label for="password">
                          <i class="fas fa-lock me-1 "></i> <small> Senha </small>
                        </label>
                    </FloatLabel>

                    <Button label="Criar conta" :loading="onSignup" size="small" class="h-8 text-base relative bottom-0 self-end" @click="handleCreateUser"/>
                </div>
            </div>
        </div>
    </Dialog>
</template>