import axios from "axios"
import { databaseURL } from "@/config"
import { emailValidator, minLength } from "@/helpers/validations"


export default {
    login(){},

    signup(user){
        if(!emailValidator(user.email)){
            throw new Error('E-mail inválido!')
        }

        if(user.password != user.confirmPassword) {
            throw new Error('A confirmação da password não conscide!')
        }

        return axios(`${databaseURL}/signup`, user)
    },
}