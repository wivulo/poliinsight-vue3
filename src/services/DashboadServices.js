import axios from "axios"
import { databaseURL } from "@/config"

export default {
    async getDashboardData() {
        return axios.get(`${databaseURL}/dashboard`)
    }
}