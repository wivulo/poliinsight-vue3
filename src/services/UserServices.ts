import axios from "axios"
import { databaseURL } from "@/config"

const baseUrl = `${databaseURL}/users`


export default {
    index(){
        return axios.post(`${baseUrl}`)
    },

    show(id: string){
        return axios.get(`${baseUrl}/${id}`)
    },

    update(user: any, file?: File){
        if(file){
            const formData = new FormData()
            formData.append('file', file)

            for(let p in user){
                formData.append(p, user[p]);
            }

            return axios.put(`${baseUrl}/${user.id}`, formData)
        }else{
            return axios.put(`${baseUrl}/${user.id}`, user)
        }
    },

    updatePassword(user: any, oldPassword: string, newPassword: string){
        return axios.put(`${baseUrl}/password/${user.id}`, {
            user,
            oldPassword,
            newPassword
        })
    }
}