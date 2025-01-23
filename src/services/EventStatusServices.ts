import axios from "axios";
import { databaseURL } from "@/config"

const baseUrl = `${databaseURL}/eventStatus`

export default {
    index(){
        return axios.get(`${baseUrl}`)
    },

    show(id: string){
        return axios.get(`${baseUrl}/${id}`)
    },

    create(status: any){
        return axios.post(`${baseUrl}`, status)
    },

    update(status: any){
        return axios.put(`${baseUrl}/${status.id}`, status)
    },

    delete(id: string){
        return axios.delete(`${baseUrl}/${id}`)
    }
}
