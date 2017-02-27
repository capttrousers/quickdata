<template lang="pug">
  #app
    #info
      p.
        This tool will quickly generate random data
        based on the parameters selected below.
      p.
        Possible data types to select are Date, Text, Integers, and Decimals.
        You can also set the number of rows of random data to generate. Limit of 100,000
      p.
        Data types of Text, Integers, and Decimals allow maximum lengths / values respectively.
        They also allow an #[i interval] property. An interval value of 1 means there
        will be a new random value every record, whereas an interval of 5 means there will be a new random value every 5 records.
      p.
        Dates allow a minimum date property, to create a range of possible dates between the min date and today.
      p.
        The Parent button allows text and number fields to contain a child column to act as a hierarchy where random values are only repeated until the parent's random value resets.
      p.
        Current limit of 10,000 records, or 1,000 for MS SQL

    md-dialog(md-open-from="#getDataButton", md-close-to="#getDataButton", ref="alert")
      md-dialog-title Invalid form
      md-dialog-content
        md-list
          md-list-item(v-for="alert in this.alerts") {{ alert }}
      md-dialog-actions
        md-button(@click.native="closeDialog('alert')") OK

    #form
      .form-row
        md-layout(md-gutter="40")
          md-layout
            md-button.md-raised(@click.native="addNewColumn") Add Column
          md-layout
            md-button.md-raised.md-primary(@click.native="getData") {{ fileButtonLabel }}
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

      myRow( v-for="(column, index) in columns", :columnData="column", :columnIndex="index")

    md-snackbar(ref="errorsnackbar")
      span {{ error.message }}
      md-button.md-accent(@click.native="$refs.errorsnackbar.close()") Close
</template>

<script>
  import row from './row.vue';
  var FileSaver = require('file-saver');
  export default {
    name: 'app',
    components: {
      'myRow': row
    },
    data: function() {
      return {
        error: {
          message: 'default error message'
        }
      }
    },
    computed: {
        isValid: {
          get() {
            // check that columns are valid
            // check max rows, email, sfcase, table name
            /*
            if( this.maxRows < 1
              || this.maxRows > 1000
              || this.columns.length < 1
              || this.user.indexOf('@tableau.com') < 1 // not zero so user@tableau, charset
              || this.tableName.length > 0
              || parseInt(this.sfCase, 10) != NaN
            ) return false;
            */
            return true;
          }
        },
        alerts : {
          get() {
            return [];
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
      openDialog(ref) {
        this.$refs[ref].open();
      },
      closeDialog(ref) {
        this.$refs[ref].close();
      },
      addNewColumn: function () {
        this.$store.commit('ADD_NEW_COLUMN')
      },
      getData: function () {
        if(this.isValid) {  // ajax post columns, maxRows
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
            }, (response) => {
              this.error.message = (response.body.error) || '404 error';
              this.$refs.errorsnackbar.open();
            }
          );
        } else {
          // open alert and say why not valid
          // alert message
          /*
          var temp = [];
          console.log("len after clearing " + this.alerts.length);
          if( this.maxRows < 1) { this.alerts.push("Max Rows must be greater than 0"); }
          if(this.maxRows > 1000) { this.alerts.push("Max Rows must be less than 1000"); }
          if(this.columns.length < 1) { this.alerts.push("Must add at least one column of data to the dataset"); }
          // not zero so user@tableau, charset)
          if(this.user.indexOf('@tableau.com') < 1) { this.alerts.push("User must be valid tableau employee"); }
          if(this.tableName.length > 0) { this.alerts.push("Table name cannot be empty"); }
          if(parseInt(this.sfCase, 10) != NaN) { this.alerts.push("Salesforce case must be a number"); }
          console.log("len after pushing this.alerts " + this.alerts.length);
          this.alerts = temp;
	  */
          this.openDialog('alert');
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
