import axios from "axios";
import { databaseURL } from "@/config";

const source = databaseURL + '/survey';

export default {
    index() {
        return axios.get(source);
    },

    show(id) {
        return axios.get(`${source}/${id}`);
    },

    store(data) {
        return axios.post(source, { survey: data });
    },

    update(id, data) {
        return axios.put(source+'/'+id, { survey: data });
    },

    delete(id) {
        return axios.delete(`${source}/${id}`);
    },

    showByUser(id) {
        return axios.get(`${source}/user/${id}`);
    },

    submitResponses(id, data: any) {
        return axios.post(`${source}/responses/`+id, { survey: data})
    }
};
