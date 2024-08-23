import axios from "axios"
import { databaseURL } from "@/config"

export default {
    index() {
        return axios.get(`${databaseURL}/import`)
    },

    importParticipants(import_data){
        return axios.post(`${databaseURL}/import/participants`, {event: import_data})
    },

    show(id){
        return axios.get(`${databaseURL}/import/${id}`)
    },

    destroy(id){
        return axios.delete(`${databaseURL}/import/${id}`)
    },

    getByOperator(userId){
        return axios.get(`${databaseURL}/import/organizer/${userId}`)
    }
}