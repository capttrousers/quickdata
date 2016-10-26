import Vue from 'vue'
var VueResource = require('vue-resource');
Vue.use(VueResource);

// import App from './App.vue'
import form from './form.vue'

new Vue({
  el: '#form',
  render: h => h(form)
})
