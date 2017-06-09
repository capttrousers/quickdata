import Vue from 'vue';
import Vuex from 'vuex';
import Papa from 'papaparse';

Vue.use(Vuex);

export default new Vuex.Store({
	state: {
    file: null,
		numberOfRecords: "",
    dataSource: "csv",
    user: "",
    sfCase: "",
    tableName: "",
		templateColumn: {
			"hierarchy": "none",// ['none', 'parent', 'child']
			"dataType": "text",
			"minValue": "1",
			"maxValue": "10",
      "behavior": "random",  // ['positive', 'negative', 'random'] for date/int/float, ["expand", "random"] for file
			"count": "1",
			"allowNulls": false,
			"file": null,
			"fileName": "", // file name is needed for v model on md-file input
			"child": {}
		},
		columns: []
	},

	// getters allow custom computed functions on the state
	// get column by index
	getters: {
		getColumnByIndex: (state, getters) => (index) => {
			return state.columns[index];
		},
    isValidBody: state => {
      if(state.user.length == 0) return "Must enter email";
      if(! state.user.includes("tableau.com") ) return "Must be a valid tableau email";
      if(state.numberOfRecords.length == 0) return "Must enter a value for the # of records to generate";
      if(isNaN(Number(state.numberOfRecords))) return "Number of records must be a valid integer";
      if(state.tableName.length == 0) return "Must enter a value for the table name";
      if(state.columns.length == 0) return "Must add at least one column";
      return "";
    }
	},

	mutations: {
		SET_TABLE_NAME(state, payload) {
			state.tableName = payload.value
		},
		SET_DATA_SOURCE(state, payload) {
			state.dataSource = payload.value;
		},
		SET_SFCASE(state, payload) {
			state.sfCase = payload.value;
		},
		SET_FILE(state, payload) {
			state.file = payload.value;
		},
		SET_USER(state, payload) {
			state.user = payload.value;
		},
		SET_NUMBER_OF_RECORDS(state, payload) {
			state.numberOfRecords = payload.value;
		},
		ADD_NEW_COLUMN(state) {
			// max of 12 columns for now, plus children
			if(state.columns.length < 12) {
				var newColumn = JSON.parse(JSON.stringify(state.templateColumn));
				state.columns.push(newColumn);
			}
		},
		REMOVE_COLUMN(state, payload){
			state.columns.splice(payload.index, 1);
		},
		UPDATE_COLUMN_DATATYPE(state, payload) {
			state.columns[payload.index].dataType = payload.value;
			if(state.columns[payload.index].hierarchy == "parent") {
				state.columns[payload.index].child.dataType = payload.value;
			}
		},
		UPDATE_COLUMN_MINVALUE(state, payload) {
			state.columns[payload.index].minValue = payload.value;
			if(state.columns[payload.index].hierarchy == "parent") {
				state.columns[payload.index].child.minValue = payload.value;
			}
    },
		UPDATE_COLUMN_MAXVALUE(state, payload) {
			state.columns[payload.index].maxValue = payload.value;
			if(state.columns[payload.index].hierarchy == "parent") {
				state.columns[payload.index].child.maxValue = payload.value;
			}
		},
		UPDATE_COLUMN_ALLOWNULLS(state, payload) {
			state.columns[payload.index].allowNulls = payload.value;
    },
		UPDATE_COLUMN_CHILD_ALLOWNULLS(state, payload) {
			state.columns[payload.index].child.allowNulls = payload.value;
    },
		UPDATE_COLUMN_COUNT(state, payload) {
			state.columns[payload.index].count = payload.value;
    },
		UPDATE_COLUMN_CHILD_COUNT(state, payload) {
			state.columns[payload.index].child.count = payload.value;
		},
		UPDATE_COLUMN_BEHAVIOR(state, payload) {
			state.columns[payload.index].behavior = payload.value;
			if(state.columns[payload.index].hierarchy == "parent") {
				state.columns[payload.index].child.behavior = payload.value;
			}
    },
		UPDATE_COLUMN_HIERARCHY(state, payload) {
			if(payload.value == "none") {
				state.columns[payload.index].child = {};
			} else { // == "parent"
				if(state.columns[payload.index].dataType == "date") {
					state.columns[payload.index].behavior = "random";
					state.columns[payload.index].count = "1";
				}
				var childColumn = JSON.parse(JSON.stringify(state.templateColumn));
				childColumn.hierarchy = "child";
				childColumn.dataType = state.columns[payload.index].dataType;
				childColumn.maxValue = state.columns[payload.index].maxValue;
				childColumn.minValue = state.columns[payload.index].minValue;
				state.columns[payload.index].child = childColumn;
			}
			state.columns[payload.index].hierarchy = payload.value;
    },
		UPDATE_COLUMN_FILE(state, payload) {
			state.columns[payload.index].file = payload.value;
    },
		UPDATE_COLUMN_FILENAME(state, payload) {
			state.columns[payload.index].fileName = payload.value;
    }
	},
	actions: {
		setFile({commit}, payload) {
			/*
				do async csv parse

			*/

			commit('SET_FILE', payload);
		},
		updateColumn({commit}, payload) {
				var index, propName, newValue;
				index = payload.index;
				propName = payload.propName;
				newValue = payload.value;

				// switch based on payload.propName
				switch(propName) {
					case "hierarchy":
						commit("UPDATE_COLUMN_HIERARCHY", { index, value: newValue});
						break;
					case "dataType":
					 	// commit data type
						commit("UPDATE_COLUMN_DATATYPE", {index, value: newValue});
						// set default values for min max depending on data type
						var minValue, maxValue;
						switch(newValue) {
							case "date":
								minValue = new Date(new Date().setFullYear(new Date().getFullYear() - 1)).toJSON().substring(0,10);
								maxValue = new Date().toJSON().substring(0,10);
								break;
							case "integer":
							case "decimal":
								minValue = "0";
								maxValue = "1000";
								break;
							case "text":
              case "file" :
								minValue = "1";
								maxValue = "10";
								break;
						}
						commit("UPDATE_COLUMN_MINVALUE", {index, value: minValue});
						commit("UPDATE_COLUMN_MAXVALUE", {index, value: maxValue});

						// reset the behavior and count for any new dataType
						commit("UPDATE_COLUMN_BEHAVIOR", {index, value: "random"});
						commit("UPDATE_COLUMN_COUNT", {index, value: "1"});
						break;
					case "minValue":
						commit("UPDATE_COLUMN_MINVALUE", {index, value: newValue});
						break;
					case "maxValue":
						commit("UPDATE_COLUMN_MAXVALUE", {index, value: newValue});
						break;
					case "behavior":
						commit("UPDATE_COLUMN_BEHAVIOR", {index, value: newValue});
						commit("UPDATE_COLUMN_COUNT", {index, value: "1"});
						break;
					case "allowNulls":
						commit("UPDATE_COLUMN_ALLOWNULLS", {index, value: newValue});
						break;
					case "child-count":
						commit("UPDATE_COLUMN_CHILD_COUNT", {index, value: newValue});
						break;
					case "child-nulls":
						commit("UPDATE_COLUMN_CHILD_ALLOWNULLS", {index, value: newValue});
						break;
					case "count":
						commit("UPDATE_COLUMN_COUNT", {index, value: newValue});
						break;
					case "fileName":
						commit("UPDATE_COLUMN_FILENAME", {index, value: newValue});
						break;
					case "file":
						var reader = new FileReader();
						reader.onload = function(evt) {
							var text = reader.result;
							Papa.parse(text, {
								header: true,
                skipEmptyLines: true,
								complete: function (results) {
									var data = {}
									data.fields = results.meta.fields;
									data.values = results.data;
									console.log(JSON.stringify(data, null, 1));
									commit("UPDATE_COLUMN_FILE", {index, value: data});
								}
							});
						}
						if(newValue != null ) {
							reader.readAsText(newValue);
						} else {
							commit("UPDATE_COLUMN_FILE", {index, value: null});
						}
						break;
				}
		}
	},
	strict: false
});
