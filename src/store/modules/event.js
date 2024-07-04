import Cookies from 'js-cookie'
import { databaseURL } from "@/config"
import axios from 'axios'

export const event = { 
    namespaced: true,   
    // state
    state: {
        events: [],
        onCreateEvent: false,
        hasBenCreated: false,
        createdEventId: null,
        selectedEvent: null
    },
    // getters
    getters: {
        events: state => state.events,
        totalEvents: state => state.events.length,
        hasBenCreated: state => state.hasBenCreated,
        onCreateEvent: state => state.onCreateEvent,
        createdEventId: state => state.createdEventId,
        selectedEvent: state => state.selectedEvent
    },
  
    // mutations
    mutations: {
        events (state, { events }) {
            state.events = events
        },

        onCreateEvent(state, { createEvent }){
            state.onCreateEvent = createEvent;
        },

        onHasBenCreated(state, { hasBenCreated }){
            state.hasBenCreated = hasBenCreated;
        },

        createdEventId(state, { createdEventId }){
            state.createdEventId = createdEventId;
        },

        selectedEvent(state, { selectedEvent }){
            state.selectedEvent = selectedEvent;
        }
    },
  
    // actions
    actions: {
        async fetchEvents ({ commit, state }, id) {
            try {
                const { data } = await axios.get(`${databaseURL}/events`)
        
                commit("events", { events: data })
            } catch (e) {
                //TODO: handle error
            }
        },

        async createEvent({ commit, state }, event){
            try{
                commit('onCreateEvent', {createEvent: true});

                const formData = new FormData();

                for(let p in event){
                    if(p === 'flayer')
                        formData.append('image', event[p], event.flayerName);
                    else
                        formData.append(p, event[p]);
                }

                const { data } = await axios.post(`${databaseURL}/events`, formData);

                if(data.error){
                    return {error: 'Erro ao criar o evento'}
                }

                commit('createdEventId', { createdEventId: data.id });
                commit('onHasBenCreated', { hasBenCreated: true});
                commit('onCreateEvent', {createEvent: false});

                return true

            }catch(err){
                commit('onCreateEvent', {createEvent: false});
                return {error: 'Erro ao criar o evento'}
            }
        },

        async fetchEventById({ commit, state }, id){
            try{
                const { data } = await axios.get(`${databaseURL}/events/${id}`)

                if(data.error) return data

                commit('selectedEvent', { selectedEvent: data });
                return data
            }catch(err){
                return err
            }
        }
    }
}
