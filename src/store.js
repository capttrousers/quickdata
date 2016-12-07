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
      if(propName == 'child-interval') {
				console.log(newValue);
				console.log(state.columns[index].interval);
        newValue = parseInt(newValue, 10) <= parseInt(state.columns[index].interval, 10) ? newValue : "";
        state.columns[index].child.interval = newValue;
      } else {
        state.columns[index][propName] = newValue;
      }
			// update column props to handle corner cases
			if(propName == "hierarchy") {
				// stringify then parse to get deep copy, probably a better way
				var newColumn = JSON.parse(JSON.stringify(state.templateColumn));
				newColumn.hierarchy = 'child';
				state.columns[index].child = (newValue == 'parent' ? newColumn : {});
        if(newValue == 'parent' && state.columns[index].dataType == 'date') {
          state.columns[index].dataType = 'text';
			    state.columns[index].maxValue = 10;
        }
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
