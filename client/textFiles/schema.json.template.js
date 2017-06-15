export default {
 "numberOfRecords": 500,              
 "dataSource": "csv",                 
 "user": "somebody@tableau.com",      
 "sfCase": "01234567",                
 "tableName": "TableName",            
 "columns": [                         
  {
   "dataType": "integer",             
   "hierarchy": "none",               
   "child": {},                       
   "allowNulls": false,               
   "count": 1,                        
   "maxValue": 1000,                  
   "minValue": 0,                     
   "file": null,                      
   "behavior": "random"               
  },
  {
   "dataType": "date",
   "hierarchy": "parent",
   "child": {
    "dataType": "date",
    "hierarchy": "child",
    "child": {},
    "allowNulls": false,
    "count": 1,
    "maxValue": "2017-03-18",
    "minValue": "2010-01-01",
    "file": null,
    "behavior": "random"
   },
   "allowNulls": false,
   "count": 1,
   "maxValue": "2017-03-18",
   "minValue": "2010-01-01",
   "file": null,
   "behavior": "random"
  },
  {
   "dataType": "decimal",
   "hierarchy": "none",
   "child": {},
   "allowNulls": false,
   "count": 1,
   "maxValue": 1000,
   "minValue": 0,
   "file": null,
   "behavior": "random"
  },
  {
   "dataType": "text",
   "hierarchy": "none",
   "child": {},
   "allowNulls": false,
   "count": 1,
   "maxValue": 10,
   "minValue": 1,
   "file": null,
   "behavior": "random"
  },
  {
   "dataType": "file",
   "hierarchy": "none",
   "child": {},
   "allowNulls": false,
   "count": 1,
   "maxValue": 1000,
   "minValue": 0,
   "file": {
    "fields": [
     "Category",
     "Subcategory"
    ],
    "values": [
     {
      "Category": "Category 1",
      "Subcategory": "Sub-category 1"
     },
     {
      "Category": "Category 1",
      "Subcategory": "Sub-category 2"
     },
     {
      "Category": "Category 1",
      "Subcategory": "Sub-category 3"
     },
     {
      "Category": "Category 2",
      "Subcategory": "Sub-category 4"
     },
     {
      "Category": "Category 2",
      "Subcategory": "Sub-category 5"
     },
     {
      "Category": "Category 2",
      "Subcategory": "Sub-category 6"
     },
     {
      "Category": "Category 3",
      "Subcategory": "Sub-category 7"
     },
     {
      "Category": "Category 3",
      "Subcategory": "Sub-category 8"
     },
     {
      "Category": "Category 3",
      "Subcategory": "Sub-category 9"
     }
    ]
   },
   "behavior": "random"
  }
 ]
}