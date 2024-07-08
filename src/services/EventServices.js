import { databaseURL } from "@/config"
import axios from 'axios'

export default {
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
}