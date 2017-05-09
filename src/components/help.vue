<template lang="pug">
  #help(style="text-align: center;")
    md-layout(md-gutter="24")
      md-button.md-raised.md-icon-button( @click.native="homeRouter")
        md-icon arrow_back
    br(v-for="i in 3")
    span this will be the help section for the file upload feature

    md-layout(md-gutter="24")
      md-layout(md-flex)
        md-input-container
          label Schema file
          md-file(v-model="fileName", accept="*", :multiple="false", @selected="pickFile($event)")
      md-layout
        md-button.md-raised(:disabled="file == null", @click.native="submitFile") Submit
    md-tabs#demo(md-fixed)
      md-tab(md-label="Text File")
        md-layout.code(md-gutter="24")
          p {{ text }}
      md-tab(md-label="JSON File")
        md-layout.code(md-gutter="24")
          p {{ json }}
      md-tab(md-label="JSON Unparsed")
        md-layout.code(md-gutter="24")
          p {{ jsonUnparsed }}
      md-tab(md-label="CSV File")
        span You must have headers
        md-layout.code(md-gutter="24")
          p {{ csv }}
      md-tab(md-label="CSV Parsed to json")
        md-layout.code(md-gutter="24")
          p {{ csvParsed }}
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
import textFile from '../textFiles/text';
import csvFile from '../textFiles/csv';
import jsonFile from '../textFiles/json';
import Papa from 'papaparse';
export default {
  data: function() {
    return {
      fileName: '',
      file: null
    }
  },
  computed: {
    text: {
      get() {
        return textFile.text;
      }
    },
    csv: {
      get() {
        return csvFile.csv;
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
        return JSON.stringify(jsonFile.json, null, '  ');
      }
    },
    jsonUnparsed: {
      get() {
        return Papa.unparse(jsonFile.json, {newline: '\n'});
      }
    }
  },
  methods: {
    submitFile: function() {
      var reader = new FileReader();
      reader.onload = function(evt) {
        var text = reader.result;
        Papa.parse(text, {
          header: true,
          complete: function (results) {
            var data = {}
            data.fields = results.meta.fields;
            data.values = results.data;
            console.log(JSON.stringify(data, null, 1));
          }
        });
      }
      reader.readAsText(this.file);
    },
    pickFile: function(evt) {
      this.file = evt[0];
      if(this.file)
        console.log(this.file.type);
    },
    homeRouter: function() {
      this.$router.push('/');
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
  .code {
    background-color: #e6e6e6;
  }
  #demo p {
    font-family: Courier;
    white-space: pre;
    text-align: left !important;
  }
  @media screen and (max-width: 1400px) {
    #form {
      width: 80%;
    }
  }
</style>
