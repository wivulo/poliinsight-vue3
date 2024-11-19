import { databaseURL } from "@/config"
import axios from 'axios'

const source = `${databaseURL}/finances`;

export default {
    //Investimentos
    findInvestiment(eventId) {
        return axios.get(`${source}/investiments/event/${eventId}`);
    },

    storeInvestiment(eventId, investiment){
        return axios.post(`${source}/investiments/`, {
            investiment: {
                eventId: eventId,
                name: investiment.name,
                amount: investiment.amount,
            }
        });
    },

    showInvestiment(id){
        return axios.get(`${source}/investiments/${id}`);
    },

    deleteInvestiment(id){
        return axios.delete(`${source}/investiments/${id}`);
    },

    updateInvestiment(investiment){
        return axios.put(`${source}/investiments`, investiment);
    },

    //Receitas
    findIncomes(eventId) {
        return axios.get(`${source}/incomes/event/${eventId}`);
    },

    showIncome(id){
        return axios.get(`${source}/incomes/${id}`);
    },

    storeIncome(eventId, income){
        return axios.post(`${source}/incomes/`, {
            income: {
                eventId: eventId,
                amount: income.amount,
                source: income.source,
                description: income.description,
            }
        });
    },

    deleteIncome(id){
        return axios.delete(`${source}/incomes/${id}`);
    },

    updateIncome(income){
        return axios.put(`${source}/incomes`, income);
    },

    //Despesas
    findExpenses(eventId) {
        return axios.get(`${source}/expenses/event/${eventId}`);
    },

    showExpense(id){
        return axios.get(`${source}/expenses/${id}`);
    },

    storeExpense(eventId, expense){
        return axios.post(`${source}/expenses/`, {
            expense: {
                eventId: eventId,
                amount: expense.amount,
                category: expense.category,
                description: expense.description,
            }
        });
    },

    deleteExpense(id){
        return axios.delete(`${source}/expenses/${id}`);
    },

    updateExpense(expense){
        return axios.put(`${source}/expenses`, expense);
    },
}