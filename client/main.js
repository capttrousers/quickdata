import "babel-polyfill";
import Vue from 'vue';
var VueResource = require('vue-resource');
Vue.use(VueResource);

// import VueClip from 'vue-clip';
// Vue.use(VueClip);

// import App from './App.vue'
import app from './components/app.vue';
import store from './store';
import router from './router';

import Vuetify from 'vuetify';
Vue.use(Vuetify);

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
  router,
  render: h => h(app)
});
