<template lang="pug">
  #control

    md-progress(v-show="isTransferring", :md-indeterminate="true")

    #form
      #file-upload(v-show="true")
        .form-row
          md-layout(md-gutter="24")
            md-layout(md-flex="15")
              md-input-container
                label(for='file-upload')  Upload file
                md-select(name='file-upload', v-model="fileUpload")
                  md-option(value="schema") Schema.json
                  md-option(value="twb") Customer's workbook
            md-layout(md-flex="60")
              md-input-container
                label Schema file or twb workbook
                md-file(v-model="schemaFileName", accept=".json,.twb", :multiple="true", @selected="pickFile($event)")
            md-layout(md-flex="15")
              md-button.md-raised(:disabled="file == null", @click.native="submitFile") Submit
            md-layout(md-flex="10")
              md-button.md-raised.md-icon-button.md-dense( @click.native="helpRouter")
                md-icon help_outline
        .form-row
          md-layout(md-gutter="24")
            md-layout(md-flex)
            md-layout(md-flex)
              span(style="margin: 0 auto;") --- OR ---
            md-layout(md-flex)
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

      myRow( v-for="(column, index) in columns", :columnData="column", :columnIndex="index")

    md-snackbar(ref="errorsnackbar", :md-duration="7000")
      span {{ error.message }}
      md-button.md-accent(@click.native="$refs.errorsnackbar.close()") Close

</template>

<script>
  import row from './row.vue';
  import Vue from 'vue';
  var FileSaver = require('file-saver');
  var parseXML = require('xml2js').parseString;
  export default {
    components: {
      'myRow': row
    },
    data: function() {
      return {
        error: {
          message: 'default error message'
        }
        , options: {
            url: '/fileuploader',
            uploadMultiple: false
        }
        , fileUpload: "schema"
        , isTransferring: false
        , progressValue: 0
        , schemaFileName: ""
      }
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
        file: {
          get () {
            return this.$store.state.file;
          },
          set (value) {
            this.$store.dispatch('setFile', {value});
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
      pickFile: function( event ) {
        console.log("event object is typeof " + typeof event);
        console.log("event object length " + event.length);
        var f = event[0];
        if(f) {
          console.log('file size is ' + f.size);
          console.log('file name is ' + f.name);
          console.log('file picked');
          
          this.file = f;      
          this.fileUpload = f.name.indexOf(".json") > 0 ? "schema" : "twb";
        } else {
          this.file = null;      
          this.schemaFileName = "";
        }
      },
      helpRouter: function() {
        this.$router.push('help');
      },
      submitFile: function() {
        console.log('file size is ' + this.file.size);
        console.log('file name is ' + this.file.name);
        var reader = new FileReader();
        var that = this;
        this.isTransferring = true;
        reader.onload = function(evt) {
          if(that.fileUpload == "schema") {
            // parse JSON file and upload to /quickdata like normal body
            try {
              var body = JSON.parse(reader.result);
              Vue.http.post("/quickdata", body).then(
                (response) => {
                  var data = response.body;
                  var binaryData = [];
                  binaryData.push(data);
                  var fileName = body.tableName + ( that.dataSource == 'csv' ? '.csv' : '.txt' ) ;
                  FileSaver.saveAs(new Blob(binaryData, {type: "text/plain;charset=utf-8"}), fileName);
                  that.isTransferring = false;
                }, (response) => {
                  if(! (response && response.body) ) {
                    that.error.message = "server unresponsive"
                  } else {
                    that.error.message = (response.body.error) || '404 error';
                  }
                  that.isTransferring = false;
                  that.$refs.errorsnackbar.open();
                }
              );
            } catch (e) {
              console.log('parsing JSON failed');
              that.error.message = "Invalid JSON file: " + e;
              that.$refs.errorsnackbar.open();
              that.isTransferring = false;
            }          
          } else {
            // parse the TWB xml and 
            parseXML(reader.result, function(err, result){
              if(err) {
                console.log(err);
                that.isTransferring = false;
              } else {
                if(result.workbook["$"].version.split(".")[0] == "10") {
                  var body = {};
                  body.twb = result;
                  Vue.http.post("/fileuploader", body).then(
                    (response) => {
                      
                      var data = response.body;
                      var binaryData = [];
                      binaryData.push(data);
                      var fileName = that.schemaFileName.replace(/.twb/, "-TWB-schemas.zip") ;
                      FileSaver.saveAs(new Blob(binaryData, {type: "application/zip;charset=utf-8"}), fileName);
                      that.error.message = "TWB file parsed and uploaded successfully";
                      that.$refs.errorsnackbar.open();
                      that.isTransferring = false;
                    }, (response) => {
                      that.isTransferring = false;
                      that.error.message = (response.body.error) || '404 error';
                      that.$refs.errorsnackbar.open();
                    }
                  );
                
                } else {
                  that.isTransferring = false;
                  that.error.message = "TWB version must be made in Tableau Desktop 10.0 or greater";
                  that.$refs.errorsnackbar.open();
                  
                }
              }
            });
          
          }
        }
        reader.readAsText(this.file);
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
              that.isTransferring = false;
              this.error.message = (response.body.error) || '404 error';
              this.$refs.errorsnackbar.open();
            }
          );
        } else {
          this.error.message = this.$store.getters.isValidBody;
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
