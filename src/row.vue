<template lang="jade">
	.row
		span  Column {{ columnIndex + 1 }}
		button(@click.prevent="$emit('remove')") X
		tr
			td
				label Is hierarchy
				input(type="checkbox" v-model="columnData.hierarchy")
			td
				label  Data type
				select(v-model="columnData.dataType")
					option(v-for="dataType in dataTypes", :value="dataType.value")  {{ dataType.text }}
			td(v-if="columnData.dataType == 'date'")
				label Minimum date
				input(v-model="columnData.maxValue" type="date")
			td(v-if="columnData.dataType == 'int' || columnData.dataType == 'decimal' ")
				label  Max number value:
				input(v-model="columnData.maxValue")
			td(v-if="columnData.dataType == 'text' ")
				label  Max string length:
				input(v-model="columnData.maxValue")
			td(v-if="columnData.dataType == 'text' || columnData.dataType == 'int' || columnData.dataType == 'decimal' ")
				label  Randomness:
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
