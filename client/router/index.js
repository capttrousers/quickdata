import Vue from 'vue'
import Router from 'vue-router'
import Home from '../components/home.vue'
import Help from '../components/help.vue'
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
