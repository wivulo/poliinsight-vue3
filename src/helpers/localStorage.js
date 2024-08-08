export function getLocalStorage (key, fallback) {
  if (window.localStorage.getItem(key) == null) { return fallback }
  return JSON.parse(window.localStorage.getItem(key))
}

export function setLocalStorage (key, value) {
  window.localStorage.setItem(key, JSON.stringify(value))
}

export function removeLocalStorage (key) {
  window.localStorage.removeItem(key)
}
