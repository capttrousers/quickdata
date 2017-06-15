export default {
text : "\
{\n\
 'numberOfRecords': 500,              // an integer for the number of rows of random data to generate\n\
 'dataSource': 'csv',                 // a string from list: 'csv', 'mssql', 'postgres', or 'mysql'\n\
 'user': 'somebody@tableau.com',      // a string, for the email of the user requesting data\n\
 'sfCase': '01234567',                // a string, for the Salesforce case #. [OPTIONAL]\n\
 'tableName': 'TableName',            // a string, for the desired tableName of random data\n\n\
 'columns': [                         // an array of column objects\n\n\
  {\n\
   'dataType': 'integer',             // a string from list: 'text', 'integer', 'date', 'decimal', 'file'\n\
   'hierarchy': 'none',               // a string from list: 'none', 'parent', 'child'. Explained above\n\
   'child': {},                       // a child object, just a nested column object, in the case that hierarchy == 'parent'\n\
   'allowNulls': false,               // a boolean for if the column will contain nulls\n\
   'count': 1,                        // an integer, either for the interval or the increment. Explained above.\n\
   'maxValue': 1000,                  // an integer for the max allowed value, or text length, or max date in proper date format\n\
   'minValue': 0,                     // same as max value, but doesn't affect 'text' data types.\n\
   'file': null,                      // null if dataType is not 'file'. Otherwise file values object. Shown below\n\
   'behavior': 'random'               // string from list: 'random', 'expand', 'positive', 'negative'. Explained above.\n\
  },\n\
  {\n\
   'dataType': 'date',\n\
   'hierarchy': 'parent',\n\
   'child': {\n\
    'dataType': 'date',\n\
    'hierarchy': 'child',\n\
    'child': {},\n\
    'allowNulls': false,\n\
    'count': 1,\n\
    'maxValue': '2017-03-18',\n\
    'minValue': '2010-01-01',\n\
    'file': null,\n\
    'behavior': 'random'\n\
   },\n\
   'allowNulls': false,\n\
   'count': 1,\n\
   'maxValue': '2017-03-18',\n\
   'minValue': '2010-01-01',\n\
   'file': null,\n\
   'behavior': 'random'\n\
  },\n\
  {\n\
   'dataType': 'decimal',\n\
   'hierarchy': 'none',\n\
   'child': {},\n\
   'allowNulls': false,\n\
   'count': 1,\n\
   'maxValue': 1000,\n\
   'minValue': 0,\n\
   'file': null,\n\
   'behavior': 'random'\n\
  },\n\
  {\n\
   'dataType': 'text',\n\
   'hierarchy': 'none',\n\
   'child': {},\n\
   'allowNulls': false,\n\
   'count': 1,\n\
   'maxValue': 10,\n\
   'minValue': 1,\n\
   'file': null,\n\
   'behavior': 'random'\n\
  },\n\
  {\n\
   'dataType': 'file',\n\
   'hierarchy': 'none',\n\
   'child': {},\n\
   'allowNulls': false,\n\
   'count': 1,\n\
   'maxValue': 1000,\n\
   'minValue': 0,\n\
   'file': {\n\
    'fields': [\n\
     'Category',\n\
     'Subcategory'\n\
    ],\n\
    'values': [\n\
     {\n\
      'Category': 'Category 1',\n\
      'Subcategory': 'Sub-category 1'\n\
     },\n\
     {\n\
      'Category': 'Category 1',\n\
      'Subcategory': 'Sub-category 2'\n\
     },\n\
     {\n\
      'Category': 'Category 1',\n\
      'Subcategory': 'Sub-category 3'\n\
     },\n\
     {\n\
      'Category': 'Category 2',\n\
      'Subcategory': 'Sub-category 4'\n\
     },\n\
     {\n\
      'Category': 'Category 2',\n\
      'Subcategory': 'Sub-category 5'\n\
     },\n\
     {\n\
      'Category': 'Category 2',\n\
      'Subcategory': 'Sub-category 6'\n\
     },\n\
     {\n\
      'Category': 'Category 3',\n\
      'Subcategory': 'Sub-category 7'\n\
     },\n\
     {\n\
      'Category': 'Category 3',\n\
      'Subcategory': 'Sub-category 8'\n\
     },\n\
     {\n\
      'Category': 'Category 3',\n\
      'Subcategory': 'Sub-category 9'\n\
     }\n\
    ]\n\
   },\n\
   'behavior': 'random'\n\
  }\n\
 ]\n\
}\n\
"
}