import Vue from 'vue'
/**
 * Custom event: v-click-outside
 * Triggers a custom event when the user clicks outside of the element.
 * Currently used to close v-menu when the user clicks outside of it.
 *
 * Usage example:
 * <v-menu v-click-outside="closeMenu">
 */
Vue.directive('click-outside', {
  bind: function (el, binding, vnode) {
    el.clickOutsideEvent = function (event) {
      /** Check if click was outside the el and its children */
      if (!(el == event.target || el.contains(event.target))) {
        /** Clicked outside - Call method provided in attribute value */
        vnode.context[binding.expression](event)
      }
    }
    document.body.addEventListener('click', el.clickOutsideEvent)
  },
  unbind: function (el) {
    document.body.removeEventListener('click', el.clickOutsideEvent)
  },
})
