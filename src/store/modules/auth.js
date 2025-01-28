import Cookies from 'js-cookie'
import { databaseURL } from "../../config"
import axios from 'axios'
import * as types from '../mutation-types'
import { getLocalStorage, setLocalStorage, removeLocalStorage } from '@/helpers/localStorage'
import { prepareonlyRoles, prepareRolesAndPath, perparenavAndRoles} from '@/helpers/rules'
import router from '@/router'


export const auth = { 
    namespaced: true,   
    // state
    state: {
        user: getLocalStorage('AUTH_USER', null),
        onLogin: false,
        token: Cookies.get('token'),
        busy: false,
        navAndRoles: getLocalStorage('AUTH_NAV_AND_ROLES', []),
        RolesAndPath: getLocalStorage('AUTH_ROLES_AND_PATH', []),
        onlyRoles: getLocalStorage('AUTH_ONLY_ROLES', []),
        fetchNavsBusy: false,
    },
    // getters
    getters: {
        check: state => state.user !== null,
        user: state => state.user,
        onLogin: state => state.onLogin,
        token: state => state.token,
        check: state => state.userId !== null,
        busy: state => state.busy,
        navAndRoles: state => state.navAndRoles,
        RolesAndPath: state => state.RolesAndPath,
        onlyRoles: state => state.onlyRoles,
        isAdminOrOrganizer: state => state.user?.groups.find(userGroup =>  ['admininistrator', 'organizador'].includes(userGroup.group.name)),
        isAdmin: state => state.user?.groups.find(userGroup => userGroup.group.name === 'admininistrator'),
        organizerGroup: state => state.user?.groups.find(userGroup => userGroup.group.name === 'organizador'),
        colaboratorGroup: state => state.user?.groups.find(userGroup => userGroup.group.name === 'colaborator'),
        participantGroup: state => state.user?.groups.find(userGroup => userGroup.group.name === 'participant'),
        fetchNavsBusy: state => state.fetchNavsBusy
    },
  
    // mutations
    mutations: {
        [types.SAVE_TOKEN] (state, { token, remember }) {
            state.token = token
            Cookies.set('token', token, { expires: remember ? 365 : null })
        },
    
        [types.FETCH_USER_SUCCESS] (state, { user }) {
            state.user = user
            setLocalStorage('AUTH_USER', user)
        },
    
        [types.FETCH_USER_FAILURE] (state) {
            state.token = null
            Cookies.remove('token')
            state.user = null
            state.navAndRoles = []
            state.RolesAndPath = []
            state.onlyRoles = []
            setLocalStorage('AUTH_USER', null)
            setLocalStorage('AUTH_NAV_AND_ROLES', [])
            setLocalStorage('AUTH_ROLES_AND_PATH', [])
            setLocalStorage('AUTH_ONLY_ROLES', [])
            setLocalStorage('AUTH_USER_GROUPS', [])
            setLocalStorage('AUTH_USER_WORK_GROUP', [])

        },
    
        [types.LOGOUT] (state) {
            state.user = null
            state.token = null
        
            Cookies.remove('token')
            state.navAndRoles = []
            state.RolesAndPath = []
            state.onlyRoles = []
            setLocalStorage('AUTH_USER', null)
            setLocalStorage('AUTH_NAV_AND_ROLES', [])
            setLocalStorage('AUTH_ROLES_AND_PATH', [])
            setLocalStorage('AUTH_ONLY_ROLES', [])
            setLocalStorage('AUTH_USER_GROUPS', [])
            setLocalStorage('AUTH_USER_WORK_GROUP', [])
        },
    
        [types.UPDATE_USER] (state, { user }) {
            state.user = user
            setLocalStorage('AUTH_USER', user)
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

        [types.FETCH_NAVS_BUSY] (state, { busy }){
            state.fetchNavsBusy = busy
        },
    },
  
    // actions
    actions: {
        saveToken ({ commit }, payload) {
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
        
                commit(types.FETCH_USER_SUCCESS, { user: data })
                commit(types.FETCH_USER_BUSY, { busy: false })
            } catch (e) {
                commit(types.FETCH_USER_FAILURE)
                commit(types.FETCH_USER_BUSY, { busy: false })
            }
        },

        async fetchNavAndRoles ({ commit }, id) {
            try {
                commit(types.FETCH_NAVS_BUSY,  {busy: true})

                let { data } = await axios.get(`${databaseURL}/rulesForGroup/navAndRules/${id}`)
                commit(types.FETCH_NAV_AND_ROLES_SUCCESS, data)
            } catch (e) {
              commit(types.FETCH_NAV_AND_ROLES_FAILURE, null)
            } finally {
                commit(types.FETCH_NAVS_BUSY,  {busy: false})
            }
          },
    
        updateUser ({ commit }, payload) {
            commit(types.UPDATE_USER, payload)
        },
    
        async logout ({ commit }) {        
            commit(types.LOGOUT)
            router.push({ name: 'home' })
        },
    }
}
