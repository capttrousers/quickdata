import Vue from 'vue';
// import App from './App.vue'
import app from './app.vue';
import store from './store';

import VueMaterial from 'vue-material';
// import 'css!vue-material/dist/vue-material.css';
Vue.use(VueMaterial);
Vue.material.theme.register('default', {
  primary: 'cyan',
  accent: 'pink'
});
  
var VueResource = require('vue-resource');
Vue.use(VueResource);

new Vue({
  el: '#app',
  store,
  render: h => h(app)
});
