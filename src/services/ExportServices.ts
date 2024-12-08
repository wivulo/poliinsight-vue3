import axios from "axios"
import { databaseURL } from "@/config"

const source = databaseURL + '/exports'

export default {
    index() {
        return axios.get(source)
    },

    show(id) {
        return axios.get(`${source}/${id}`)
    },

    store(data) {
        return axios.post(source, {exportData: data})
    },

    getByOperator(userId){
        return axios.get(`${source}/organizer/${userId}`)
    },

    exportGeneralEventsData(export_data: any){
        return axios.post(`${source}/general`, {export_data})
    },

    exportEspecificEventsData(export_data: any){
        return axios.post(`${source}/specific`, {export_data})
    },

    delete(id){
        return axios.delete(`${source}/${id}`)
    },
}