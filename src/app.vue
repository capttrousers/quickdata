<template lang="jade">
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
        // @click="$store.dispatch('action')"
        button(@click.prevent="addNewColumn") Add Column
        button(@click.prevent="getCSV") Get CSV File
      .form-row
        label  Rows of random data :
        input(:value="maxRowCount", @input="setRowCount")
      //.form-row
        //md-input-container
          //label  With label
          //md-input(placeholder="My nice placeholder") 
      table
        myRow( v-for="(column, index) in columns", :columnData="column", :columnIndex="index")
</template>

<script>
  import row from './row.vue';
  export default {
    name: 'app',
    components: {
      'myRow': row
    },
    computed: {
        maxRowCount: {
          get: function () {
            return this.$store.state.maxrows;
          }
          // , set: function (v){
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
  #form {
    margin: 0 auto;
    width: 50%;
  }
  .form-row, table {
    margin: 1em 0;
  }
  @media screen and (max-width: 1400px) {
    #form {
      width: 80%;
    }
  }
</style>
