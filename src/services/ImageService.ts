import axios from "axios"
import { databaseURL } from "@/config"

const baseUrl = `${databaseURL}/images`


export default {
    index(){
        return axios.post(`${baseUrl}`)
    },

    show(id: string){
        return axios.get(`${baseUrl}/${id}`)
    },

    store(file: File){
        if(!file) throw new Error('O arquivo é obrigatório');

        const formData = new FormData()
        formData.append('file', file)

        return axios.post(`${baseUrl}/store`, formData)
    },
}