import { databaseURL } from "@/config"
import axios from 'axios'

export default {
    index() {
        return axios.get(`${databaseURL}/teamParticipants`)
    },

    show(id){
        return axios.get(`${databaseURL}/teamParticipants/${id}`);
    },

    search(query){
        return axios.get(`${databaseURL}/teamParticipants/search`, {
            params: {
                query
            }
        });
    },
}