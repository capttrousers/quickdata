import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

export default new Vuex.Store({
	state: {
		columns: [],
		maxrows: "50",
		dataTypes: [
        {text: "Text", value: "text"},
        {text: "Integer", value: "integer"},
        {text: "Decimal", value: "decimal"},
        {text: "Date", value: "date"}
		],
		templateColumn: {
			"dataType": "text",
			"maxValue": "10",
			"interval": "1",
			// possible options: 'none', 'parent', 'child'
			"hierarchy": "none",
			"child": {}
		}
	},
	// // getters allow custom computed functions on the state
	// getters: {
	// 	maxRows : state => state.maxRows
	// 	// , other stuff
	// },
	mutations: {
		SET_MAX_ROWS(state, payload) {
			state.maxrows = payload.value;
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
			newValue = payload.value;
      if(propName == 'child-interval') {
        newValue = parseInt(newValue, 10) <= parseInt(state.columns[index].interval, 10) ? newValue : "";
        state.columns[index].child.interval = newValue;
      } else if(propName == "hierarchy") {
				// stringify then parse to get deep copy, probably a better way
				var newColumn = JSON.parse(JSON.stringify(state.templateColumn));
				state.columns[index].hierarchy = newValue;
				state.columns[index].child = (newValue == 'parent' ? newColumn : {});
        if(newValue == 'parent' && state.columns[index].dataType == 'date') {
          state.columns[index].dataType = 'text';
			    state.columns[index].maxValue = 10;
        }
				state.columns[index].child.hierarchy = 'child';
				state.columns[index].child.maxValue = state.columns[index].maxValue;
				state.columns[index].child.dataType = state.columns[index].dataType;
			} else {
        state.columns[index][propName] = newValue;
				if(state.columns[index].hierarchy == 'parent') {
					if( propName == 'maxValue' || propName == 'dataType') {
						state.columns[index].child[propName] = newValue;
					} else if (propName == 'interval') {
						 state.columns[index].child[propName] = Math.min(state.columns[index].child[propName] , newValue);
					}
				}
      }
		}
	},
	actions: {
		setMaxRows({commit}, payload) {
			commit('SET_MAX_ROWS', payload);
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
