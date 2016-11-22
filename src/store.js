import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

export default new Vuex.Store({
	state: {
		columns: [],
		maxrows: "50",
		dataTypes: [
        {text: "Text", value: "text"},
        {text: "Date", value: "date"},
        {text: "Integer", value: "int"},
        {text: "Decimal", value: "decimal"}
		],
		templateColumn: {
			"dataType": "date",
			"maxValue": "1000",
			"randomness": "1",
			// possible options: 'none', 'parent', 'child'
			"hierarchy": "none",
			// "parentIndex": null, 
			"child": {}
		}
	},
	// // getters allow custom computed functions on the state
	// getters: {
	// 	maxRows : state => state.maxRows
	// 	// , other stuff
	// },
	// store.commit('mutation-name');
	mutations: {
		SET_MAX_ROWS(state, value) {
			state.maxrows = value;
		},
		ADD_NEW_COLUMN(state) {
			if(state.columns.length <= 5) {
				var newColumn = JSON.parse(JSON.stringify(state.templateColumn));
				state.columns.push(newColumn);
			}
		},
		REMOVE_COLUMN(state, payload){
			state.columns.splice(payload.index, 1);
		},
		UPDATE_COLUMN(state, payload) {
			var index, propName, newValue;
			index = payload.index;
			propName = payload.propName;
			newValue = payload.newValue;
			state.columns[index][propName] = newValue;
			if(propName == "hierarchy") {
				var newColumn = JSON.parse(JSON.stringify(state.templateColumn));
				newColumn.hierarchy = 'child';
				state.columns[index]["child"] = (newValue == 'parent' ? newColumn : {});
			}
			if(state.columns[index].hierarchy == 'parent') {
				state.columns[index].child.dataType = state.columns[index].dataType;
			}
		}
	},
	// store.dispatch('action-name');
	actions: {
		setMaxRows({commit}, value) {
			commit('SET_MAX_ROWS', value);
		},
		updateColumn({commit}, payload) {
			commit('UPDATE_COLUMN', payload);
		},
		removeColumn({commit}, payload) {
			commit('REMOVE_COLUMN', payload);
		}
	},
	strict: false
});
