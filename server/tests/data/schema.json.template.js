/*
  ** Will need to create a conversion function that can convert text files to json files to dataColumnObjects and back.
  When using the quickdata tool, users will need to input two sets of info (all caps for variables) :
    1. Info about their use case, such as their email, SFCase if applicable, the table/file name, and the number of records to generate.
        SFCASE, TABLENAME, USEREMAIL, NUMBER_OF_RECORDS, DATASOURCE
    2. Then they will need to input the "schema". This can either be an array of dataColumnObjects like below, or a text/json file that represents the schema.
        HIERARCHY, DATATYPE, TREND, INCREMENT, INTERVAL, NULLS, FILE
*/
// var dataColumnObject:

module.exports =
{
  numberOfRecords: "500",
  dataSource: "csv",
  user: "somebody@tableau.com",
  sfCase: "01234567",
  tableName: "TableName",
  columns: [
    {
      dataType: "integer",             // data type ["integer", "date", "decimal", "text", "file"],
      hierarchy: "none",       // parent child relationship ['parent','child','none']
      child: {},
      allowNulls: false,
      count : "1",
      maxValue: "1000",
      minValue: "0",
      file : null,
      behavior: "random"      // datatype file, randomly select or for each record ['random', 'expand']
    },
    {
      dataType: "date",             // data type ["integer", "date", "decimal", "text", "file"],
      hierarchy: "none",       // parent child relationship ['parent','child','none']
      child: {},
      allowNulls: false,
      count : "1",
      maxValue: "2017-03-18",
      minValue: "2010-01-01",
      file : null,
      behavior: "random"      // datatype file, randomly select or for each record ['random', 'expand']
    },
    {
      dataType: "decimal",             // data type ["integer", "date", "decimal", "text", "file"],
      hierarchy: "none",       // parent child relationship ['parent','child','none']
      child: {},
      allowNulls: false,
      count : "1",
      maxValue: "1000",
      minValue: "0",
      file : null,
      behavior: "random"      // datatype file, randomly select or for each record ['random', 'expand']
    },
    {
      dataType: "text",             // data type ["integer", "date", "decimal", "text", "file"],
      hierarchy: "none",       // parent child relationship ['parent','child','none']
      child: {},
      allowNulls: false,
      count : "1",
      maxValue: "10",
      minValue: "1",
      file : null,
      behavior: "random"      // datatype file, randomly select or for each record ['random', 'expand']
    },
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
