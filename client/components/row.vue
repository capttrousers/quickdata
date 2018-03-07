<template lang="pug">
  .field-row(:class="{child: hierarchy == 'child'}")
    span.parentLabel(v-if="hierarchy != 'child'")  {{ "Column " + (columnIndex + 1) }}
      v-btn(flat, icon, color="red", @click.native="removeColumn(columnIndex)", style="height: 1.5em; min-height: initial;")
          v-icon clear
    span.childLabel(v-else) Child column of Column {{ columnIndex + 1 }}
    v-layout
      v-flex.xs1(v-show="hierarchy != 'child'")
        v-btn-toggle(v-model="hierarchyToggled")
          v-btn(:disabled="['file', 'integer', 'decimal'].indexOf(dataType) >= 0") Parent
      v-flex.xs2
        v-select(:items="dataTypes", v-model="dataType", label="Data type", :disabled="hierarchy == 'child'")
          //- need to implement item disabling, if vuetify supports it:
          //-md-option(v-for="dataTypeOption in dataTypes", :disabled="hierarchy == 'parent' && ['date', 'text'].indexOf(dataTypeOption.value) < 0")
      //-v-flex.xs3(v-show="dataType == 'file'")
        md-input-container
          label Data list file, CSV format
          md-file(v-model="fileName", accept=".csv", :multiple="false", @selected="addFile($event)")
      v-flex.xs2(v-show="dataType != 'file' && dataType != 'text'")
        v-text-field(v-model="minValue", :label="MinValueLabel",
                     :type="(dataType == 'date' ? 'date' : 'text')",
                     :disabled="hierarchy == 'child'")
      v-flex.xs2(v-show="dataType != 'file'")
        v-text-field(v-model="maxValue", :label="MaxValueLabel",
                     :type="(dataType == 'date' ? 'date' : 'text')",
                     :disabled="hierarchy == 'child'")
      v-flex.xs2(v-show="dataType != 'text' && hierarchy == 'none'")
        v-select(:items="behaviors", v-model="behavior", label="Behavior", :disabled="hierarchy == 'child'")
      v-flex.xs1(v-show="(dataType != 'date' && dataType != 'file') || behavior != 'random'")
        v-text-field(v-model="count", :label="CountLabel")
      v-flex.xs2
        v-checkbox(v-model="allowNulls", label="Allow nulls?")
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
          if(this.hierarchy != "none" ) {
            return [
              {text: "Text", value: "text"},
              {text: "Date", value: "date"}
        		];
          } else {
            return [
              {text: "Text", value: "text"},
              {text: "Date", value: "date"},
              {text: "Integer", value: "integer"},
              {text: "Decimal", value: "decimal"},
              // {text: "File", value: "file"}
        		];
          }
			  }
			},
			behaviors: {
			  get() {
          if(this.dataType != "file" ) {
            return [
              {text: "Random", value: "random"},
        			{text: "Positive Trend", value: "positive"},
        			{text: "Negative Trend", value: "negative"}
        		];
          } else {
            return [
              {text: "Random", value: "random"},
              {text: "Expand", value: "expand"}
        		];
          }
			  }
      },
      hierarchyToggled: {
        get() {
          return this.columnData.hierarchy === "none" ? 0 : null;
        },
        set() {
          var value = this.hierarchy == 'none' ? 'parent' : 'none';
          var index = this.columnIndex;
          var propName = 'hierarchy';
          this.$store.dispatch('updateColumn', {index, propName, value});
        }
      },
      hierarchy: {
        get() {
          return this.columnData.hierarchy;
        }
      },
      dataType: {
        get() {
          return this.columnData.dataType;
        },
        set(value) {
          if(this.dataType != value) {
            var propName = 'dataType';
            var index = this.columnIndex;
            this.$store.dispatch('updateColumn', {index, propName, value});
          }
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
      behavior: {
        get() {
          return this.columnData.behavior;
        },
        set(value) {
          if(this.behavior != value) {
            var propName = "behavior";
            var index = this.columnIndex;
            this.$store.dispatch('updateColumn', {index, propName, value});
          }
        }
      },
      count: {
        get() {
          return this.columnData.count;
        },
        set(value) {
          var propName = this.hierarchy == 'child' ? 'child-count' : 'count';
          var index = this.columnIndex;
          this.$store.dispatch('updateColumn', {index, propName, value});
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
          if(value != null && (value.indexOf(".csv") >= 0 || value.length == 0) ) {
            var propName = "fileName";
            var index = this.columnIndex;
            this.$store.dispatch('updateColumn', {index, propName, value});
          }
        }
      },
      CountLabel: {
        get() {
          if(this.behavior == "positive") {
            return "Increment"
          }
          if(this.behavior == "negative") {
            return "Decrement"
          }
          return "Interval";
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
              label = "Length";
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
            default:
              label = "Min value";
              break;
          }
          return label;
        }
      }
		},
		methods: {
			removeColumn: function(index) {
        this.$store.commit('REMOVE_COLUMN', {index});
			},
      addFile: function(evt){
        if(evt[0] != null && evt[0] != undefined) {
          console.log("file name: " + evt[0].name);
          console.log("file type: " + evt[0].type);
          if(evt[0].name.indexOf(".csv") >= 0) {
            this.file = ( evt[0] );
          } else {
            this.fileName = "";
            console.log("file must be a csv file, open snackbar with error");
            // this.refs["errorsnackbar"].open();
          }
        } else {
          this.file = null;
          this.fileName = "";
        }
      }
		}
	}
</script>
<style media="screen">
  .field-row {
    border-top: 3px inset #ccc;
    padding: 1em 0 0 0;
    /*height: 100px;*/
  }
  .child {
    padding: .5em 0 0 1em;
    border-top: 3px solid #eee;
    border-bottom: none;
  }
  .parentLabel {
    font-weight: bold;
    font-size: 1.1rem;
  }
  .childLabel {
    font-size: 1.05rem;
  }
</style>
