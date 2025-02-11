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
import dayjs from 'dayjs'
import { mapActions } from "vuex";
import ModalNewInvestiment from './ModalNewInvestiment.vue';

export default {
    name: "Finance.Investments",
    props: ['eventId'],
    components: {
        Button, InputText, InputGroup, InputNumber,
        DataTable, Column, Dropdown, ModalNewInvestiment
    },
    data(){
        return {
            filter: null,
            investments: {
                busy: false,
                data: []
            },
            investment: {
                name: '',
                amount: 0
            }
        }
    },
    created(){
        this.fetchInvestiments();
    },
    methods: {
        async fetchInvestiments(){
            try {
                this.investments.busy = true;
                const response = await FinancesServices.findInvestiment(this.eventId);
                this.investments.data = response.data;
            } catch (error) {
                console.error(error);
            } finally {
                this.investments.busy = false;
            }
        },

        async storeFinance(){
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

                this.investments.busy = true;
                const response = await FinancesServices.storeInvestiment(this.eventId, this.investment)
                .catch(() => this.handleErrorMessage())

                if(response?.status === 201){
                    this.$toast.add({severity: 'success', summary: 'Success', detail: 'Investimento criado com sucesso', life: 2000})
                    this.investments.data.push(response.data);
                    this.reset();
                    this.fetchInvestiments();
                    return
                }

                this.handleErrorMessage()
            } finally {
                this.investments.busy = false;
            }
        },

        verifyRequiredFields(){
            return this.investment.amount > 0 && this.investment.name
        },

        handleErrorMessage(message = 'Erro ao adicionar o investimento'){
            this.$toast.add({
                    severity: 'error',
                    summary: 'Error', 
                    detail: message, 
                    life: 2000
            })
        },

        reset(){
            this.investment = {
                name: '',
                amount: 0
            }
        },

        handleEditInvestiment(data){
            console.log(data);
        },

        handleDeleteInvestiment(data){
            console.log(data);
        },

        toKwanza(value){
            return currency.KWAZA.format(value)
        },

        dateFormater(date) {
            return dayjs(date).format('D MMMM, YYYY')
        },

        ...mapActions("printer", ["handlePrint"]),
        print() {
            this.handlePrint();
        },

        handleShowModalNewInvestiment(){
            this.$refs.modalNewInvestiment.show();
        }
    },
}
</script>

<template>
    <div class="w-full flex flex-col gap-3 py-5">
        <ModalNewInvestiment ref="modalNewInvestiment" @created="fetchInvestiments" />

        <div class="flex flex-col gap-1 no-print">
            <!-- <label for="investiment">
                Investimento
            </label>
            <div class="flex gap-2 items-end">
                <div class="flex flex-col gap-1 grow">
                    <label for="name">
                        Nome
                    </label>
                    <InputText size="small" v-model="investment.name" id="name" placeholder="Ex:. Investimento Inicial" class="w-full h-9" />
                </div>
                
                <div class="flex flex-col gap-1 grow">
                    <label for="value">
                        Valor
                    </label>

                    <InputNumber size="small" v-model="investment.amount" id="value" placeholder="Ex:. 100 000 kz" class="w-full h-9" 
                    mode="currency" currency="AOA" locale="pt-AO" :min="0" :max="1000000"
                />
                </div>
            
                <div class="flex grow-0 h-full items-end">
                    <Button size="small" class="h-9 border border-surface-300 border-l-0" @click="storeFinance" :loading="investments.busy">
                        <i class="fas fa-spinner animate-spin mr-1" v-if="investments.busy" />
                        <i class="fa fa-save mr-1"/> {{ investments.busy ? 'Salvando...' : 'Salvar' }}                    
                    </Button>
                </div>
            </div> -->

            <div class="flex justify-end gap-2">
                <Button severity="secondary" size="small" class="h-8" @click="handleShowModalNewInvestiment">
                    <span class="text-black text-sm"><i class="fa fa-plus mr-1"/> Adicionar</span>
                </Button>

                <Button severity="secondary" size="small" class="h-8" @click="handlePrint">
                    <span class="text-black text-sm"><i class="fa fa-print mr-1"/> Imprimir</span>
                </Button>
            </div>

            <hr />

        </div>

        <DataTable :value="investments.data" size="small" paginator :rows="5" :totalRecords="investments.data.length"
            dataKey="id" class="ctable"
            :loading="investments.busy" lazy :rowsPerPageOptions="[5, 10, 20, 50]"
        >                        
            <Column field="name" header="Nome"></Column>

            <Column field="amount" header="Montante">
                <template #body="props">
                    {{ toKwanza(props.data.amount) }}
                </template>
            </Column>
            
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
                                command: () => handleEditInvestiment(props.data)
                            },
                            {
                                label: 'Eliminar',
                                icon: 'fa fa-trash',
                                command: () => handleDeleteInvestiment(props.data)
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
                    <p class="text-gray-400">Nenhuma informação disponível</p>
                </div>
            </template>
        </DataTable>

    </div>
</template>