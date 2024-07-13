import axios from "axios"
import { databaseURL } from "@/config"

export default {
    forgotPassword(email){
        return axios.post(`${databaseURL}/forgotpassword`, {email: email})
    },

    resetPasswordEmail({email, senha, token}){
        return axios.post(`${databaseURL}/resetpasswordEmail`, {email, password: senha}, {params: {token}})
    },

    checkToken(token){
        return axios.get(`${databaseURL}/checkToken`, {params: token} )
    },
}