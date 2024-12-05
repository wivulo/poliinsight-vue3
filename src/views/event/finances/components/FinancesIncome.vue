<script>
//Receitas
import FinancesServices from '@/services/FinancesServices.js';
import currency from '@/helpers/currency';
import Button from 'primevue/button';
import InputText from 'primevue/inputtext';
import InputGroup from 'primevue/inputgroup';
import InputNumber from 'primevue/inputnumber';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import Dropdown from 'primevue/dropdown';
import Textarea from 'primevue/textarea'
import dayjs from 'dayjs'
import ModalNewIncome from './ModalNewIncome.vue';
import { mapActions } from "vuex";

export default {
    name: "Finance.Income",
    props: ['eventId'],
    components: {
        Button, InputText, InputGroup, InputNumber,
        DataTable, Column, Dropdown, Textarea, ModalNewIncome,
    },
    data(){
        return {
            filter: null,
            incomes: {
                busy: false,
                data: []
            },

            income: {
                amount: 0,
                eventId: null,
                source: null,
                description: null,
            }
        }
    },
    created(){
        this.fetchIncomes();
    },
    methods: {
        async fetchIncomes(){
            try {
                this.incomes.busy = true;
                const response = await FinancesServices.findIncomes(this.eventId);
                this.incomes.data = response.data;
            } catch (error) {
                console.error(error);
            } finally {
                this.incomes.busy = false;
            }
        },

        async storeIncome(){
            try {
                if(!this.verifyRequiredFields()) {
                    this.handleErrorMessage('Preencha todos os campos obrigatórios');
                    return;
                };

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

                this.incomes.busy = true;
                const response = await FinancesServices.storeIncome(this.eventId, this.income)
                .catch(() => this.handleErrorMessage())

                if(response?.status === 201){
                    this.$toast.add({severity: 'success', summary: 'Success', detail: 'Receita criada com sucesso', life: 2000})
                    this.incomes.data.push(response.data);
                    this.reset();
                    this.fetchIncomes();
                    return
                }

                this.handleErrorMessage()
            } finally {
                this.incomes.busy = false;
            }
        },

        verifyRequiredFields(){
            return this.income.source && this.income.amount > 0;
        },

        handleErrorMessage(message){
            this.$toast.add({
                severity: 'error',
                summary: 'Error', 
                detail: message || 'Erro ao criar a receita', 
                life: 2000
            })
        },

        reset(){
            this.income = {
                name: '',
                amount: 0,
                eventId: null,
                source: null,
                description: null,
            }
        },

        toKwanza(value){
            return currency.KWAZA.format(value)
        },

        dateFormater(date) {
            return dayjs(date).format('D MMMM, YYYY')
        },

        handleEditIncome(income){
            console.log('handleEditIncome', income);
        },

        handleDeleteIncome(income){
            console.log('handleDeleteIncome', income);
        },

        handleShowModalNewIcome(){
            this.$refs.ModalNewIncome.visible = true;
        },

        ...mapActions("printer", ["handlePrint"]),
    },
    watch: {
        $route(){
            this.fetchIncome();
        }
    },
}
</script>

<template>
    <div class="w-full flex flex-col gap-5 py-5">

        <ModalNewIncome ref="ModalNewIncome" @created="fetchIncomes"/>

        <div class="flex flex-col gap-1 no-print">
            <div class="flex justify-end gap-2">
                <Button severity="secondary" size="small" class="h-8" @click="handleShowModalNewIcome">
                    <span class="text-black text-sm"><i class="fa fa-plus mr-1"/> Adicionar</span>
                </Button>

                <Button severity="secondary" size="small" class="h-8" @click="handlePrint">
                    <span class="text-black text-sm"><i class="fa fa-print mr-1"/> Imprimir</span>
                </Button>
            </div>

            <hr />
        </div>

        <DataTable :value="incomes.data" size="small" paginator :rows="5" :totalRecords="incomes.data.length"
            dataKey="id" class="ctable"
            :loading="incomes.busy" lazy :rowsPerPageOptions="[5, 10, 20, 50]"
        >                        
            <Column field="amount" header="Montante">
                <template #body="props">
                    {{ toKwanza(props.data.amount) }}
                </template>
            </Column>

            <Column field="source" header="Fonte"></Column>
            
            <Column field="createdAt" header="Data de Criação">
                <template #body="props">
                    {{ dateFormater(props.data.createdAt) }}
                </template>
            </Column>

            <Column field="actions" header="Ações" class="relative no-print">
                <template #body="props">
                    <Dropdown 
                        :options="[
                            {
                                label: 'Editar',
                                icon: 'fa fa-pencil',
                                command: () => handleEditIncome(props.data)
                            },
                            {
                                label: 'Eliminar',
                                icon: 'fa fa-trash',
                                command: () => handleDeleteIncome(props.data)
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