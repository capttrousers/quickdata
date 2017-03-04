import Vue from 'vue'
import Router from 'vue-router'
import Home from './home.vue'
import Help from './help.vue'
Vue.use(Router)

export default new Router({
  mode: 'hash',
  routes: [
    {
      path: '/help',
      component: Help
    },
    {
      path: '/',
      component: Home
    }
  ]
})
