import axios from "axios"
import { databaseURL } from "@/config"
import { GuestType } from "@/model/activity.model"

const source = databaseURL + '/activities'
const sourceActivityTypes = databaseURL + '/activityTypes'
const sourceActivtyGuest = databaseURL + '/activityGuests'

export default {
    index() {
        return axios.get(source)
    },

    show(id: number) {
        return axios.get(`${source}/${id}`)
    },

    ListByEvent(eventId: string) {
        return axios.get(`${source}/event/${eventId}`)
    },

    store(activity: any) {
        return axios.post(source, { activity })
    },

    findByOperator(userId: string){
        return axios.get(`${source}/organizer/${userId}`)
    },

    delete(id: string){
        return axios.delete(`${source}/${id}`)
    },

    update(activity: any) {
        return axios.put(`${source}/${activity.id}`, { activity })
    },


    // Activity Types
    findActivityTypes() {
        return axios.get(sourceActivityTypes)
    },

    storeActivityType(activityType: any) {
        return axios.post(sourceActivityTypes, { activityType })
    },

    showActivityType(id: string) {
        return axios.get(`${sourceActivityTypes}/${id}`)
    },

    updateActivityType(activityType: any) {
        return axios.put(`${sourceActivityTypes}/${activityType.id}`, { activityType })
    },

    deleteActivityType(id: string) {
        return axios.delete(`${sourceActivityTypes}/${id}`)
    },

    //Guests
    listGuest(activityId: string) {
        return axios.get(`${sourceActivtyGuest}/activity/${activityId}`)
    },

    storeGuest(guest: Omit<GuestType, "id">) {
        return axios.post(sourceActivtyGuest, { guest })
    },

    showGuest(id: string) {
        return axios.get(`${sourceActivtyGuest}/${id}`)
    },

    updateGuest(guest: GuestType) {
        return axios.put(`${sourceActivtyGuest}/${guest.id}`, { guest })
    },

    deleteGuest(id: string) {
        return axios.delete(`${sourceActivtyGuest}/${id}`)
    }
}