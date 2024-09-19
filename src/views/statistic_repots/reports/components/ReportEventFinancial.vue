<script>
import currency from '@/helpers/currency';

export default {
    name: "ReportEventFinancial",
    props: {
        event: {
            type: Object,
            required: true
        }
    },
    data() {
        return {
            incomes: [],
            expenses: []
        }
    },
    computed: {
        totalIncomes() {
            return this.incomes.reduce((acc, income) => acc + income.value, 0)
        },
        totalExpense() {
            return this.expenses.reduce((acc, expense) => acc + expense.value, 0)
        },
        netProfit() {
            return this.totalIncomes - this.totalExpense
        }
    },
    methods: {
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
    <div class="flex flex-col gap-4 text-sm w-full h-full">
        <div class="flex flex-col align-center mb-2">
            <img src="https://ispbenguela.com/front/img/logo/ispb.svg" width="150" height="150" alt="ispb logo" />
            <h3 class="text-center">Instituto Superior Politécnico de Benguela</h3>
            <h3 class="text-center">Departamento de Engenharia</h3>
            <h3 class="text-center">Relatório Financeiro do Evento</h3>
        </div>

       <div>
            <h3 class="mb-0">{{event.name}}</h3>
            <p class="mb-1">
                {{event.description}}
            </p>
       </div>

        <div>
            <div class="flex items-center gap-1">
                <p><strong>Data:</strong> {{DDMMMYYYY (event.date)}}</p>
                <span>-</span>
                <p>{{DDMMMYYYY (event.endDate)}}</p>
            </div>

            <p><strong>Local:</strong> {{event.localization}}</p>
            <p class="mb-2"><strong>Departamento:</strong> {{event.departament}}</p>
        </div>

        <section class="summary my-5">
            <div>
                <h2>Resumo Financeiro</h2>
            </div>

            <div class="flex gap-5 justify-between w-full mt-2">
                <div class="flex flex-col w-[30%] h-[120px] border p-2 shadow-sm shadow-black/30">
                    <p><strong>Receita Total</strong></p>
                    <div class="w-full flex justify-end grow items-end">
                        {{toKwanza(totalIncomes)}}
                    </div>
                </div>

                <div class="flex flex-col w-[30%] h-[120px] border p-2 shadow-sm shadow-black/30">
                    <p><strong>Despesa Total</strong></p>
                    <div class="w-full flex justify-end grow items-end">
                        {{toKwanza(totalExpense)}}
                    </div>
                </div>

                <div class="flex flex-col w-[30%] h-[120px] border p-2 shadow-sm shadow-black/30">
                    <p><strong>Lucro Líquido</strong></p>
                    <div class="w-full flex justify-end grow items-end">
                        {{toKwanza(netProfit)}}
                    </div>
                </div>
            </div>
        </section>
    </div>
</template>

<style>
    h1 {
      color: #333;
    }
    table {
      width: 100%;
      border-collapse: collapse;
      margin-top: 20px;
    }
    table {
      border-bottom: 1px solid #e0e0e0d0;
      border-left: 1px solid #e0e0e0d0;
      border-right: 1px solid #e0e0e0d0;
    }
    th, td {
      padding: 10px;
      text-align: left;
    }
    tbody tr, tbody tr td{
      border-bottom: 1px solid #e0e0e0d0;
    }
    th {
      background-color: rgb(218, 85, 81);
      color: white;
    }
</style>