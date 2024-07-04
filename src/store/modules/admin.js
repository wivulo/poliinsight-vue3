import Cookies from 'js-cookie'
import { databaseURL } from "@/config"
import axios from 'axios'

export const admin = { 
    namespaced: true,   
    // state
    state: {
        users: [],
        events: [],
        token: Cookies.get('token'),
        onSignup: false,
        onCreateEvent: false
    },
    // getters
    getters: {
        users: state => {
            let newUsers = [];
            state.users.map(user => {
                newUsers.push({
                    id: user.id,
                    name: user.name,
                    nickname: user.nickname,
                    email: user.email,
                    username: user.username,
                    gender: user.gender,
                    groupId: user.groupId
                })
            })

            return newUsers;
        },
        totalUsers: state => state.users.length,
        events: state => state.events,
        totalEvents: state => state.events.length,
        onSignup: state => state.onSignup,
        onCreateEvent: state => state.onCreateEvent
    },
  
    // mutations
    mutations: {
        users(state, { user }) {
            state.users = user
        },
    
        events (state, { events }) {
            state.events = events
        },

        onSignup(state, { signup }){
            state.onSignup = signup;
        },

        onCreateEvent(state, { create }){
            state.onCreateEvent = create;
        },
    },
  
    // actions
    actions: {
        async fetchUsers ({ commit, state }, id) {
            try {
                const { data } = await axios.get(`${databaseURL}/users`)
        
                commit("users", { user: data })
            } catch (e) {
                //TODO: add error notification
            }
        },

        async fetchEvents ({ commit, state }, id) {
            try {
                const { data } = await axios.get(`${databaseURL}/events`)
        
                commit("events", { events: data })
            } catch (e) {
                //TODO: add error notification
            }
        },
        
        async createUser({ commit, state }, user){
            try{
                commit('onSignup', {signup: true});
                const { data } = await axios.post(`${databaseURL}/signup`, user);

                commit('onSignup', {signup: false});

                if(data.error){
                    //TODO: add error notification

                    return data
                }

                //TODO: add successfully notification

                return data
            }catch(err){
                //TODO: add error notification
            }
        },

        async createEvent({ commit, state }, event){
            try{
                commit('onCreateEvent', {create: true});
                const { data } = await axios.post(`${databaseURL}/events`, 
                {
                    event: event
                });

                commit('onCreateEvent', {create: false});

                if(data.error){
                    //TODO: add error notification
                }

                //TODO: add successfully notification

            }catch(err){
                //TODO: add error notification
            }
        }
    }
}
