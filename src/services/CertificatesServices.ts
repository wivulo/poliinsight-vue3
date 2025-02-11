import axios from "axios"
import { databaseURL } from "@/config"

const source = databaseURL + '/certificates'

export default {
    index () {
        return axios.get(source)
    },

    listByEvent(eventId: number, params: any) {
        return axios.get(source + '/' + eventId,  {
            params
        })
    },

    listByUser(userId: number, params: any) {
        return axios.get(source + '/' + userId,  {
            params
        })
    },

    generate(certificate: any) {
        return axios.post(source + '/generate', { certificate })
    },

    show(id: number) {
        return axios.get(source + '/' + id)
    },
    
    validate(code: string) {
        return axios.get(source + '/validate/' + code)
    },

    listTemplates(eventId: string | string[]) {
        return axios.get(source + '/templates/' + eventId)
    },

    templateUpload(template: any, file: File) {
        const formData = new FormData()
        formData.append('file', file)
        formData.append('eventId', template.eventId)
        formData.append('type', template.type)
        formData.append('name', template.name)
        
        return axios.post(source + '/templates/upload', formData)
    },

    templateUpdate(template: any, file: File) {
        const formData = new FormData()

        if (file)
            formData.append('file', file)

        formData.append('eventId', template.eventId)
        formData.append('type', template.type)
        formData.append('name', template.name)
        
        return axios.post(source + '/templates/update/'+template.id, formData)
    },

    deleteTemplate(id: number) {
        return axios.delete(source + '/templates/' + id)
    }
}