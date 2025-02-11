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

    generateWithTemplate(report){
        return axios.post(`${databaseURL}/reports/generate/template`, {
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
    },

    storeTemplate(eventId, type, file){
        const formData = new FormData();
        formData.append('file', file);
        formData.append('eventId', eventId);
        formData.append('type', type);

        return axios.post(`${databaseURL}/reports/template/${eventId}`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });
    }
}