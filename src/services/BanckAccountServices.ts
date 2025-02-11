import axios from "axios";
import { databaseURL } from "@/config";
const base = `${databaseURL}/bankAccounts`;

export default {
    index() {
        return axios.get(base)
    },

    store(banckAccount: any) {
        return axios.post(base, { banckAccount })
    },

    show(id: number) {
        return axios.get(`${base}/${id}`)
    },

    update(banckAccount: any) {
        return axios.put(`${base}/${banckAccount.id}`, { banckAccount })
    },

    destroy(id: number) {
        return axios.delete(`${base}/${id}`)
    }
}