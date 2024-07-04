<script>
import { mapGetters } from "vuex";
import Button from "primevue/button";
import InputText from "primevue/inputtext";
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import InputGroup from 'primevue/inputgroup';
import InputGroupAddon from 'primevue/inputgroupaddon';
import ModalCreateUser from "./components/ModalCreateUser.vue";
import Calendar from 'primevue/calendar';

export default {
    name: "Admin.UserManagment",
    components: {
        Button, InputText, DataTable, Column,
        InputGroup, InputGroupAddon, ModalCreateUser,
        Calendar
    },
    data(){
        return {
            isItemSelected: false,
            itemSelected: null,
            filter: null,
            filters: {
                name: null,
                email: null,
                gender: null,
                group: null,
                createdAt: null
            },
            selectedUsers: [],
            showFilters: false,
            busy: true,
        }
    },
    methods: {
        onRowSelected(item){
            this.selectedUsers.push(item.data);
            this.isItemSelected = true;
        },
        onRowUnselected(item){
            this.selectedUsers = this.selectedUsers.filter(user => user.id !== item.data.id);

            if(this.selectedUsers.length === 0){
                this.isItemSelected = false;
            }
        },
        toggleShowFilters(){
            this.showFilters = !this.showFilters;
        },
    },
    computed: {
        ...mapGetters({
            users: 'admin/users',
        }),
    },
} 
</script>

<template>
    <div class="p-4 px-5 w-full">
        <!-- <div cols="1">
            <p class="text-surface-300 font-semibold ">Gerenciamento de usuários</p>
        </div> -->

        <ModalCreateUser ref="ModalCreateUser" />

        <div>
            <div class="flex gap-2 justify-end ">
                <template v-if="isItemSelected">
                    <Button size="small" class="h-8 bg-surface-500 border-none text-black hover:bg-surface-600">
                        Editar
                    </Button>
                    <Button size="small" class="h-8 bg-surface-500 border-none text-black hover:bg-surface-600">
                        Deletar
                    </Button>
                </template>
                <Button size="small" class="h-8 bg-surface-500 border-none
                 text-black hover:bg-surface-600" @click="$refs.ModalCreateUser.isVisible = true">
                    Criar Usuário
                </Button>
            </div>
        </div>

        <div class="my-3">
            <div class="flex">
                <InputGroup>
                    <InputText size="small" v-model="filter" id="search" type="text" placeholder="Pesquisar..." class="w-full rounded-none h-8" />
                    <Button size="small" class="h-8 bg-surface-500 border-none text-black hover:bg-surface-600">
                        <i class="fa fa-filter mr-2"></i>
                        Filtro
                    </Button>
                    <Button size="small" class="h-8 bg-surface-500 border-none text-black hover:bg-surface-600">
                        <i class="fa fa-search"></i>
                     </Button>
                </InputGroup>
            </div>
        </div>
        <div class="my-3" v-show="showFilters">
            <div>
                <h6>Filtrar por</h6>
            </div>
            <div class="w-100"></div>
            <div>
                <div label="Nome" label-class="text-md">
                    <select name="filter-name" v-model="filters.name" class="form-select form-select-sm">
                        <option value="none" selected>__selecione um usuário</option>
                        <option v-for="(op, i) in [1, 2, 4, 5, 6]" :value="op" :key="i">
                            {{ op }}
                        </option>
                    </select>
                </div>
            </div>

            <div>
                <div label="Email" label-class="text-md">
                    <InputText v-model="filters.email" type="text" placeholder="Email..."></InputText>
                </div>
            </div>

            <div cols="3">
                <div label="Genero" label-class="text-md">
                    <InputText v-model="filters.gender" type="text" placeholder="Genero..."></InputText>                
                </div>
            </div>

            <div>
                <div label="Grupo" label-class="text-md">
                    <select name="filter-group" v-model="filters.group" class="form-select form-select-sm">
                        <option value="none" selected>__selecione um grupo</option>
                        <option v-for="(op, i) in ['administrador','organizador','normal']" :value="op" :key="i">
                            {{ op }}
                        </option>
                    </select>
                </div>
            </div>

            <div>
                <div label="criados em" label-class="text-md">
                    <Calendar v-model="filters.createdAt" placeholder="Data de criação..."></Calendar>
                </div>
            </div>
        </div>
        <div cols="1">
            <div>
                <DataTable :value="users" size="small" showGridlines paginator :rows="7"
                    v-model:selection="itemSelected" dataKey="id" scrollable scrollHeight="380px"
                    @row-select="onRowSelected" @row-unselect="onRowUnselected">
                
                    <Column selectionMode="multiple" headerStyle="width: 3rem"></Column>
                    
                    <Column field="id" header="ID">
                        <template #body="slotProps">
                            <span class="inline-block w-36 truncate">
                                {{ slotProps.data.id }}
                            </span>
                        </template>
                    </Column>
                    
                    <Column field="name" header="Nome"></Column>
                    
                    <Column field="email" header="E-mail"></Column>
                    
                    <Column field="username" header="Nome de Usuario">
                        <template #body="slotProps">
                            <span class="inline-block w-36 truncate">
                                {{ slotProps.data.username ?? 'N/D' }}
                            </span>
                        </template>
                    </Column>
                    
                    <Column field="gender" header="Gênero">
                        <template #body="slotProps">
                            <span class="inline-block w-36 truncate">
                                {{  slotProps.data.gender ?? 'N/D' }}
                            </span>
                        </template>
                    </Column>
                </DataTable>
            </div>
        </div>
    </div>
</template>