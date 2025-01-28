import axios from "axios";
import { databaseURL } from "@/config";

const source = databaseURL + '/groups';

export default {
    index() {
        return axios.get(source);
    },

    show(id: any) {
        return axios.get(`${source}/${id}`);
    },

    store(data: any) {
        return axios.post(source, { group: data });
    },

    update(id: any, data: any) {
        return axios.put(source+'/'+id, { data });
    },

    delete(id: any) {
        return axios.delete(`${source}/${id}`);
    }
}