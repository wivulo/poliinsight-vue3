import axios from "axios"
import { databaseURL } from "@/config"

const baseUrl = `${databaseURL}/dashboard`

export default {
    getDashboardData() {
        return axios.get(baseUrl)
    },
    
    getDashboardOrganizerData(userId) {
        return axios.get(`${baseUrl}/organizer/${userId}`)
    },

    getDashboardNormalUserData(userId) {
        return axios.get(`${baseUrl}/user`)
    }
}