<template lang="pug">
  #control

    v-progress-linear.my-0(:active="isTransferring", color="blue" :indeterminate="true", height="3")

    #form
      v-container
          v-layout(row, wrap)
            v-flex.xs2
              v-btn.grey(:disabled="columns.length >= 12", @click.native="addNewColumn") Add Column
            v-flex.xs2
              v-btn.green(@click.native="getData", :disabled="false") {{ fileButtonLabel }}
            v-flex.xs2
              v-btn.green(@click.native="postLambda", :disabled="false") Lambda test

            v-flex.xs3
              v-select(:items="dataSourceOptions",
                       v-model="dataSource",
                       label="Data Source")

            v-flex.xs3
              v-text-field(name="number-of-records", v-model="numberOfRecords", label="Records of random data")
            v-flex.xs4
              v-text-field(name="case", v-model="sfCase", label="Sales Force Case (optional)")
            v-flex.xs4
              v-text-field(name="table-name", v-model="tableName", :label="tableNameLabel")
            v-flex.xs4
              v-text-field.green--text(name="user", v-model="user", label="User email @ tableau.com")

      my-row( v-for="(column, index) in columns", :columnData="column", :columnIndex="index")

    v-snackbar(v-model="snackbar", :timeout="7000", bottom)
      span {{ errorMessage }}
      v-btn(flat, color="pink", @click.native="snackbar = false") Close

</template>

<script>
  import MyRow from './row.vue';
  import Vue from 'vue';
  var FileSaver = require('file-saver');
  import axios from "axios";

  export default {
    components: {
      MyRow
    },
    data: function() {
      return {
        isTransferring: false,
        snackbar: false,
        url: "https://y3jnm5pidb.execute-api.us-west-2.amazonaws.com/quickdata"
      }
    },
    computed: {
        errorMessage: {
          get() {
            return this.$store.state.errorMessage
          },
          set(value) {
            this.$store.commit('SET_ERROR_MESSAGE', {value});
          }
        },
        fileButtonLabel: {
          get() {
            return this.dataSource == 'csv' ? 'GET CSV FILE' : 'GET TXT FILE';
          }
        },
        tableNameLabel: {
          get() {
            return (this.dataSource == 'csv' ? 'File' : 'Table') + ' Name (no spaces)';
          }
        },
        tableName: {
          get () {
            return this.$store.state.tableName;
          },
          set (value) {
            value = value.replace(' ', '_')
            this.$store.commit('SET_TABLE_NAME', {value});
          }
        },
        numberOfRecords: {
          get () {
            return this.$store.state.numberOfRecords;
          },
          set (value) {
            this.$store.commit('SET_NUMBER_OF_RECORDS', {value});
          }
        },
        sfCase: {
          get () {
            return this.$store.state.sfCase;
          },
          set (value) {
            this.$store.commit('SET_SFCASE', {value});
          }
        },
        user: {
          get () {
            return this.$store.state.user;
          },
          set (value) {
            this.$store.commit('SET_USER', {value});
          }
        },
        dataSourceOptions: {
          get () {
            return [
              {text: "CSV", value: "csv"},
              {text: "MySQL", value: "mysql"},
              {text: "MS SQL Server", value: "mssql"},
              {text: "PostgreSQL", value: "postgres"}
            ];
          }
        },
        dataSource: {
          get () {
            return this.$store.state.dataSource;
          },
          set (value) {
            this.$store.commit('SET_DATA_SOURCE', {value});
          }
        },
        columns: {
          get() {
            return this.$store.state.columns;
          }
        }
    },
    methods: {
      addNewColumn: function () {
        this.$store.commit('ADD_NEW_COLUMN')
      },
      postLambda: function () {
        let body = {"thing" : "stuff"};
	axios.post(this.url, body).then(res => {
	 console.log("Received response: " +JSON.stringify(res, null, 2)); 
	}).catch(err => {
	 console.log("ERROR: " + JSON.stringify(err, null, 2));
	});
      },
      getData: function () {
        if(this.$store.getters.isValidBody.length == 0) {
          // ajax post columns, numberOfRecords

          this.isTransferring = true;

          var that = this;

          // add user, sfcase, datasource
          var body = {};
          body.user = this.user;
          body.tableName = this.tableName;
          body.dataSource = this.dataSource;
          body.sfCase = this.sfCase;
          body.columns = this.columns;
          body.numberOfRecords = this.numberOfRecords;
          axios.post('/quickdata', body).then(
            (response) => {
              var data = response.data;
              var binaryData = [];
              binaryData.push(data);
              var fileName = (that.sfCase && that.sfCase.length > 0 ? that.sfCase + '_' : "" ) + this.tableName + ( this.dataSource == 'csv' ? '.csv' : '.txt' ) ;
              FileSaver.saveAs(new Blob(binaryData, {type: "text/plain;charset=utf-8"}), fileName);
              that.isTransferring = false;
            }, (error) => {
              let response = error.response
              if(! (response && response.body) ) {
                that.errorMessage = "server unresponsive"
              } else {
                that.errorMessage = (response.body.error) || '404 error';
              }
              that.isTransferring = false;
              that.snackbar = true;
            }
          );
        } else {
          this.errorMessage = this.$store.getters.isValidBody;
          this.snackbar = true;
        }
      }
    }
  }
</script>
<style>
  #form {
    margin: 0 auto;
    width: 75%;
  }
  @media screen and (max-width: 1400px) {
    #form {
      width: 90%;
    }
  }
</style>
