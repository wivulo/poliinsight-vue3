import { databaseURL } from "@/config"
import axios from 'axios'

export default {
    //Investimentos
    findInvestiment(eventId) {
        return axios.get(`${databaseURL}/finances/investiments/${eventId}`);
    },

    storeInvestiment(eventId, investiment){
        return axios.post(`${databaseURL}/finances/investiments/`, {
            investiment: {
                eventId: eventId,
                name: investiment.name,
                amount: investiment.amount,
            }
        });
    },

    showInvestiment(id){
        return axios.get(`${databaseURL}/finances/investiments/show/${id}`);
    },

    deleteInvestiment(id){
        return axios.delete(`${databaseURL}/finances/investiments/${id}`);
    },

    updateInvestiment(investiment){
        return axios.put(`${databaseURL}/finances/investiments`, investiment);
    },

    //Receitas
    findIncomes(eventId) {
        return axios.get(`${databaseURL}/finances/incomes/${eventId}`);
    },

    showIncome(id){
        return axios.get(`${databaseURL}/finances/incomes/show/${id}`);
    },

    storeIncome(eventId, income){
        return axios.post(`${databaseURL}/finances/incomes/`, {
            income: {
                eventId: eventId,
                name: income.name,
                amount: income.amount,
                source: income.source,
                description: income.description,
            }
        });
    },

    deleteIncome(id){
        return axios.delete(`${databaseURL}/finances/incomes/${id}`);
    },

    updateIncome(income){
        return axios.put(`${databaseURL}/finances/incomes`, income);
    },

    //Despesas
    findExpenses(eventId) {
        return axios.get(`${databaseURL}/finances/expenses/${eventId}`);
    },

    showExpense(id){
        return axios.get(`${databaseURL}/finances/expenses/show/${id}`);
    },

    storeExpense(eventId, expense){
        return axios.post(`${databaseURL}/finances/expenses/`, {
            expense: {
                eventId: eventId,
                name: expense.name,
                amount: expense.amount,
                category: expense.category,
                description: expense.description,
            }
        });
    },

    deleteExpense(id){
        return axios.delete(`${databaseURL}/finances/expenses/${id}`);
    },

    updateExpense(expense){
        return axios.put(`${databaseURL}/finances/expenses`, expense);
    },
}