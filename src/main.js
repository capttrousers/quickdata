import Vue from 'vue';
import Vuex from 'vuex';

var VueResource = require('vue-resource');
Vue.use(VueResource);
Vue.use(Vuex);

var store = new Vuex.Store({
	state: {
		columns: [],
		maxValue: 50,
		dataType: [
        {text: "Text", value: "text"},
        {text: "Date", value: "date"},
        {text: "Integer", value: "int"},
        {text: "Decimal", value: "decimal"}
		]
	},
	// getters allow custom computed functions on the state
	getters: {},
	// store.commit('mutation-name');
	mutations: {},
	// store.dispatch('action-name');
	actions: {}
});


// import App from './App.vue'
import form from './form.vue';

new Vue({
  el: '#form',
  render: h => h(form)
});
