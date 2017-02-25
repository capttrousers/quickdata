import "babel-polyfill";
import Vue from 'vue';
var VueResource = require('vue-resource');
Vue.use(VueResource);
// import App from './App.vue'
import app from './app.vue';
import store from './store';

import VueMaterial from 'vue-material';
// import 'css!vue-material/dist/vue-material.css';
Vue.use(VueMaterial);

Vue.material.registerTheme({
  "default" : {
    primary: {
      color: 'green',
      hue: '600'
    },
    accent: 'cyan',
    warn: 'red'
  },
  row : {
    primary: {
      color: 'cyan',
      hue: 200
    }
  }
});

new Vue({
  el: '#app',
  store,
  render: h => h(app)
});
