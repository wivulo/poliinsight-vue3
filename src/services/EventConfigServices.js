import axios from "axios"
import { databaseURL } from "@/config"

export default {
    index(){
        return axios.get(`${databaseURL}/eventconfig`)
    },

    show(id){
        return axios.get(`${databaseURL}/eventconfig/${id}`)
    },

    showByEventType(eventType){
        return axios.get(`${databaseURL}/eventconfig/eventtype`, {params: {type: eventType}})
    },

    create(data){
        return axios.post(`${databaseURL}/eventconfig`, data)
    },

    update(id, userId, data){
        return axios.put(`${databaseURL}/eventconfig/${id}/${userId}`, data)
    },

    delete(id, userId){
        return axios.delete(`${databaseURL}/eventconfig/${id}/${userId}`)
    }
}