import { databaseURL } from "@/config"
import axios from 'axios'

export default {
    fetchEvents() {
        return axios.get(`${databaseURL}/events`)
    },

    createEvent(event){
        const formData = new FormData();

        for(let p in event){
            if(p === 'flayer')
                formData.append('image', event[p], event.flayerName);
            else
                formData.append(p, event[p]);
        }

        return axios.post(`${databaseURL}/events`, formData);
    },

    show(id){
        return axios.get(`${databaseURL}/events/${id}`);
    },

    delete(id){
        return axios.delete(`${databaseURL}/events/${id}`);
    },

    search(query){
        return axios.get(`${databaseURL}/events/search`, {
            params: {
                query
            }
        });
    },

    getStatistic(eventId){
        return axios.get(`${databaseURL}/statistics/${eventId}`);
    }
}