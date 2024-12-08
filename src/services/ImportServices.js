import axios from "axios"
import { databaseURL } from "@/config"

const source = databaseURL + '/imports'

export default {
    index() {
        return axios.get(source)
    },

    importParticipants(import_data){
        const formData = new FormData();
        console.log(import_data);
        for(let p in import_data){
            if(p === 'file')
                formData.append('file', import_data[p], import_data[p].name);
            else
                formData.append(p, import_data[p]);
        }

        return axios.post(`${source}/participants`, formData)
    },

    show(id){
        return axios.get(`${source}/${id}`)
    },

    destroy(id){
        return axios.delete(`${source}/${id}`)
    },

    getByOperator(userId){
        return axios.get(`${source}/organizer/${userId}`)
    }
}