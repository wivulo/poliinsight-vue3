// directives/clickOutside.js
export default {
    mounted(el, { value }) {
      el.clickOutside = (event) => {
        if (!el.contains(event.target)) {
          value(event);
        }
      };
      document.addEventListener('click', el.clickOutside);
    },
    unmounted(el) {
      document.removeEventListener('click', el.clickOutside);
    }
  };