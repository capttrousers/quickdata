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
      "trend": "positive",  // ['positive', 'negative', 'random']
      "increment": "1",
			// possible options: 'none', 'parent', 'child'
			"hierarchy": "none",
			"file": null,
			"fileName": "", // file name is needed for v model on file input
			"behavior": "expand",
			"allowNulls": false,
			"child": {}
		}
	},

	// // getters allow custom computed functions on the state
	// getters: {
	// 	numberOfRecords : state => state.numberOfRecords
	// 	// , other stuff
	// },

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
		UPDATE_COLUMN(state, payload) {
			// get update info, and update column at index
			var index, propName, newValue;
			index = payload.index;
			propName = payload.propName;
			newValue = payload.value;
			switch(propName){
				case 'child-interval' :
		        newValue = parseInt(newValue, 10) <= parseInt(state.columns[index].interval, 10) ? newValue : "";
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
							break;
						case 'date':
							var dateValue = new Date().setFullYear(new Date().getFullYear() - 1);
							state.columns[index].minValue = new Date(dateValue).toJSON().substring(0,10);
							state.columns[index].maxValue = new Date().toJSON().substring(0,10);
							state.columns[index].interval = "1";
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
		setTableName({commit}, payload) {
			commit('SET_TABLE_NAME', payload);
		},
		setDataSource({commit}, payload) {
			commit('SET_DATA_SOURCE', payload);
		},
		setFile({commit}, payload) {
			commit('SET_FILE', payload);
		},
		setUser({commit}, payload) {
			commit('SET_USER', payload);
		},
		setSFCase({commit}, payload) {
			commit('SET_SFCASE', payload);
		},
		setNumberOfRecords({commit}, payload) {
			commit('SET_NUMBER_OF_RECORDS', payload);
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
