import axios from "axios"
import { databaseURL } from "@/config"

export default {
    index() {
        return axios.get(`${databaseURL}/category`)
    }
}