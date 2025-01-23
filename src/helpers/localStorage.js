export function getLocalStorage (key, fallback) {
  if(!key) return null

  const item = window.localStorage.getItem(key)
  if (item === null) { return fallback }
  if(item === 'undefined') return undefined

  return JSON.parse(item)
}

export function setLocalStorage (key, value) {
  window.localStorage.setItem(key, JSON.stringify(value))
}

export function removeLocalStorage (key) {
  window.localStorage.removeItem(key)
}
