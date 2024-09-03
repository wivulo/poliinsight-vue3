import { databaseURL } from "@/config"
import axios from 'axios'

export default {
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
    }
}