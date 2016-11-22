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
			"dataType": "text",
			"maxValue": "10",
			"interval": "1",
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
			// get update info, and update column at index
			var index, propName, newValue;
			index = payload.index;
			propName = payload.propName;
			newValue = payload.newValue;
			state.columns[index][propName] = newValue;
			// update column props to handle corner cases
			if(propName == "hierarchy") {
				var newColumn = JSON.parse(JSON.stringify(state.templateColumn));
				newColumn.hierarchy = 'child';
				state.columns[index]["child"] = (newValue == 'parent' ? newColumn : {});
			} else if(propName == 'dataType') {
			  if(newValue == 'text') {
			    state.columns[index].maxValue = 10;
			  } else {
			    state.columns[index].maxValue = 1000;
			  }
		  }
			if(state.columns[index].hierarchy == 'parent') {
			  state.columns[index].child.dataType = state.columns[index].dataType;
				state.columns[index].child.maxValue = state.columns[index].maxValue;
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
