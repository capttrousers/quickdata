<template lang="jade">
	.row
		span  Column {{ columnIndex + 1 }}
		button(@click.prevent="removeColumn(columnIndex)") X
		tr
			td
				label Is hierarchy
				input(type="checkbox", value="isHierarchy", :checked="columnData.hierarchy",
					@change="updateColumn(columnIndex, 'hierarchy', (!columnData.hierarchy))")
			td
				label  Data type
				select(:value="columnData.dataType",
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
</template>

<script>
	export default {
		props: [
			"columnData",
			"columnIndex"
		],
		computed: {
			dataTypes: {
			  get() {
				var dTypes = JSON.parse(JSON.stringify(this.$store.state.dataTypes));
				var hierarchy = false;
				if(this.columnData.hierarchy) {
					// date is at index 1 in default dataTypes array in store
					dTypes.splice(1,1);
				} 
				return dTypes;
			  }
			}
		},
		methods: {
			updateColumn: function (index, propName, newValue) {
				// if(propName == "hierarchy") {
				// 	newValue = (this.$store.columns[index][propName] ? false : true );
				// }
				this.$store.dispatch('updateColumn', {index, propName, newValue});
			},
			removeColumn: function(index) {
				this.$store.dispatch('removeColumn', {index});
			}
		}
	}
</script>
