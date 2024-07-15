import axios from "axios"
import { databaseURL } from "@/config"
import { emailValidator } from "@/helpers/validations"


export default {
    login(user){
        return axios.post(`${databaseURL}/login`, user)
    },

    signup(user){
        const validation = emailValidator(user.email)

        return validation ? axios.post(`${databaseURL}/signup`, user) : Promise.reject({error: true, message: "Invalid email"})
    },
}