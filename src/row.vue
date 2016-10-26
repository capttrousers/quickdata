<template lang="jade">
  .row
    span  Column {{ columnIndex + 1 }}
    button(@click.prevent="$emit('remove')") X
    tr
      td
        label  data type
        select(v-model="columnData.columntype")
            option(v-for="dataType in dataTypes", :value="dataType.value")  {{ dataType.text }}
      td(v-if="columnData.columntype == 'int' || columnData.columntype == 'decimal' ")
        label  max value:
        input(v-model="columnData.maxvalue")
      td(v-if="columnData.columntype == 'text' ")
        label  max length:
        input(v-model="columnData.maxvalue", :value="20")
      td(v-if="columnData.columntype == 'text' || columnData.columntype == 'int' || columnData.columntype == 'decimal' ")
        label  randomness:
        input(v-model="columnData.randomness")
    br
</template>

<script>
  export default {
      props: [
        "dataTypes",
        "columnData",
        "columnIndex"
      ]
  }
</script>
