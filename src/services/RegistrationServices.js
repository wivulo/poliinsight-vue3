import { databaseURL } from "@/config"
import axios from 'axios'

export default {
    index(){
        return axios.get(`${databaseURL}/registrations`)
    },

    show(id){
        return axios.get(`${databaseURL}/registrations/${id}`)
    },

    showByEvent(eventId){
        return axios.get(`${databaseURL}/registrations/event/${eventId}`)
    },

    store(data){
        return axios.post(`${databaseURL}/registrations`, {
            registration: data
        })
    }
}