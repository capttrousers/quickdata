import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

export default new Vuex.Store({
	state: {
    file: null,
		columns: [],
		numberOfRecords: "500",
    dataSource: "csv",
    user: "somebody@tableau.com",
    sfCase: "01234",
    tableName: "TableName",
    dataSources: [
      {label: "CSV", value: "csv"},
      {label: "MySQL", value: "mysql"},
      {label: "MS SQL Server", value: "mssql"},
      {label: "PostgreSQL", value: "postgres"}
    ],
		dataTypesParents: [
        {text: "Text", value: "text"},
        {text: "Date", value: "date"}
		],
		dataTypes: [
        {text: "Text", value: "text"},
        {text: "Integer", value: "integer"},
        {text: "Decimal", value: "decimal"},
        {text: "Date", value: "date"},
        {text: "File", value: "file"}
		],
		templateColumn: {
			"dataType": "text",
			"minValue": "1",
			"maxValue": "10",
			"interval": "1",
      "trend": "random",  // ['positive', 'negative', 'random']
      "increment": "1",
			"hierarchy": "none",// ['none', 'parent', 'child']
			"file": null,
			"fileName": "", // file name is needed for v model on file input
			"behavior": "expand", // ["expand", "random"]
			"allowNulls": false,
			"child": {}
		}
	},

	// getters allow custom computed functions on the state
	// get column by index
	getters: {
		getColumnByIndex: (state, getters) => (index) => {
			return state.columns[index];
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
			if(state.columns.length <= 5) {
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
		UPDATE_COLUMN_INTERVAL(state, payload) {
			state.columns[payload.index].interval = payload.value;
			if(state.columns[payload.index].hierarchy == "parent") {
				state.columns[payload.index].child.interval = Math.min(state.columns[payload.index].child.interval, payload.value) + "";
			}
    },
		UPDATE_COLUMN_CHILD_INTERVAL(state, payload) {
			state.columns[payload.index].child.interval = Math.min(state.columns[payload.index].interval, payload.value) + "";
		},
		UPDATE_COLUMN_INCREMENT(state, payload) {
			state.columns[payload.index].increment = payload.value;
			if(state.columns[payload.index].hierarchy == "parent") {
				state.columns[payload.index].child.increment = payload.value;
			}
    },
		UPDATE_COLUMN_TREND(state, payload) {
			state.columns[payload.index].trend = payload.value;
			if(state.columns[payload.index].hierarchy == "parent") {
				state.columns[payload.index].child.trend = payload.value;
			}
    },
		UPDATE_COLUMN_BEHAVIOR(state, payload) {
			state.columns[payload.index].behavior = payload.value;
    },
		UPDATE_COLUMN_HIERARCHY(state, payload) {
			if(payload.value == "none") {
				state.columns[payload.index].child = {};
			} else { // == "parent"
				var childColumn = JSON.parse(JSON.stringify(state.templateColumn));
				childColumn.hierarchy = "child";
				childColumn.dataType = state.columns[payload.index].dataType;
				childColumn.maxValue = state.columns[payload.index].maxValue;
				childColumn.minValue = state.columns[payload.index].minValue;
				childColumn.trend = state.columns[payload.index].trend;
				childColumn.increment = state.columns[payload.index].increment;
				state.columns[payload.index].child = childColumn;
			}
			state.columns[payload.index].hierarchy = payload.value;
    }









		, UPDATE_COLUMN(state, payload) {
			// get update info, and update column at index
			var index, propName, newValue;
			index = payload.index;
			propName = payload.propName;
			newValue = payload.value;
			switch(propName) {
				case 'child-interval' :
		        newValue = parseInt(newValue, 10) <= parseInt(state.columns[index].interval, 10) ? newValue : state.columns[index].interval;
		        state.columns[index].child.interval = newValue + "";
						break;
				case "child-nulls" :
		        state.columns[index].child.allowNulls = newValue;
						break;
				case "hierarchy" :
						if(newValue == 'parent') {
							// stringify then parse to get deep copy, probably a better way
							var newColumn = JSON.parse(JSON.stringify(state.templateColumn));
							newColumn.hierarchy = 'child';
							newColumn.maxValue = state.columns[index].maxValue;
							newColumn.minValue = state.columns[index].minValue;
							newColumn.dataType = state.columns[index].dataType;
							state.columns[index].child = newColumn;
							state.columns[index].hierarchy = newValue;
						} else {
							state.columns[index].hierarchy = newValue;
							state.columns[index].child = {};
						}
						break;
				case "dataType" :
					state.columns[index].dataType = newValue;
					// dispatch update column for max/min value based on value
					switch (newValue) {
						case 'text':
							state.columns[index].maxValue = "10";
							state.columns[index].minValue = "1";
							state.columns[index].trend = "random";
							break;
						case 'date':
							var dateValue = new Date().setFullYear(new Date().getFullYear() - 1);
							state.columns[index].minValue = new Date(dateValue).toJSON().substring(0,10);
							state.columns[index].maxValue = new Date().toJSON().substring(0,10);
							state.columns[index].interval = "1";
							state.columns[index].trend = "random";
							break;
						case 'decimal':
						case 'integer':
							state.columns[index].maxValue = "1000";
							state.columns[index].minValue = "0";
							break;
					}
					if(state.columns[index].hierarchy == 'parent') {
						state.columns[index].child.dataType = state.columns[index].dataType;
					}
					break;
				default:
	        state.columns[index][propName] = newValue;
					if(state.columns[index].hierarchy == 'parent') {
						if( propName == 'maxValue' || propName == 'minValue' || propName == 'dataType') {
							state.columns[index].child[propName] = newValue;
						} else if (propName == 'interval') {
							 state.columns[index].child[propName] = Math.min(state.columns[index].child[propName] , newValue);
						}
					}
	      	break;
			}
		}














	},

	actions: {
		setFile({commit}, payload) {
			commit('SET_FILE', payload);
		},
		updateColumn({commit}, payload) {
			/*
				handle and process any update column call to invoke appropriate commits

				*/

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
								minValue = "1";
								maxValue = "10";
								break;
						}
						commit("UPDATE_COLUMN_MINVALUE", {index, value: minValue});
						commit("UPDATE_COLUMN_MAXVALUE", {index, value: maxValue});

						// if date, decimal, or integer reset set trend and incremen
						if(["date","decimal","integer"].indexOf(newValue) >= 0 ){
							commit("UPDATE_COLUMN_TREND", {index, value: "random"});
							commit("UPDATE_COLUMN_INCREMENT", {index, value: "1"});
						}
						// if file reset behavior
						if(newValue == "file") {
							commit("UPDATE_COLUMN_BEHAVIOR", {index, value: "expand"});
							commit("UPDATE_COLUMN_INTERVAL", {index, value: "1"});
						}

						// if parent, cascade min, max, datatype, trend, increment in the mutations

						break;
					case "minValue":
						commit("UPDATE_COLUMN_MINVALUE", {index, value: newValue});
						break;
					case "maxValue":
						commit("UPDATE_COLUMN_MAXVALUE", {index, value: newValue});
						break;
					case "trend":
						commit("UPDATE_COLUMN_TREND", {index, value: newValue});
						break;
					case "increment":
						commit("UPDATE_COLUMN_INCREMENT", {index, value: newValue});
						break;
					case "behavior":
						commit("UPDATE_COLUMN_BEHAVIOR", {index, value: newValue});
						commit("UPDATE_COLUMN_INTERVAL", {index, value: "1"});
						break;
					case "interval":
						commit("UPDATE_COLUMN_INTERVAL", {index, value: newValue});
						break;
					case "allowNulls":
						commit("UPDATE_COLUMN_ALLOWNULLS", {index, value: newValue});
						break;
					case "child-interval":
						commit("UPDATE_COLUMN_CHILD_INTERVAL", {index, value: newValue});
						break;
					case "child-nulls":
						commit("UPDATE_COLUMN_CHILD_ALLOWNULLS", {index, value: newValue});
						break;
					default :
						break;
				}

			// commit('UPDATE_COLUMN', payload);
		}
	},
	strict: false
});
