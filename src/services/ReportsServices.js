import { databaseURL } from "@/config"
import axios from 'axios'

export default {
    index() {
        return axios.get(`${databaseURL}/reports`);
    },

    store(report){
        return axios.post(`${databaseURL}/reports/`, {
            report
        });
    },

    generate(report){
        return axios.post(`${databaseURL}/reports/generate`, {
            report
        });
    },

    export(report){
        return axios.post(`${databaseURL}/reports/export`, {
            report
        });
    },

    show(id){
        return axios.get(`${databaseURL}/reports/show/${id}`);
    },

    showByEventId(eventId){
        return axios.get(`${databaseURL}/reports/${eventId}`);
    },

    delete(id){
        return axios.delete(`${databaseURL}/reports/${id}`);
    },

    update(report){
        return axios.put(`${databaseURL}/reports`, report);
    },

    getReportFile(fileUrl){
        return axios.get(fileUrl, { responseType: 'blob' });
    }
}