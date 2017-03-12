<template lang="pug">
  .row(:class="{child: hierarchy == 'child'}")
    span.parentLabel(v-if="hierarchy != 'child'")  {{ "Column " + (columnIndex + 1) }}
      md-button.md-icon-button.md-warn.md-dense(@click.native="removeColumn(columnIndex)", style="height: 1.5em; min-height: initial;")
          md-icon clear
    span.childLabel(v-else) Child column of Column {{ columnIndex + 1 }}
    md-layout(md-gutter="24")
      md-layout(v-if="hierarchy != 'child'", md-flex="15", md-theme="'row'")
        md-button-toggle.md-primary
          md-button(@click.native="toggleHierarchy", :disabled="dataType == 'date' || dataType == 'file'") Parent
      md-layout(md-flex="20")
        md-input-container
          label(for='data-type') Data type
          md-select(name='data-type', v-model="dataType", :disabled="hierarchy == 'child'")
            md-option(v-for="dataTypeOption in dataTypes", :value="dataTypeOption.value")  {{ dataTypeOption.text }}
      md-layout(md-flex="30", v-if="dataType == 'file'")
        md-input-container
          label Data list file
          md-file(v-model="fileName", accept="text/*", :multiple="false", @selected="addFile($event)")
      md-layout(md-flex="15", v-if="dataType == 'file'")
        md-input-container
          label Behavior
          md-select(v-model="behavior")
            md-option(value="expand") Expand list
            md-option(value="random") Random
      md-layout(md-flex="30", v-if="dataType != 'file'")
        md-input-container
          label {{ MaxValueLabel }}
          md-input(v-model="maxValue", :type="(dataType == 'date' ? 'date' : 'text')", :disabled="hierarchy == 'child'")
      md-layout(md-flex="20", v-if="(dataType != 'date' && dataType != 'file') || (dataType == 'file' && behavior == 'expand')")
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
          // dispatch update column for max value based on value
          propName = 'maxValue'
          switch (value) {
            case 'text':
              value = '10';
              this.$store.dispatch('updateColumn', {index, propName, value});
              break;
            case 'date':
              var d = new Date();
              // getMonth() is zero indexed
              var mm = d.getMonth() + 1;
              // getDate() is 1 indexed, but minus 1 to start yesterday
              var dd = d.getDate() - 1;
              var yyyy = d.getFullYear();
              value = yyyy + '-' + mm + '-' + dd;
              this.$store.dispatch('updateColumn', {index, propName, value});
              break;
            case 'decimal':
            case 'integer':
              value = '1000';
              this.$store.dispatch('updateColumn', {index, propName, value});
          }
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
              label = "Max length";
              break;
            default:
              label = "Max value";
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
        if(this.hierarchy != 'child') {
          this.$store.dispatch('removeColumn', {index});
        } else {
          this.toggleHierarchy();
        }
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
