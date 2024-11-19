import axios from "axios"
import { databaseURL } from "@/config"
import { emailValidator } from "@/helpers/validations"

const baseUrl = `${databaseURL}/auth`


export default {
    login(user){
        return axios.post(`${baseUrl}/login`, user)
    },

    signup(user){
        const validation = emailValidator(user.email)

        return validation ? axios.post(`${baseUrl}/signup`, user) : Promise.reject({error: true, message: "Invalid email"})
    },
}