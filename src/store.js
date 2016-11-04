import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

var store = new Vuex.Store({
	state: {
		columns: [],
		stuff: "store test",
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