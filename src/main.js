import Vue from 'vue';
// import App from './App.vue'
import app from './app.vue';
import store from './store';

import VueMaterial from 'vue-material';
// import 'css!vue-material/dist/vue-material.css';
Vue.use(VueMaterial);

Vue.material.theme.registerAll({
  app : {
    primary: 'cyan',
    accent: 'pink',
    warn: 'red'
  },
  row : {
    primary: {
      color: 'cyan',
      hue: 200
    }
  }
});

var VueResource = require('vue-resource');
Vue.use(VueResource);

new Vue({
  el: '#app',
  store,
  render: h => h(app)
});
