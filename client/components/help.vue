<template lang="pug">
  #help(style="text-align: center;")
    md-progress.md-accent(v-show="isTransferring", :md-indeterminate="true")
    br
    br

    md-layout(md-gutter="24")
      md-layout(md-flex="25")
      md-layout(md-flex="50")
        md-input-container
          label Schema file or twb workbook
          md-file(v-model="fileName", accept=".json,.twb", :multiple="false", @selected="pickFile($event)")
      md-layout(md-flex="25")
        md-button.md-raised(:disabled="file == null", @click.native="submitFile") Submit

    md-tabs#demo(md-fixed)
      md-tab(md-label="TWB File")
        p When uploading a TWB file, the data sources will be parsed and the data table meta data will be used to construct schema.json files for each connection in the workbook. These schema.json files will be zipped into a single file for download and then these schema files can be opened, inspected, modified, and then uploaded one at a time to get random data sets for each data connection. With the new data set, connect in Tableau Desktop and do the normal Replace Data Source process (copy over sets, calc fields, etc and then swap the two data sources)
      md-tab(md-label="SCHEMA.JSON File")
        p The schema.json file is the JSON representation of the quickdata request.
        p There are 5 required properties: "numberOfRecords", "dataSource", "user", "tableName", and "columns". "sfCase" is optional.
        p The "columns" property is an array of column objects. Each column object needs all the props but some are not used in various cases. Most of the properties are self explanatory, but the hierarchy, behavior, and count properties are explained more here:
        p The "count" property is an number that will depend on the behavior of the column. For Text columns, the Count will actually be the interval, for number of records for each random value, so an interval of 5 means 5 records with the same random value, and then a new random value for the next 5 records. For Date/Integer/Decimal columns, the "count" will depend on whether the behavior is 'random' or trending. If trending, the "count" will be the increment of the trend whereas for random behavior, the "count" will be the interval, just like above with Text columns. For File list columns, the "count" will be the interval, same as above.
        p The "behavior" property determines how the random data values are generated. For Dates / Integers / Decimals, the possible behaviors are 'random', 'positive', or 'negative'. Text columns will always be 'random', and File lists can either be 'random' or 'expand'. Values of 'positive' or 'negative' are trending patterns from one data value to the next. A value of 'random' will have no pattern in the data values from one to the next, and the "count" property will determine how many records of data will use each random value. A value of 'expand' for File lists will mean for each value in the list, it will produce the "count" number of records with that value, and any other columns of random data.
        p The "hierarchy" property determines if the column is a parent/child hierarchy or not. All columns will have the 'child' property which will contain the child column object if the column is a 'parent' and the child column object's hierarchy would be set to 'child'. A value of 'none' means the child column object is empty and there is no hierarchy. The min/max values of the parent/child columns as well as their dataTypes will be the same but the "count" values can be different.
        p Dates will need their min/max values to be in the proper date format "YYYY-MM-DD"
        p Note: All string values need to be wrapped in quotes.
        md-button.md-raised(@click.native="downloadJSONSample") Download schema.json
        md-layout.code(md-gutter="24")
          p {{ json }}
      //-
        md-tab(md-label="JSON Unparsed")
          md-layout.code(md-gutter="24")
            p {{ jsonUnparsed }}
      md-tab(md-label="CSV File")
        p Submitting a CSV file with a list of data values to use to populate a single column with existing values.
        p The CSV file can be one or two columns, and up to 50 rows of existing data values.
        p If the CSV file has two columns, quickdata will assume the two columns have some sort of hierarchical relationship and will attempt to find the parent/child relationship and then randomly select from the child column which will pull in the parent's value automatically for the parent's column.
        md-layout.code(md-gutter="24")
          md-layout.md-flex(md-align="center")
            p {{ csv }}
          md-layout.md-flex(md-align="center")
            p {{ states }}
      //-
        md-tab(md-label="CSV Parsed to json")
          md-layout.code(md-gutter="24")
            p {{ csvParsed }}
      //-
        md-tab(md-label="CSV Table")
          md-layout.code(md-gutter="24")
            <!-- p {{ csvParsedRaw }} -->
            table
              tr
                th(v-for="field in csvParsedRaw.meta.fields") {{ field }}
              tr(v-for="row in csvParsedRaw.data")
                td(v-for="field in csvParsedRaw.meta.fields") {{ row[field] }}

</template>


<script>
import _ from 'lodash';
import States from '../textFiles/states';
import csvFile from '../textFiles/csv';
import jsonFile from '../textFiles/json';
import schemaTextFile from '../textFiles/schema.json.text';
import schemaJSONFile from '../textFiles/schema.json.template';
var FileSaver = require('file-saver');

export default {
  data: function() {
    return {
      fileName: '',
      isTransferring: false
    }
  },
  computed: {
    file: {
      get () {
        return this.$store.state.file;
      },
      set (value) {
        this.$store.dispatch('setFile', {value});
      }
    },
    errorMessage: {
      get() {
        return this.$store.state.errorMessage
      },
      set(value) {
        this.$store.commit('SET_ERROR_MESSAGE', {value});
      }
    },
    states: {
      get() {
        return States.text;
      }
    },
    csv: {
      get() {
        //return csvFile.csv;
        var csv = "      Two Column CSV\n\n";
        csv += "  Parent,      Child\n"
        for(var i = 1; i <= 50; i++) {
          var val = Math.ceil(i / 3);
          csv += "Category " + (val < 10 ? " " : "") + val;
          csv += ", Sub-category " + i;
          csv += "\n"
        }
        return csv;
      }
    },
    csvParsedRaw: {
      get() {
        var csvToJSON = Papa.parse(csvFile.csv, {header: true});
        return csvToJSON;
      }
    },
    csvParsed: {
      get() {
        var csvToJSON = Papa.parse(csvFile.csv, {header: true});
        csvToJSON = JSON.stringify(csvToJSON, null, '  ');
        return csvToJSON;
      }
    },
    json: {
      get() {
        return schemaTextFile.text
      }
    },
    jsonUnparsed: {
      get() {
        return Papa.unparse(jsonFile.json, {newline: '\n'});
      }
    }
  },
  methods: {
    pickFile: function( event ) {
      console.log("event object is typeof " + typeof event);
      console.log("event object length " + event.length);
      var f = event[0];
      if(f) {
        console.log('file size is ' + f.size);
        console.log('file name is ' + f.name);
        console.log('file picked');

        this.file = f;
      } else {
        this.file = null;
        this.fileName = "";
      }
    },
    submitFile: function() {
      console.log('file size is ' + this.file.size);
      console.log('file name is ' + this.file.name);
      var reader = new FileReader();
      var that = this;
      this.isTransferring = true;
      reader.onload = function(evt) {
        if(that.fileName.indexOf(".json") >= 0) {
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
                  that.errorMessage = "server unresponsive"
                } else {
                  that.errorMessage = (response.body.error) || '404 error';
                }
                that.isTransferring = false;
                that.$refs.errorsnackbar.open();
              }
            );
          } catch (e) {
            console.log('parsing JSON failed');
            that.errorMessage = "Invalid JSON file: " + e;
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
                    var fileName = that.fileName.replace(/.twb/, "-TWB-schemas.zip") ;
                    FileSaver.saveAs(new Blob(binaryData, {type: "application/zip;charset=utf-8"}), fileName);
                    that.errorMessage = "TWB file parsed and uploaded successfully";
                    that.$refs.errorsnackbar.open();
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
                that.isTransferring = false;
                that.errorMessage = "TWB version must be made in Tableau Desktop 10.0 or greater";
                that.$refs.errorsnackbar.open();

              }
            }
          });

        }
      }
      reader.readAsText(this.file);
    },
    downloadJSONSample() {
      var binaryData = [];
      binaryData.push(JSON.stringify(schemaJSONFile, null, 1));
      FileSaver.saveAs(new Blob(binaryData, {type: "text/plain;charset=utf-8"}), "schema-template.json");
    }
  }
}
</script>

<style >
  #help {
    margin: 0 auto;
    width: 60%;
  }
  table {
    border-collapse: collapse;
  }
  td,th {
    border: 1px solid #999;
    padding: 0 0.5rem;
  }
  .code p {
    font-family: Courier;
    background-color: #e6e6e6;
    white-space: pre;
    width: 100%;
  }
  #demo p {
    text-align: left !important;
  }
  @media screen and (max-width: 1400px) {
    #form {
      width: 80%;
    }
  }
</style>
