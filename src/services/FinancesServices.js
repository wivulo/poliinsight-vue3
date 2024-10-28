import { databaseURL } from "@/config"
import axios from 'axios'

export default {
    //Investimentos
    findInvestiment(eventId) {
        return axios.get(`${databaseURL}/finances/investiment/${eventId}`);
    },

    storeInvestiment(eventId, investiment){
        return axios.post(`${databaseURL}/finances/investiment/`, {
            investiment: {
                eventId: eventId,
                name: investiment.name,
                amount: investiment.amount,
            }
        });
    },

    show(id){
        return axios.get(`${databaseURL}/finances/show/${id}`);
    },

    deleteInvestiment(id){
        return axios.delete(`${databaseURL}/finances/investiment/${id}`);
    },

    updateInvestiment(investiment){
        return axios.put(`${databaseURL}/finances/investiment`, investiment);
    },

    //Receitas
    findIncome(eventId) {
        return axios.get(`${databaseURL}/finances/income/${eventId}`);
    },

    storeIncome(eventId, income){
        return axios.post(`${databaseURL}/finances/income/`, {
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
        return axios.delete(`${databaseURL}/finances/income/${id}`);
    },

    updateIncome(income){
        return axios.put(`${databaseURL}/finances/income`, income);
    },

    //Despesas
    findExpense(eventId) {
        return axios.get(`${databaseURL}/finances/expense/${eventId}`);
    },

    storeExpense(eventId, expense){
        return axios.post(`${databaseURL}/finances/expense/`, {
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
        return axios.delete(`${databaseURL}/finances/expense/${id}`);
    },

    updateExpense(expense){
        return axios.put(`${databaseURL}/finances/expense`, expense);
    },
}