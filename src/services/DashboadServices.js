import axios from "axios"
import { databaseURL } from "@/config"

export default {
    getDashboardData() {
        return axios.get(`${databaseURL}/dashboard`)
    },
    
    getDashboardOrganizerData(userId) {
        return axios.get(`${databaseURL}/organizer_dashboard/${userId}`)
    },

    getDashboardNormalUserData(userId) {
        return axios.get(`${databaseURL}/user_dashboard`)
    }
}