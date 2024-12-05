import { createStore } from 'vuex'
import { auth } from './modules/auth'
import { admin } from './modules/admin'
import { event } from './modules/event'
import printer from './modules/printer'

// Create a new store instance.
export const store = createStore({
    modules: {
        auth,
        admin,
        event,
        printer
    }
})