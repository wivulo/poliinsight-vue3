import { databaseURL } from "@/config"
import axios from 'axios'

export default {
    fetchEvents() {
        return axios.get(`${databaseURL}/events`)
    },

    index(params = null) {
        return axios.get(`${databaseURL}/events`, {
            params
        })
    },

    public_index(params = null) {
        return axios.get(`${databaseURL}/events/public`)
    },

    fetchEventsOrganizer(organizerId) {
        return axios.get(`${databaseURL}/events/organizer/${organizerId}`)
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

    update(event){
        return axios.put(`${databaseURL}/events/${event.id}`, { event });
    },

    show(id){
        return axios.get(`${databaseURL}/events/${id}`);
    },

    showPublic(id){
        return axios.get(`${databaseURL}/events/public/${id}`);
    },

    delete(id){
        return axios.delete(`${databaseURL}/events/${id}`);
    },

    search(params){
        return axios.post(`${databaseURL}/events/search`, { params });
    },

    getStatistic(eventId){
        return axios.get(`${databaseURL}/statistics/${eventId}`);
    },

    changeStatus(eventId, statusId){
        return axios.put(`${databaseURL}/events/status/${eventId}`, { statusId });
    },

    feedback(eventId, feedback){
        return axios.post(`${databaseURL}/events/feedback/${eventId}`, { feedback });
    },

    getFeedBacks(eventId){
        return axios.get(`${databaseURL}/events/feedback/${eventId}`);
    }
}