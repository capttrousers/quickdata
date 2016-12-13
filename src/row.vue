<template lang="jade">
  .row(v-md-theme="'default'", :class="{child: hierarchy == 'child'}")
    span(v-if="hierarchy != 'child'")  Column {{ columnIndex + 1 }}
      md-button.md-icon-button.md-warn.md-dense(@click="removeColumn(columnIndex)", style="height: 1.5em; min-height: initial;")
        md-icon clear
    span(v-else) Child column of Column {{ columnIndex + 1 }}
      md-button.md-icon-button.md-warn.md-dense(@click="updateColumn(columnIndex, 'hierarchy', 'none')", style="height: 1.5em; min-height: initial;")
        md-icon clear
    tr
      td(v-if="hierarchy != 'child'")
        md-button-toggle.md-primary(v-md-theme="'row'")
          md-button( :class="{'md-toggle': hierarchy == 'parent'}",
            @click="toggleHierarchy") Parent
      td
        span(v-if="hierarchy == 'child'", class='childDataType')  {{ "Data type is " + dataType }}
        md-input-container(v-else)
          label(for='data-type')  Data type
          md-select(name='data-type', v-model="dataType")
            md-option(v-for="dataTypeOption in dataTypes", :value="dataTypeOption.value")  {{ dataTypeOption.text }}
      td
        span(v-if="hierarchy == 'child'", class='childDataType')  {{ MaxValueLabel + ' is ' + maxValue }}
        md-input-container(v-else)
          label {{ MaxValueLabel }}
          md-input(v-model="maxValue", :type="(dataType == 'date' ? 'date' : 'text')")
      td(v-if="dataType == 'text' || dataType == 'integer' || dataType == 'decimal' ")
        md-input-container
          label  Interval:
          md-input(v-model="interval")
    br
    Row(v-if="hierarchy == 'parent'", :columnData="columnData.child", :columnIndex="columnIndex")
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
  				if(this.hierarchy == 'parent') {
  					// date is at index 3 in default dataTypes array in store
  					dTypes.splice(3,1);
  				}
  				return dTypes;
			  }
			},
      hierarchy: {
        get() {
          return this.columnData.hierarchy;
        }
      },
      maxValue: {
        get() {
          return this.columnData.maxValue;
        },
        set(value) {
          var propName = 'maxValue';
          var index = this.columnIndex;
          this.$store.dispatch('updateColumn', {index, propName, value});
        }
      },
      interval: {
        get() {
          return this.columnData.interval;
        },
        set(value) {
          var propName = this.hierarchy == 'child' ? 'child-interval' : 'interval';
          var index = this.columnIndex;
          this.$store.dispatch('updateColumn', {index, propName, value});
        }
      },
      dataType: {
        get() {
          return this.columnData.dataType;
        },
        set(value) {
          var propName = 'dataType';
          var index = this.columnIndex;
          this.$store.dispatch('updateColumn', {index, propName, value});
        }
      },
      MaxValueLabel: {
        get() {
          var label = "";
          switch (this.dataType) {
            case 'date':
              label = "Minimum date";
              break;
            case 'text':
              label = "Max length:";
              break;
            default:
              label = "Max value:";
              break;
          }
          return label;
        }
      }
		},
		methods: {
			updateColumn: function (index, propName, newValue) {
				this.$store.dispatch('updateColumn', {index, propName, newValue});
			},
      toggleHierarchy: function (){
        var value = this.hierarchy == 'none' ? 'parent' : 'none';
        var index = this.columnIndex;
        var propName = 'hierarchy';
				this.$store.dispatch('updateColumn', {index, propName, value});
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
