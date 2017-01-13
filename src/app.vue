<template lang="pug">
  #app
    #info
      p.
        This tool will quickly generate random data
        based on the parameters selected below.
      p.
        Possible data types to select are Date, Text, Integers, and Decimals.
        You can also set the number of rows of random data to generate.
      p.
        Data types of Text, Integers, and Decimals allow maximum lengths / values respectively.
        They also allow an #[i interval] property. An interval value of 1 means there
        will be a new random value every record, whereas an interval of 5 means there will be a new random value every 5 records.
      p.
        Dates allow a minimum date property, to create a range of possible dates between the min date and today.

    #form
      .form-row
        md-layout(md-gutter="40")
          md-layout
            md-button.md-raised(@click="addNewColumn") Add Column
          md-layout
            md-button.md-raised.md-primary(@click="getCSV") {{ fileButtonLabel }}
          md-layout
            md-input-container(style="display: inline-block; width: auto;")
                label(for='data-source')  Data Source
                md-select(name='data-source', v-model="dataSource")
                  md-option(v-for="dataSourceOption in dataSources", :value="dataSourceOption.value")  {{ dataSourceOption.label }}
          md-layout          
            md-input-container(style="display: inline-block; width: auto;")
                label(for="max-rows")  Rows of random data
                md-input(name='max-rows', v-model="maxRowCount")
      .form-row
        md-layout(md-gutter="40")
          md-layout(md-flex="33")
            md-input-container
              label(for="table-name")  {{ tableNameLabel }}
              md-input(name='table-name', v-model="tableName")
          md-layout(md-flex="33")
            md-input-container
              label(for="case")  Sales Force Case
              md-input(name='case', v-model="sfCase")
          md-layout(md-flex="33")
            md-input-container
                label(for="user")  User email @ tableau.com
                md-input(name='user', v-model="user")


      myRow( v-for="(column, index) in columns", :columnData="column", :columnIndex="index")
</template>

<script>
  import row from './row.vue';
  var FileSaver = require('file-saver');
  export default {
    name: 'app',
    components: {
      'myRow': row
    },
    computed: {
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
            this.$store.dispatch('setTableName', {value});
          }
        },
        maxRowCount: {
          get () {
            return this.$store.state.maxrows;
          },
          set (value) {
            this.$store.dispatch('setMaxRows', {value});
          }
        },
        sfCase: {
          get () {
            return this.$store.state.sfCase;
          },
          set (value) {
            this.$store.dispatch('setSFCase', {value});
          }
        },
        user: {
          get () {
            return this.$store.state.user;
          },
          set (value) {
            this.$store.dispatch('setUser', {value});
          }
        },
        dataSources: {
          get () {
            return this.$store.state.dataSources;
          }
        },
        dataSource: {
          get () {
            return this.$store.state.dataSource;
          },
          set (value) {
            this.$store.dispatch('setDataSource', {value});
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
      getCSV: function () {
        // ajax post columns, maxRows
        // add user, sfcase, datasource
        var body = {};
        body.user = this.user;
        body.tableName = this.tableName;
        body.dataSource = this.dataSource;
        body.sfCase = this.sfCase;
        body.columns = this.columns;
        body.maxRows = this.maxRowCount;
        
        this.$http.post('/quickdata', body).then(
          (response) => {
            var data = response.body;
            var binaryData = [];
            binaryData.push(data);
            var fileName = this.sfCase + '-' + this.tableName + ( this.dataSource == 'csv' ? '.csv' : '.txt' ) ;
            FileSaver.saveAs(new Blob(binaryData, {type: "text/plain;charset=utf-8"}), fileName);
            // window.location = '/quickData.csv';
          }, () => {
            // error
          }
        );
        
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
    width: 60%;
  }
  .form-row{
    margin: 1em 0;
  }
  .md-button {
    height:40px;
  }
  @media screen and (max-width: 1400px) {
    #form {
      width: 80%;
    }
  }
</style>
