import axios from "axios"
import { databaseURL } from "@/config"

export default {
    index() {
        return axios.get(`${databaseURL}/import`)
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

        return axios.post(`${databaseURL}/import/participants`, formData)
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