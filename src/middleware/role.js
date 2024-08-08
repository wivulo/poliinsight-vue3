import store from '~/store'

/**
 * This is middleware to check the current user role.
 *
 * middleware: 'role:admin,manager',
 */

export default (to, from, next, roles) => {
  // Grab the user
  let storageRoles = store.getters['auth/onlyRoles']
  roles = roles.split(',')
  if (storageRoles != null) {
    return roles.some((role) => storageRoles.includes(role.toLowerCase()) === true) ? next() : next({ name: 'unauthorised' })
  }
}
