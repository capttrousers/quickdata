<template lang="jade">
  .row(v-md-theme="'default'", :class="{child: columnData.hierarchy == 'child'}")
    span(v-if="columnData.hierarchy != 'child'")  Column {{ columnIndex + 1 }}
      md-button.md-icon-button.md-warn.md-dense(@click="removeColumn(columnIndex)", style="height: 1.5em; min-height: initial;")
        md-icon clear
    span(v-else) Child column of Column {{ columnIndex + 1 }}
      md-button.md-icon-button.md-warn.md-dense(@click="updateColumn(columnIndex, 'hierarchy', 'none')", style="height: 1.5em; min-height: initial;")
        md-icon clear
    tr
      td(v-if="columnData.hierarchy != 'child'")
        md-button-toggle.md-primary(v-md-theme="'row'")
          md-button( :class="{'md-toggle': columnData.hierarchy == 'parent'}",
            @click="updateColumn(columnIndex, 'hierarchy', columnData.hierarchy == 'none' ? 'parent' : 'none')") Parent
      td
        md-input-container
          label(for='data-type')  Data type
          span(v-if="columnData.hierarchy == 'child'", class='childDataType')  {{ columnData.dataType }}
          md-select(name='data-type', v-else, :value="columnData.dataType", @input="updateColumn(columnIndex, 'dataType', $event.target.value)")
            option(v-for="dataType in dataTypes", :value="dataType.value")  {{ dataType.text }}
      td
        md-input-container
          label(v-if="columnData.dataType == 'date'") Minimum date
          label(v-if="columnData.dataType == 'integer' || columnData.dataType == 'decimal' ")  Max value:
          label(v-if="columnData.dataType == 'text' ")  Max length:
          span(v-if="columnData.hierarchy == 'child'", class='childDataType')  {{ columnData.maxValue }}
          md-input(v-else, :value="columnData.maxValue", :type="(columnData.dataType == 'date' ? 'date' : 'text')",
          @input="updateColumn(columnIndex, 'maxValue', $event.target.value)")
      td(v-if="columnData.dataType == 'text' || columnData.dataType == 'integer' || columnData.dataType == 'decimal' ")
        md-input-container
          label  Interval:
          md-input(v-if="columnData.hierarchy == 'child'", :value="columnData.interval", @input="updateColumn(columnIndex, 'child-interval', $event.target.value)")
          md-input(v-else, :value="columnData.interval", @input="updateColumn(columnIndex, 'interval', $event.target.value)")
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
  					// date is at index 3 in default dataTypes array in store
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
