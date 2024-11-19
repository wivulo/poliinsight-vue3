import axios from "axios"
import { databaseURL } from "@/config"

export default {
    forgotPassword(email){
        return axios.post(`${databaseURL}/auth/forgotpassword`, {email: email})
    },

    resetPasswordEmail({email, senha, token}){
        return axios.post(`${databaseURL}/auth/resetpasswordEmail`, {email, password: senha}, {params: {token}})
    },

    checkToken(token){
        return axios.get(`${databaseURL}/auth/checkToken`, {params: token} )
    },
}