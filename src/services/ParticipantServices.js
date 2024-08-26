import { databaseURL } from "@/config"
import axios from 'axios'
/*
app.get("/participants", verifyToken, ParticipantController.FindParticipants);
app.post("/participants", verifyToken, ParticipantController.CreateParticipant);
app.get("/participants/:id", verifyToken, ParticipantController.FindParticipantById);
app.get("/participants/email/:email", verifyToken, ParticipantController.FindParticipantByEmail);
app.get("/participants/name/:name", verifyToken, ParticipantController.FindParticipantByName);
*/
export default {
    index(){
        return axios.get(`${databaseURL}/participants`)
    },

    show(id){
        return axios.get(`${databaseURL}/participants/${id}`)
    },

    showByEvent(eventId){
        return axios.get(`${databaseURL}/participants/event/${eventId}`)
    },

    store(data){
        return axios.post(`${databaseURL}/participants`, {
            data
        })
    }
}