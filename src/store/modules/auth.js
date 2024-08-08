import Cookies from 'js-cookie'
import { databaseURL } from "../../config"
import axios from 'axios'
import * as types from '../mutation-types'
import { getLocalStorage, setLocalStorage, removeLocalStorage } from '@/helpers/localStorage'
import { prepareonlyRoles, prepareRolesAndPath, perparenavAndRoles} from '@/helpers/rules'


export const auth = { 
    namespaced: true,   
    // state
    state: {
        user: null,
        onLogin: false,
        token: Cookies.get('token'),
        userId: Cookies.get('userId'),
        busy: false,
        navAndRoles: getLocalStorage('AUTH_NAV_AND_ROLES', []),
        RolesAndPath: getLocalStorage('AUTH_ROLES_AND_PATH', []),
        onlyRoles: getLocalStorage('AUTH_ONLY_ROLES', []),
    },
    // getters
    getters: {
        check: state => state.user !== null,
        user: state => state.user,
        onLogin: state => state.onLogin,
        token: state => state.token,
        check: state => state.user !== null,
        userId: state => state.userId,
        busy: state => state.busy,
        navAndRoles: state => state.navAndRoles,
        RolesAndPath: state => state.RolesAndPath,
        onlyRoles: state => state.onlyRoles,
    },
  
    // mutations
    mutations: {
        [types.SAVE_TOKEN] (state, { token, remember }) {
            state.token = token
            Cookies.set('token', token, { expires: remember ? 365 : null })
        },
    
        [types.FETCH_USER_SUCCESS] (state, { user }) {
            state.user = user
        },

        [types.SAVE_USER] (state, { userId }){
            Cookies.set('userId', userId)
        },
    
        [types.FETCH_USER_FAILURE] (state) {
            state.token = null
            Cookies.remove('token')
            Cookies.remove('userId')
        },
    
        [types.LOGOUT] (state) {
            state.user = null
            state.token = null
        
            Cookies.remove('token')
            Cookies.remove('userId')
            state.navAndRoles = []
            state.RolesAndPath = []
            state.onlyRoles = []
            setLocalStorage('AUTH_NAV_AND_ROLES', [])
            setLocalStorage('AUTH_ROLES_AND_PATH', [])
            setLocalStorage('AUTH_ONLY_ROLES', [])
        },
    
        [types.UPDATE_USER] (state, { user }) {
            state.user = user
        },

        [types.ON_LOGIN] (state, { onLogin }) {
            state.onLogin = onLogin
        },

        [types.FETCH_USER_BUSY] (state, { busy }) {
            state.busy = busy
        },
        [types.FETCH_NAV_AND_ROLES_SUCCESS] (state,  navAndRoles ) {
            state.navAndRoles = perparenavAndRoles(navAndRoles)
            state.RolesAndPath = prepareRolesAndPath(navAndRoles)
            state.onlyRoles = prepareonlyRoles(navAndRoles)
            setLocalStorage('AUTH_NAV_AND_ROLES',  state.navAndRoles)
            setLocalStorage('AUTH_ROLES_AND_PATH',  state.RolesAndPath)
            setLocalStorage('AUTH_ONLY_ROLES', state.onlyRoles )
          },
          [types.FETCH_NAV_AND_ROLES_FAILURE]  (state) {
            state.navAndRoles = []
            state.RolesAndPath = []
            state.onlyRoles = []
            setLocalStorage('AUTH_NAV_AND_ROLES', [])
            setLocalStorage('AUTH_ROLES_AND_PATH', [])
            setLocalStorage('AUTH_ONLY_ROLES', [])
          },
    },
  
    // actions
    actions: {
        saveToken ({ commit, dispatch }, payload) {
            commit(types.SAVE_TOKEN, payload)
        },
    
        async fetchUser ({ commit, state }, id) {
            try {
                commit(types.FETCH_USER_BUSY, { busy: true })

                const { data } = await axios.get(`${databaseURL}/users/${id}`)

                if(data.error){
                    commit(types.FETCH_USER_FAILURE)
                    return { error: 'Unauthenticated' }
                }
        
                commit(types.SAVE_USER, { userId: data?.id })
                commit(types.FETCH_USER_SUCCESS, { user: data })
                commit(types.FETCH_USER_BUSY, { busy: false })
            } catch (e) {
                commit(types.FETCH_USER_FAILURE)
                commit(types.FETCH_USER_BUSY, { busy: false })
            }
        },

        async fetchNavAndRoles ({ commit }, id) {
            try {
              let { data } = await axios.get(`${databaseURL}/rulesForGroup/navAndRules/${id}`)
              commit(types.FETCH_NAV_AND_ROLES_SUCCESS, data)
            } catch (e) {
              commit(types.FETCH_NAV_AND_ROLES_FAILURE, null)
            }
          },
    
        updateUser ({ commit }, payload) {
            commit(types.UPDATE_USER, payload)
        },
    
        async logout ({ commit }) {        
            commit(types.LOGOUT)
        },
    
        async login ({ commit }, user) {
            try{

                commit(types.ON_LOGIN, { onLogin: true })
                const { data } = await axios.post(`${databaseURL}/login`, user)

                commit(types.ON_LOGIN, { onLogin: false })
                
                if(data.error) {
                   //error with sweetalert
                    return data
                }else{
                    commit(types.SAVE_TOKEN, { token: data.token, remember: false })
                    // redirectOnLogin(data.user)
                    return data
                }
            }catch(err){
                commit(types.ON_LOGIN, { onLogin: false })
                //TODO: notificação de erro
            }
        },
    }
}
