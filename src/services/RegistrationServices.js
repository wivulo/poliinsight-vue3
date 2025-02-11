import { databaseURL } from "@/config"
import axios from 'axios'

export default {
    index(){
        return axios.get(`${databaseURL}/registrations`)
    },

    show(id){
        return axios.get(`${databaseURL}/registrations/${id}`)
    },

    showByEvent(eventId, params = null){
        return axios.get(`${databaseURL}/registrations/event/${eventId}`, {
            params
        })
    },

    showByUser(userId, params = null){
        return axios.get(`${databaseURL}/registrations/user/${userId}`, {
            params
        })
    },

    store(data){
        return axios.post(`${databaseURL}/registrations`, {
            registration: data
        })
    },

    payment(data){
        return axios.post(`${databaseURL}/registrations/payment`, {
            payment: data
        })
    },

    checkUserByEmail(email, eventId){
        return axios.get(`${databaseURL}/registrations/checkUserByEmail/user/${email}/event/${eventId}`)
    }
}