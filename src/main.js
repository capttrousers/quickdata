import Vue from 'vue';
import store from './store';

var VueResource = require('vue-resource');
Vue.use(VueResource);

// import App from './App.vue'
import form from './form.vue';

new Vue({
  el: '#form',
  store,
  render: h => h(form)
});
