import Cookies from 'js-cookie'
import { databaseURL } from "@/config"
import axios from 'axios'

export const printer = { 
    namespaced: true,   
    // state
    state: {
        content: null,
        cssRulesPath: null,
        busy: false,
    },
    // getters
    getters: {
        content: state => state.content,
    },
  
    // mutations
    mutations: {
        content (state, { content }) {
            state.content = content
        },
    },
}
