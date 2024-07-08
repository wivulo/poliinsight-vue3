import axios from "axios"
import { databaseURL } from "@/config"

export default {
    forgotPassword(email){
        return axios.post(`${databaseURL}/forgotpassword`, {email})
    },

    resetPasswordEmail(data){
        return axios.post(`${databaseURL}/resetpasswordEmail`, data)
    }
}