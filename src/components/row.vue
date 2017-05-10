<template lang="pug">
  .row(:class="{child: hierarchy == 'child'}")
    span.parentLabel(v-if="hierarchy != 'child'")  {{ "Column " + (columnIndex + 1) }}
      md-button.md-icon-button.md-warn.md-dense(@click.native="removeColumn(columnIndex)", style="height: 1.5em; min-height: initial;")
          md-icon clear
    span.childLabel(v-else) Child column of Column {{ columnIndex + 1 }}
    md-layout(md-gutter="16")
      md-layout(v-show="hierarchy != 'child'", md-flex="10", md-theme="'row'")
        md-button-toggle.md-primary
          md-button(@click.native="toggleHierarchy", :disabled="['file', 'integer', 'decimal'].indexOf(dataType) >= 0") Parent
      md-layout(md-flex="15", v-if="true")
        md-input-container
          label(for='data-type') Data type
          md-select(name='data-type', v-model="dataType", :disabled="hierarchy == 'child'")
            md-option(v-for="dataTypeOption in dataTypes", :value="dataTypeOption.value", :disabled="hierarchy == 'parent' && ['date', 'text'].indexOf(dataTypeOption.value) < 0")  {{ dataTypeOption.label }}
      md-layout(md-flex="30", v-show="dataType == 'file'")
        md-input-container
          label Data list file
          md-file(v-model="fileName", accept="*", :multiple="false", @selected="addFile($event)")
      md-layout(:md-flex="dataType == 'date' ? 15 : 10", v-show="dataType != 'file' && dataType != 'text'")
        md-input-container
          label {{ MinValueLabel }}
          md-input(v-model="minValue", :type="(dataType == 'date' ? 'date' : 'text')", :disabled="hierarchy == 'child'")
      md-layout(:md-flex="dataType == 'date' ? 15 : 10", v-show="dataType != 'file'")
        md-input-container
          label {{ MaxValueLabel }}
          md-input(v-model="maxValue", :type="(dataType == 'date' ? 'date' : 'text')", :disabled="hierarchy == 'child'")
      md-layout(md-flex="15", v-show="dataType != 'text' && hierarchy == 'none'")
        md-input-container
          label Behavior
          md-select(v-model="behavior")
            md-option(v-for="behaviorOption in behaviors", :value="behaviorOption.value") {{ behaviorOption.label}}
      md-layout(md-flex="10", v-show="(dataType != 'date' && dataType != 'file') || behavior != 'random'")
        md-input-container
          label {{ CountLabel }}
          md-input(v-model="count")
      md-layout(md-flex="10")
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
          if(this.hierarchy != "none" ) {
            return [
              {label: "Text", value: "text"},
              {label: "Date", value: "date"}
        		];
          } else {
            return [
              {label: "Text", value: "text"},
              {label: "Date", value: "date"},
              {label: "Integer", value: "integer"},
              {label: "Decimal", value: "decimal"},
              {label: "File", value: "file"}
        		];
          }
			  }
			},
			behaviors: {
			  get() {
          if(this.dataType != "file" ) {
            return [
              {label: "Random", value: "random"},
        			{label: "Positive Trend", value: "positive"},
        			{label: "Negative Trend", value: "negative"}
        		];
          } else {
            return [
              {label: "Random", value: "random"},
              {label: "Expand", value: "expand"}
        		];
          }
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
          var propName = "fileName";
          var index = this.columnIndex;
          this.$store.dispatch('updateColumn', {index, propName, value});
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
      toggleHierarchy: function (){
        var value = this.hierarchy == 'none' ? 'parent' : 'none';
        var index = this.columnIndex;
        var propName = 'hierarchy';
				this.$store.dispatch('updateColumn', {index, propName, value});
      },
			removeColumn: function(index) {
        this.$store.commit('REMOVE_COLUMN', {index});
			},
      addFile: function(evt){
        this.file = ( evt[0] ) || null;
      }
		}
	}
</script>
<style media="screen">
  .row {
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
