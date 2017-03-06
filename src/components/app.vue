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
      p.
        Note, the mysql adhoc testing db is retired as of late, and is performing really slow. Stick with postgres and mssql unless mysql is necessary.

    router-view
    
</template>

<script>
  export default {
    name: 'app'
  }
</script>
<style>
  #info {
    background-color: #fff6e0;
    padding: 1em;
  }
</style>
