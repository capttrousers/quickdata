<template lang="pug">
  .row(:class="{child: hierarchy == 'child'}")
    span.parentLabel(v-if="hierarchy != 'child'")  {{ "Column " + (columnIndex + 1) }}
      md-button.md-icon-button.md-warn.md-dense(@click.native="removeColumn(columnIndex)", style="height: 1.5em; min-height: initial;")
          md-icon clear
    span.childLabel(v-else) Child column of Column {{ columnIndex + 1 }}
    md-layout(md-gutter="16")
      md-layout(v-show="hierarchy != 'child'", md-flex="10", md-theme="'row'")
        md-button-toggle.md-primary
          md-button(@click.native="toggleHierarchy", :disabled="dataType == 'date' || dataType == 'file'") Parent
      md-layout(md-flex="15")
        md-input-container
          label(for='data-type') Data type
          md-select(name='data-type', v-model="dataType", :disabled="hierarchy == 'child'")
            md-option(v-for="dataTypeOption in dataTypes", :value="dataTypeOption.value")  {{ dataTypeOption.text }}
      md-layout(md-flex="30", v-show="dataType == 'file'")
        md-input-container
          label Data list file
          md-file(v-model="fileName", accept="text/*", :multiple="false", @selected="addFile($event)")
      md-layout(md-flex="15", v-show="dataType == 'file'")
        md-input-container
          label Behavior
          md-select(v-model="behavior")
            md-option(value="expand") Expand list
            md-option(value="random") Random
      md-layout(:md-flex="dataType == 'date' ? 15 : 10", v-show="dataType != 'file'")
        md-input-container
          label {{ MinValueLabel }}
          md-input(v-model="minValue", :type="(dataType == 'date' ? 'date' : 'text')", :disabled="hierarchy == 'child'")
      md-layout(:md-flex="dataType == 'date' ? 15 : 10", v-show="dataType != 'file'")
        md-input-container
          label {{ MaxValueLabel }}
          md-input(v-model="maxValue", :type="(dataType == 'date' ? 'date' : 'text')", :disabled="hierarchy == 'child'")
      md-layout(md-flex="10", v-show="(dataType != 'date' && dataType != 'file') || (dataType == 'file' && behavior == 'expand')")
        md-input-container
          label  Interval:
          md-input(v-model="interval")
      md-layout(md-flex="10", v-show="dataType != 'file' && hierarchy == 'none'")
        md-input-container
          label Trend
          md-select(v-model="trend")
            md-option(value="positive") Positive
            md-option(value="negative") Negative
            md-option(value="random") Random
      md-layout(md-flex="10", v-show="dataType != 'file' && hierarchy == 'none' && trend != 'random'")
        md-input-container
          label  Trend {{ trend == 'positive' ? 'increment' : 'decrement' }}
          md-input(v-model="increment")
      md-layout(md-flex="10", v-show="dataType != 'file'")
        md-checkbox(v-model="allowNulls") Allow nulls?
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
  				if(this.hierarchy == 'parent') {
  					// date is at index 3 in default dataTypes array in store
  					dTypes.splice(3,2);
  				}
  				return dTypes;
			  }
			},
      hierarchy: {
        get() {
          return this.columnData.hierarchy;
        }
      },
      allowNulls: {
        get() {
          return this.columnData.allowNulls;
        },
        set(value) {
          var propName = this.hierarchy == 'child' ? 'child-nulls' : 'allowNulls';
          var index = this.columnIndex;
          this.$store.dispatch('updateColumn', {index, propName, value});
        }
      },
      trend: {
        get() {
          return this.columnData.trend;
        },
        set(value) {
          var propName = 'trend';
          var index = this.columnIndex;
          this.$store.dispatch('updateColumn', {index, propName, value});
          if(value == "negative") this.increment = "-1";
          if(value == "positive") this.increment = "1";
        }
      },
      increment: {
        get() {
          return this.columnData.increment;
        },
        set(value) {
          var propName = 'increment';
          var index = this.columnIndex;
          this.$store.dispatch('updateColumn', {index, propName, value});
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
      minValue: {
        get() {
          return this.columnData.minValue;
        },
        set(value) {
          var propName = 'minValue';
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
          // dispatch update column for max/min value based on value
          switch (value) {
            case 'text':
              this.maxValue = "10";
              this.minValue = "1";
              break;
            case 'date':
              var value = new Date().setFullYear(new Date().getFullYear() - 1);
              this.minValue = new Date(value).toJSON().substring(0,10);
              this.maxValue = new Date().toJSON().substring(0,10);
              this.interval = 1;
              break;
            case 'decimal':
            case 'integer':
              this.maxValue = '1000';
              this.minValue = "0";
              break;
          }
        }
      },
      MaxValueLabel: {
        get() {
          var label = "";
          switch (this.dataType) {
            case 'date':
              label = "Maximum date";
              break;
            case 'text':
              label = "Max length";
              break;
            default:
              label = "Max value";
              break;
          }
          return label;
        }
      },
      MinValueLabel: {
        get() {
          var label = "";
          switch (this.dataType) {
            case 'date':
              label = "Minimum date";
              break;
            case 'text':
              label = "Min length";
              break;
            default:
              label = "Min value";
              break;
          }
          return label;
        }
      },
      behavior: {
        get() {
          return this.columnData.behavior;
        },
        set(value) {
          var propName = "behavior";
          var index = this.columnIndex;
          this.$store.dispatch('updateColumn', {index, propName, value});
        }
      },
      file: {
        get() {
          return this.columnData.file;
        },
        set(value) {
          var propName = "file";
          var index = this.columnIndex;
          this.$store.dispatch('updateColumn', {index, propName, value});
        }
      },
      fileName: {
        get() {
          return this.columnData.fileName;
        },
        set(value) {
          var propName = "fileName";
          var index = this.columnIndex;
          this.$store.dispatch('updateColumn', {index, propName, value});
        }
      }
		},
		methods: {
      toggleHierarchy: function (){
        var value = this.hierarchy == 'none' ? 'parent' : 'none';
        var index = this.columnIndex;
        var propName = 'hierarchy';
				this.$store.dispatch('updateColumn', {index, propName, value});
      },
			removeColumn: function(index) {
        this.$store.dispatch('removeColumn', {index});
			},
      addFile: function(evt){
        this.file = evt[0];
      }
		}
	}
</script>
<style media="screen">
  .child {
    padding-left: 1em;
  }
  .parentLabel {
    font-weight: bold;
    font-size: 1.1rem;
  }
  .childLabel {
    font-size: 1.05rem;
  }
</style>
