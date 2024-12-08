import axios, { AxiosResponse } from 'axios';
import { databaseURL } from "@/config"
import { Speaker, CreateSpeaker } from "@/model/Speaker.model"

const source = databaseURL + '/speakers'

export default {
    index(): Promise<AxiosResponse<Speaker[]>> {
        return axios.get(source)
    },

    store(speaker: CreateSpeaker): Promise<AxiosResponse<Speaker>>{
        const formData = new FormData();
        
        for(let p in speaker){
            if(p === 'photo')
                formData.append('image', speaker[p], speaker[p].name);
            else
                formData.append(p, speaker[p]);
        }
        
        return axios.post(source, formData)
    },

    addSpeakerToEvent(eventId: any, speakerId: string){
        return axios.post(`${source}/event/${eventId}/speaker/${speakerId}`)
    },

    show(id: string){
        return axios.get(`${source}/${id}`)
    },

    showByEvent(eventId: string){
        return axios.get(`${source}/event/${eventId}`)
    },

    update(id: string, speaker: any){
        return axios.put(`${source}/${id}`, { speaker })
    },

    delete(id: string){
        return axios.delete(`${source}/${id}`)
    },
}