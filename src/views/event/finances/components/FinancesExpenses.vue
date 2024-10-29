<script>
import FinancesServices from '@/services/FinancesServices.js';
import currency from '@/helpers/currency';
import Button from 'primevue/button';
import InputText from 'primevue/inputtext';
import InputGroup from 'primevue/inputgroup';
import InputNumber from 'primevue/inputnumber';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import Dropdown from 'primevue/dropdown';
import Textarea from 'primevue/textarea';
import dayjs from 'dayjs'
/*
Despesas
  eventId     String
  amount      Float
  category    String
  description String?
*/
export default {
    name: "Finance.Expenses",
    props: ['eventId'],
    components: {
        Button, InputText, InputGroup, InputNumber,
        DataTable, Column, Dropdown, Textarea,
    },
    data(){
        return {
            filter: null,
            expenses: {
                busy: false,
                data: []
            },

            expense: {
                name: '',
                amount: 0,
                eventId: null,
                category: null,
                description: null,
            }
        }
    },
    created(){
        this.fetchExpenses();
    },
    methods: {
        async fetchExpenses(){
            try {
                this.expenses.busy = true;
                const response = await FinancesServices.findExpenses(this.eventId);
                this.expenses.data = response.data;
            } catch (error) {
                console.error(error);
            } finally {
                this.expenses.busy = false;
            }
        },

        async storeExpense(){
            try {
                const result = await this.$swal.fire({
                    title: '',
                    text: 'Tem a certeza?',
                    icon: 'warning',
                    showCancelButton: true,
                    confirmButtonText: 'Sim, Tenho',
                    cancelButtonText: 'Cancelar',
                    confirmButtonColor: 'rgb(218, 85, 81)',
                    cancelButtonColor: 'rgba(150, 150, 150, .5)',
                })

                if(!result.isConfirmed) return;

                this.expense.busy = true;
                const response = await FinancesServices.storeExpense(this.eventId, this.expense)
                .catch(() => this.handleErrorMessage())

                if(response?.status === 201){
                    this.$toast.add({severity: 'success', summary: 'Success', detail: 'Despesa criada com sucesso', life: 2000})
                    this.expenses.data.push(response.data);
                    this.reset();
                    this.fetchExpenses();
                    return
                }

                this.handleErrorMessage()
            } finally {
                this.expenses.busy = false;
            }
        },

        handleErrorMessage(){
            this.$toast.add({
                severity: 'error',
                summary: 'Error', 
                detail: 'Erro ao criar a despesa', 
                life: 2000
            })
        },

        reset(){
            this.expense = {
                name: '',
                amount: 0,
                eventId: null,
                category: null,
                description: null,
            }
        },

        toKwanza(value){
            return currency.KWAZA.format(value)
        },

        dateFormater(date) {
            return dayjs(date).format('DD/MM/YYYY')
        },

        handleEditexpense(expense){
            console.log('handleEditExpense', expense);
        },

        handleDeleteexpense(expense){
            console.log('handleDeleteExpense', expense);
        }
    },
    watch: {
        $route(){
            this.fetchExpenses();
        }
    },
}
</script>

<template>
    <div class="w-full flex flex-col gap-5 py-5">
        <div class="flex flex-col gap-1">
            <label for="investiment">
                Despesa
            </label>

            <div class="flex gap-2 items-end">
                <div class="flex flex-col gap-1 grow">
                    <label for="name">
                        Nome
                    </label>

                    <InputText size="small" v-model="expense.name" id="name" placeholder="Ex:. Alimentação" class="w-full h-9" />
                </div>
                
                <div class="flex flex-col gap-1 grow">
                    <label for="value">
                        Montante
                    </label>

                    <InputNumber size="small" v-model="expense.amount" id="value" placeholder="Ex:. 100 000 kz" class="w-full h-9" 
                        mode="currency" currency="AOA" locale="pt-AO" :min="0" :max="1000000"
                    />
                </div>

                <div class="flex flex-col gap-1 grow">
                    <label for="category">
                        Categoria
                    </label>

                    <InputText size="small" v-model="expense.category" id="category" placeholder="Ex:. Alimentação" class="w-full h-9" />
                </div>
            </div>

            <div class="flex gap-2 items-end mt-2">
                <div class="flex flex-col gap-1 grow">
                    <label for="description">
                        Descrição
                    </label>

                    <Textarea v-model="expense.description" id="description" rows="2"
                        placeholder="Ex:. Pequeno almoço para os participantes" class="w-full hover:border-slate-400" 
                    />
                </div>

                <div class="flex grow-0 h-full items-end">
                    <Button size="small" class="h-9 border border-surface-300 border-l-0" @click="storeExpense" :loading="expenses.busy">
                        <i class="fas fa-spinner animate-spin mr-1" v-if="expenses.busy" />
                        <i class="fa fa-save mr-1"/> {{ busy ? 'Salvando...' : 'Salvar' }}
                    </Button>
                </div>
            </div>
        </div>

        <hr />

        <DataTable :value="expenses.data" size="small" paginator :rows="5" :totalRecords="expenses.data.length"
            dataKey="id" class="ctable"
            :loading="expenses.busy" lazy :rowsPerPageOptions="[5, 10, 20, 50]"
        >                        
            <Column field="name" header="Nome"></Column>

            <Column field="amount" header="Montante">
                <template #body="props">
                    {{ toKwanza(props.data.amount) }}
                </template>
            </Column>

            <Column field="category" header="Categoria"></Column>
            
            <Column field="createdAt" header="Data de Criação">
                <template #body="props">
                    {{ dateFormater(props.data.createdAt) }}
                </template>
            </Column>

            <Column field="actions" header="Ações" class="relative">
                <template #body="props">
                    <Dropdown 
                        :options="[
                            {
                                label: 'Editar',
                                icon: 'fa fa-pencil',
                                command: () => handleEditexpense(props.data)
                            },
                            {
                                label: 'Eliminar',
                                icon: 'fa fa-trash',
                                command: () => handleDeleteexpense(props.data)
                            },
                        ]" 
                        class="p-0 bg-primary-500"
                        option-label="label"
                    >
                        <template #value>
                            <div class="flex justify-center items-center text-white">
                                <i class="fa fa-cog mr-1"/> Opções
                            </div>
                        </template>

                        <template #option="{ option }">
                            <div class="h-2 text-sm flex items-center text-zinc-700 py-2 w-full" @click="option.command">
                                <i :class="option.icon" class="mr-1" /> {{ option.label }}
                            </div>
                        </template>

                        <template #dropdownicon>
                            <i class="fa fa-chevron-down text-white"/>
                        </template>
                    </Dropdown>
                </template>
            </Column>

            <template #empty>
                <div class="flex items-center justify-center h-10">
                    <p class="text-gray-400">Nenhum dado disponível</p>
                </div>
            </template>
        </DataTable>
    </div>
</template>