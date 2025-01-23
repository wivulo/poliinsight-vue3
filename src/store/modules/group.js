import { databaseURL } from "../../config"
import axios from 'axios'
import * as types from '../mutation-types'
import { Swal } from "sweetalert2/dist/sweetalert2"
import { getLocalStorage, setLocalStorage, removeLocalStorage } from '@/helpers/localStorage'

export const group = { 
    namespaced: true,   
    // state
    state: {
        groups: getLocalStorage('AUTH_USER_GROUPS') || [],
        workGroup: getLocalStorage('AUTH_USER_WORK_GROUP') || {},
        busy: false
    },
    // getters
    getters: {
        groups: state => state.groups,
        workGroup: state => state.workGroup,
        busy: state => state.busy,
    },
  
    // mutations
    mutations: {
        [types.FETCH_GROUPS] (state, { groups }) {
            state.groups = groups
            setLocalStorage('AUTH_USER_GROUPS', groups)
        },
    
        [types.CHANGE_WORK_GROUP] (state, { group }) {
            state.workGroup = group
            setLocalStorage('AUTH_USER_WORK_GROUP', group)
        },

        [types.FETCH_GROUPS_BUSY] (state, { busy }) {
            state.busy = busy
        }
    },
  
    // actions
    actions: {
        async fetchGroups ({ commit, state }, id) {
            try {
                commit(types.FETCH_GROUPS_BUSY, { busy: true })
                const response = await axios.get(`${databaseURL}/groups/user/${id}`)
                if(response.status === 200) {
                    commit(types.FETCH_GROUPS, { groups: response.data })
                    
                    if(response.data?.length && state.workGroup.id === undefined) {
                        //Procurar na lista de grupos os grupos de preferencia do sistema, na ordem:
                        //1 - admininistrator, 2 - organizador, 3 - participante, 4 - qualquer outro
                        const group = response.data.find(group => group.name === 'administrator') ||
                                        response.data.find(group => group.name === 'organizador') ||
                                        response.data.find(group => group.name === 'participante') ||
                                        response.data[0]

                        commit(types.CHANGE_WORK_GROUP, { group: group })
                    }
                    return response.data
                }
            } catch (error) {
                console.log(error)
                
            } finally {
                commit(types.FETCH_GROUPS_BUSY, { busy: false })
            }
        },

        async changeWorkGroup ({ commit, state }, { group }) {
            const result = await Swal.fire({
                title: 'Tem certeza?',
                text: `O grupo de trabalho vai mudar para ${group.name}`,
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Yes, change it!'
            })

            if(result.isConfirmed) {
                commit(types.CHANGE_WORK_GROUP, { group })
            }
        }
    }
}
