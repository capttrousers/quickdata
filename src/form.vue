<template lang="jade">
  div(id="form" )
    form(action="quickdata" method="post")
        br
        button(@click.prevent="addNewColumn") Add Column
        button(@click.prevent="getCSV") Get CSV File
        br
        br
        label  Rows of random data and stuff and
        input(v-model="maxRows")
        br
        br
        table
          myRow( v-for="(column, index) in columns"
          @remove="columns.splice(index, 1)",
          :dataTypes="dataTypes",
          :columnData="column",
          :columnIndex="index"
          )
</template>

<script>
import row from './row.vue'

export default {
  name: 'form',
  components: {
    'myRow': row
  },
  data () {
    return {
      "dataTypes": [
        {text: "Text", value: "text"},
        {text: "Date", value: "date"},
        {text: "Integer", value: "int"},
        {text: "Decimal", value: "decimal"}
      ],
      columns: [],
      maxRows: "50"
    }
  },
  methods: {
    addNewColumn: function () {
      if(this.columns.length <= 5) {
        var newColumn = {
          "columntype": "date",
          "maxvalue": "1000",
          "randomness": "1"
        }
        this.columns.push(newColumn)
      }
    },
    getCSV: function () {
      // ajax post columns, maxRows
      var body = {};
      body.columns = this.columns;
      body.maxRows = this.maxRows;
      this.$http.post('/quickdata', body).then(
        () => {
          window.location = './quickData.csv';
        }, () => {
          // error
        }
      );
    }
  }
}
</script>
