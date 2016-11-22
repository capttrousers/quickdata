<template lang="jade">
.row(:class="columnData.hierarchy == 'child' ? columnData.hierarchy : ''")
  span(v-if="columnData.hierarchy != 'child'")  Column {{ columnIndex + 1 }}
    button(@click.prevent="removeColumn(columnIndex)")  X
  span(v-else) Child column of Column {{ columnIndex + 1 }}
    button(@click.prevent="updateColumn(columnIndex, 'hierarchy', 'none')")  X
  tr
    td(v-if="columnData.hierarchy != 'child'")
      label Is parent column
      input(type="checkbox", value="hierarchy", :checked="columnData.hierarchy == 'parent'",
      @change="updateColumn(columnIndex, 'hierarchy', (columnData.hierarchy == 'none' ? 'parent' : 'none'))")
    td
      label  Data type:
      span(v-if="columnData.hierarchy == 'child'" class='childDataType')  {{ columnData.dataType }}
      select(v-else, :value="columnData.dataType",
      @input="updateColumn(columnIndex, 'dataType', $event.target.value)")
        option(v-for="dataType in dataTypes", :value="dataType.value")  {{ dataType.text }}
    td(v-if="columnData.dataType == 'date'")
      label Minimum date
      input(:value="columnData.maxValue" type="date",
      @input="updateColumn(columnIndex, 'maxValue', $event.target.value)")
    td(v-if="columnData.dataType == 'int' || columnData.dataType == 'decimal' ")
      label  Max value:
      input(:value="columnData.maxValue",
      @input="updateColumn(columnIndex, 'maxValue', $event.target.value)")
    td(v-if="columnData.dataType == 'text' ")
      label  Max length:
      input(:value="columnData.maxValue",
      @input="updateColumn(columnIndex, 'maxValue', $event.target.value)")
    td(v-if="columnData.dataType == 'text' || columnData.dataType == 'int' || columnData.dataType == 'decimal' ")
      label  Randomness:
      input(:value="columnData.randomness",
      @input="updateColumn(columnIndex, 'randomness', $event.target.value)")
  br
  Row(v-if="columnData.hierarchy == 'parent'", :columnData="columnData.child", :columnIndex="columnIndex")
</template>

<script>
	export default {
		props: [
			"columnData",
			"columnIndex"
		],
    name: 'Row',
		computed: {
			dataTypes: {
			  get() {
				return this.$store.state.dataTypes;
			  }
			},
      parentDataType: {
        get() {
          if(columnData.hierarchy == 'child') {
            return this.$store.state.columns[columnIndex].dataType;
          }
        }
      }
		},
		methods: {
			updateColumn: function (index, propName, newValue) {
				this.$store.dispatch('updateColumn', {index, propName, newValue});
			},
			removeColumn: function(index) {
				this.$store.dispatch('removeColumn', {index});
			}
		}
	}
</script>
<style media="screen">
  .child {
    padding-left: 1em;
  }
  .childDataType {
    font-weight: bold;
  }
</style>
