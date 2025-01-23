import { createStore } from 'vuex'
import { auth } from './modules/auth'
import { admin } from './modules/admin'
import { event } from './modules/event'
import { group } from './modules/group'
import printer from './modules/printer'

// Create a new store instance.
export const store = createStore({
    modules: {
        auth,
        admin,
        event,
        printer,
        group
    }
})