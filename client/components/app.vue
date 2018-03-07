<template lang="pug">
  #app
    #info
      p.
        This tool will quickly generate random data based on the parameters selected below.
      p.
        Possible data types to select are Date, Text, Integers, and Decimals.
        You can also set the number of rows of random data to generate. Current limit of 100,000 records, or 1,000 for MS SQL
      p.
        You can also upload a csv file as one of the "columns", max 2 columns, max 50 rows, that can be used to populate fields with existing data.
      p.
        Data types of Text, Integers, and Decimals allow maximum lengths / values respectively.
        They also allow an #[i interval] property. An interval value of 1 means there
        will be a new random value every record, whereas an interval of 5 means there will be a new random value every 5 records.
      p.
        The Parent button allows text and date fields to contain a child column to act as a categorical hierarchy for text, or a start/end timestamp for date.
      p.
        Note, the mysql adhoc testing db is retired as of late, and is performing really slow. Stick with postgres and mssql unless mysql is necessary.
      p.
        #[a(href='https://mytableau.tableaucorp.com/display/cesupport/quickdata') Link to the quickdata wiki page with more info]
      p.
        If there are any issues uploading a TWB file, please visit the wiki page above on where to send feedback, and include the TWB you had issues uploading.

    v-tabs(v-model="currentItem", fixed-tabs, color="green")
      v-tabs-slider
      v-tab(key="form_input")
        v-icon.white--text assignment
      v-tab(key="file_upload")
        v-icon.white--text file_upload

    v-tabs-items(v-model="currentItem")
      v-tab-item(key="form_input")
        home
      v-tab-item(key="file_upload")
        help
</template>

<script>
  import Home from "./home.vue"
  import Help from "./help.vue"
  export default {
    name: 'app',
    components: {
      Home,
      Help
    },
    data() {
      return {
        currentItem: null
      }
    }
  }
</script>
<style>
  #info {
    background-color: #fff6e0;
    padding: 1em;
  }
</style>
