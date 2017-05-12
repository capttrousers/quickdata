
module.exports =
{
  numberOfRecords: "5",
  dataSource: "csv",
  user: "somebody@tableau.com",
  sfCase: "01234",
  tableName: "TableName",
  columns: [
    {
      dataType: "file",             // data type ["integer", "date", "decimal", "text", "file"],
      hierarchy: "none",       // parent child relationship ['parent','child','none']
      child: {},
      allowNulls: false,
      count : "1",
      maxValue: "1000",
      minValue: "0",
      file : {
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
      behavior: "random"      // datatype file, randomly select or for each record ['random', 'expand']
    }
  ]
}
