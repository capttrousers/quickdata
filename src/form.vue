<template lang="jade">
  #form
    #info
      p.
        This tool will quickly generate random data
        based on the parameters selected below.
      p.
        Possible data types to select are Date, Text, Integers, and Decimals.
        You can also set the number of rows of random data to generate.
      p.
        Data types of Text, Integers, and Decimals allow maximum lengths / values respectively.
        They also allow a #[i randomness] property. A randomness value of 1 means there
        will be a new random value every record. A randomness value greater than 1
        means there will be a new random value every ___ lines, per calculation below:
      code floor(max-rows / randomness-value)
      p.
        So a randomness value of 5 with 50 rows of data means that the same random data value will be
        repeated for 10 rows / records / lines of data for that specific data field/column
    form(action="quickdata" method="post")
        br
        // @click="$store.dispatch('action')"
        button(@click.prevent="addNewColumn") Add Column
        button(@click.prevent="getCSV") Get CSV File
        br
        br
        label  Rows of random data :
        input(:value="maxRowCount"
              , @input="setRowCount"
              )
        br
        span number of max rows: {{ maxRowCount }}
        br
        table
          myRow( v-for="(column, index) in columns"
          @remove="columns.splice(index, 1)",
          :columnData="column",
          :columnIndex="index"
          )
</template>

<script>
  import row from './row.vue';
  export default {
    name: 'form',
    components: {
      'myRow': row
    },
    // data () {
    //   return {
    //     "dataTypes": [
    //       {text: "Text", value: "text"},
    //       {text: "Date", value: "date"},
    //       {text: "Integer", value: "int"},
    //       {text: "Decimal", value: "decimal"}
    //     ]
    //     // , columns: []
    //     // , maxRows: "50"
    //   }
    // },
    computed: {
        maxRowCount: {
          get: function () {
            console.log('get max rows called')
            return this.$store.state.maxrows;
          }
          // ,
          // // e for element? is this raw js?
          // set: function (v){
          //   console.log('set max rows called');
          //
          //   this.$store.commit('SET_MAX_ROWS', v);
          //   // this.$store.dispatch('setMaxRows', e.target.value);
          // }
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
        var body = {};
        body.columns = this.columns;
        body.maxRows = this.maxRowCount;
        this.$http.post('/quickdata', body).then(
          () => {
            window.location = '/quickData.csv';
          }, () => {
            // error
          }
        );
      },
      setRowCount: function (e) {
        this.$store.commit('SET_MAX_ROWS', e.target.value)
      }
    }
  }
</script>
<style>
#info {
  background-color: #fff6e0;
  padding: 1em;
}
#form > form {
  margin: 0 auto;
  width: 50%;
}
</style>
