<template lang="pug">
  #control

    md-progress(v-show="isTransferring", :md-indeterminate="true")

    #form
      .form-row
        md-layout(md-gutter="40")
          md-layout(md-flex)
            md-button.md-raised(:disabled="columns.length >= 12", @click.native="addNewColumn") Add Column
          md-layout(md-flex)
            md-button.md-raised.md-primary(@click.native="getData", :disabled="false") {{ fileButtonLabel }}
          md-layout(md-flex)
            md-input-container(style="display: inline-block; width: auto;")
              label(for='data-source')  Data Source
              md-select(name='data-source', v-model="dataSource")
                md-option(v-for="dataSourceOption in dataSources", :value="dataSourceOption.value")  {{ dataSourceOption.label }}
          md-layout(md-flex="20")
            md-input-container(style="display: inline-block;")
              label(for="number-of-records")  Records of random data
              md-input(name='number-of-records', v-model="numberOfRecords")
      .form-row
        md-layout(md-gutter="40")
          md-layout(md-flex="33")
            md-input-container
              label(for="case")  Sales Force Case (optional)
              md-input(name='case', v-model="sfCase")
          md-layout(md-flex="33")
            md-input-container
              label(for="table-name")  {{ tableNameLabel }}
              md-input(name='table-name', v-model="tableName")
          md-layout(md-flex="33")
            md-input-container
                label(for="user")  User email @ tableau.com
                md-input(name='user', v-model="user")

      my-row( v-for="(column, index) in columns", :columnData="column", :columnIndex="index")

    md-snackbar(ref="errorsnackbar", :md-duration="7000")
      span {{ errorMessage }}
      md-button.md-accent(@click.native="$refs.errorsnackbar.close()") Close

</template>

<script>
  import MyRow from './row.vue';
  import Vue from 'vue';
  var FileSaver = require('file-saver');
  var parseXML = require('xml2js').parseString;
  export default {
    components: {
      MyRow
    },
    data: function() {
      return {
        isTransferring: false
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
        dataSources: {
          get () {
            return [
              {label: "CSV", value: "csv"},
              {label: "MySQL", value: "mysql"},
              {label: "MS SQL Server", value: "mssql"},
              {label: "PostgreSQL", value: "postgres"}
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

          Vue.http.post('/quickdata', body).then(
            (response) => {
              var data = response.body;
              var binaryData = [];
              binaryData.push(data);
              var fileName = (that.sfCase && that.sfCase.length > 0 ? that.sfCase + '_' : "" ) + this.tableName + ( this.dataSource == 'csv' ? '.csv' : '.txt' ) ;
              FileSaver.saveAs(new Blob(binaryData, {type: "text/plain;charset=utf-8"}), fileName);
              that.isTransferring = false;
            }, (response) => {
              if(! (response && response.body) ) {
                that.errorMessage = "server unresponsive"
              } else {
                that.errorMessage = (response.body.error) || '404 error';
              }
              that.isTransferring = false;
              that.$refs.errorsnackbar.open();
            }
          );
        } else {
          this.errorMessage = this.$store.getters.isValidBody;
          this.$refs.errorsnackbar.open();
        }
      }
    }
  }
</script>
<style>
  #info {
    background-color: #fff6e0;
    padding: 1em;
  }
  #form {
    margin: 0 auto;
    width: 75%;
  }
  .form-row{
    margin: 1em 0;
  }
  .md-button {
    height:40px;
  }
  @media screen and (max-width: 1400px) {
    #form {
      width: 90%;
    }
  }
</style>
