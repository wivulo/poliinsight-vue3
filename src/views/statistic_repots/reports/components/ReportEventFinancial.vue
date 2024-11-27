<script>
import currency from '@/helpers/currency';
import ISPBLogo from './ISPBLogo.vue';

export default {
    name: "ReportEventFinancial",
    components: {
        ISPBLogo
    },
    props: {
        event: {
            type: Object,
            required: true
        },
        incomes: {
            type: Array,
            required: false,
            default: () => []
        },
        expenses: {
            type: Array,
            required: false,
            default: () => []
        },
        investiments: {
            type: Array,
            required: false,
            default: () => []
        }
    },
    computed: {
        filtered_finances(){
            let _investiments, _incomes, _expenses = new Array();

            _investiments = this.investiments.map((item) => {
                return {
                    ...item,
                    input: item.amount,
                    output: 0
                }
            });

            _incomes = this.incomes.map((item) => {
                return {
                    ...item,
                    name: item.source,
                    input: item.amount,
                    output: 0
                }
            });

            _expenses = this.expenses.map((item) => {
                return {
                    ...item,
                    name: item.category,
                    input: 0,
                    output: item.amount
                }
            });

            return [..._investiments, ..._incomes, ..._expenses];
        }
    },
    methods: {
        totalFinances(values = new Array()) {
            return values.reduce((acc, income) => acc + income.amount, 0)
        },
        netProfit() {
            return this.diference(this.totalFinances(this.incomes), this.totalFinances(this.expenses));
        },
        diference(a, b){
            return a > b ? a - b : b - a;
        },
        sum(array){
            return array.reduce((acc, curr) => acc + curr.amount, 0);
        },

        toKwanza(value){
            return currency.KWAZA.format(value)
        },
        DDMMMYYYY(date){
            return new Date(date).toLocaleDateString('pt-Ao', {day: '2-digit', month: 'long', year: 'numeric'});
        },
    }
}
</script>

<template>
    <div class="flex flex-col gap-4 text-sm w-full h-full pt-[85px] pr-[85px] pl-[70px] pb-[70px]">
        <div class="flex flex-col items-center mb-6">
            <ISPBLogo />

            <div class="text-center text-lg">
                <p >Instituto Superior Politécnico de Benguela</p>
                <p>Departamento de {{event.department.name ?? 'Engenharia'}}</p>
                <p>Relatório Financeiro</p>
            </div>
        </div>

       <div>
            <p class="mb-0">
               <strong> {{event.name}}</strong>
            </p>
            <p class="mb-1">
                {{event.description}}
            </p>
       </div>

        <section class="summary my-3">
            <div class="flex gap-5 justify-between w-full mt-2">
                <div class="flex flex-col w-30 h-120 border p-2 shadow-sm shadow-black/30">
                    <p><strong>Receita Total</strong></p>
                    <div class="w-full flex justify-end grow items-end">
                        {{toKwanza(totalFinances(incomes))}}
                    </div>
                </div>

                <div class="flex flex-col w-30 h-120 border p-2 shadow-sm shadow-black/30">
                    <p><strong>Despesa Total</strong></p>
                    <div class="w-full flex justify-end grow items-end">
                        {{toKwanza(totalFinances(expenses))}}
                    </div>
                </div>

                <div class="flex flex-col w-30 h-120 border p-2 shadow-sm shadow-black/30">
                    <p><strong>Lucro Líquido</strong></p>
                    <div class="w-full flex justify-end grow items-end">
                        {{toKwanza(netProfit())}}
                    </div>
                </div>
            </div>
        </section>

        <section class="summary">
            <div class="mb-3" v-if="filtered_finances">
                <p><strong> Resumo Financeiro</strong></p>
                <table>
                    <thead>
                    <tr>
                        <th>Nome</th>
                        <th>Descrição</th>
                        <th>Entrada</th>
                        <th>Saída</th>
                    </tr>
                    </thead>
                    <tbody v-if="filtered_finances.length">
                        <tr v-for="finance in filtered_finances">
                            <td>{{finance.name}}</td>
                            <td>{{finance.description}}</td>
                            <td>{{finance.input === 0 ? ' --- ' : toKwanza(finance.input)}}</td>
                            <td>{{finance.output === 0 ? ' --- ' :  toKwanza(finance.output)}}</td>
                        </tr>
                    </tbody>
                    <tfoot>
                        <tr>
                            <td><strong>Total</strong></td>
                            <td></td>
                            <td>{{toKwanza(sum(filtered_finances.filter(finance => finance.input)))}}</td>
                            <td>{{toKwanza(sum(filtered_finances.filter(finance => finance.output)))}}</td>
                        </tr>
                    </tfoot>
                </table>
            </div>
        </section>
    </div>
</template>