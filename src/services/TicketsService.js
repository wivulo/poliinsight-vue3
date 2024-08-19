import axios from "axios"
import { databaseURL } from "@/config"

export default {
    index() {
        return axios.get(`${databaseURL}/tickets`)
    },

    store(ticket){
        return axios.post(`${databaseURL}/tickets`, {ticket})
    },

    show(id){
        return axios.get(`${databaseURL}/tickets/${id}`)
    },

    update(ticket){
        return axios.put(`${databaseURL}/tickets/${ticket.id}`, ticket)
    },

    destroy(id){
        return axios.delete(`${databaseURL}/tickets/${id}`)
    },

    getByEventId(eventId){
        return axios.get(`${databaseURL}/tickets/event/${eventId}`)
    },

    getByUserId(userId){
        return axios.get(`${databaseURL}/tickets/user/${userId}`)
    }
}