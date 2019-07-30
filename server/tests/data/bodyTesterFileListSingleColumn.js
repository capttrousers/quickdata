
module.exports =
{
  numberOfRecords: "500",
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
          "Category"
        ],
        "values": [
          {
           "Category": "Category 1"
          },
          {
           "Category": "Category 2"
          },
          {
           "Category": "Category 3"
          },
          {
           "Category": "Category 4"
          },
          {
           "Category": "Category 5"
          },
          {
           "Category": "Category 6"
          },
          {
           "Category": "Category 7"
          },
          {
           "Category": "Category 8"
          },
          {
           "Category": "Category 9"
          }
        ]
      },
      behavior: "random"      // datatype file, randomly select or for each record ['random', 'expand']
    }
  ]
}


