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
      span(v-if="columnData.hierarchy == 'child'", class='childDataType')  {{ columnData.dataType }}
      select(v-else, :value="columnData.dataType", @input="updateColumn(columnIndex, 'dataType', $event.target.value)")
        option(v-for="dataType in dataTypes", :value="dataType.value")  {{ dataType.text }}
    td
      label(v-if="columnData.dataType == 'date'") Minimum date
      label(v-if="columnData.dataType == 'integer' || columnData.dataType == 'decimal' ")  Max value:
      label(v-if="columnData.dataType == 'text' ")  Max length:
      span(v-if="columnData.hierarchy == 'child'", class='childDataType')  {{ columnData.maxValue }}
      input(v-else, :value="columnData.maxValue", :type="(columnData.dataType == 'date' ? 'date' : 'text')",
      @input="updateColumn(columnIndex, 'maxValue', $event.target.value)")
    td(v-if="columnData.dataType == 'text' || columnData.dataType == 'integer' || columnData.dataType == 'decimal' ")
      label  Interval:
      input(:value="columnData.interval", @input="updateColumn(columnIndex, 'interval', $event.target.value)")
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
				var dTypes = JSON.parse(JSON.stringify(this.$store.state.dataTypes));
				var hierarchy = false;
				if(this.columnData.hierarchy == 'parent') {
					// date is at index 1 in default dataTypes array in store
					dTypes.splice(3,1);
				}
				return dTypes;
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
