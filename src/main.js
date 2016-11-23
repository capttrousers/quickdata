import Vue from 'vue';
import store from './store';

var VueResource = require('vue-resource');
Vue.use(VueResource);

// import App from './App.vue'
import app from './app.vue';

new Vue({
  el: '#app',
  store,
  render: h => h(app)
});
