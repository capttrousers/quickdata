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
  NUMBER_OF_RECORDS: "500",
  DATASOURCE: "csv",
  USEREMAIL: "somebody@tableau.com",
  SFCASE: "01234",
  TABLENAME: "TableName",
  COLUMNS: [
    {
      type: "integer",             // data type ["integer", "date", "decimal", "text", "file"],
      hierarchy: "none",       // parent child relationship ['parent','child','none']
      child: {},
      increment: "1",          // when trend is positive or negative, this is the increment, Number
      allowNulls: false,
      interval : "1",
      max: "1000",
      min: "0",
      file : null,
      behavior: "expand"      // datatype file, randomly select or for each record ['random', 'expand']
    },
    {
      type: "date",             // data type ["integer", "date", "decimal", "text", "file"],
      hierarchy: "none",       // parent child relationship ['parent','child','none']
      child: {},
      increment: "1",          // when trend is positive or negative, this is the increment, Number
      allowNulls: false,
      interval : "1",
      max: "2017-03-18",
      min: "2010-01-01",
      file : null,
      behavior: "expand"      // datatype file, randomly select or for each record ['random', 'expand']
    },
    {
      type: "decimal",             // data type ["integer", "date", "decimal", "text", "file"],
      hierarchy: "none",       // parent child relationship ['parent','child','none']
      child: {},
      increment: "1",          // when trend is positive or negative, this is the increment, Number
      allowNulls: false,
      interval : "1",
      max: "1000",
      min: "0",
      file : null,
      behavior: "expand"      // datatype file, randomly select or for each record ['random', 'expand']
    },
    {
      type: "text",             // data type ["integer", "date", "decimal", "text", "file"],
      hierarchy: "none",       // parent child relationship ['parent','child','none']
      child: {},
      increment: "1",          // when trend is positive or negative, this is the increment, Number
      allowNulls: false,
      interval : "1",
      max: "10",
      min: "1",
      file : null,
      behavior: "expand"      // datatype file, randomly select or for each record ['random', 'expand']
    },
    {
      type: "file",             // data type ["integer", "date", "decimal", "text", "file"],
      hierarchy: "none",       // parent child relationship ['parent','child','none']
      child: {},
      increment: "1",          // when trend is positive or negative, this is the increment, Number
      allowNulls: false,
      interval : "1",
      max: "0",
      min: "1000",
      file : null,
      behavior: "expand"      // datatype file, randomly select or for each record ['random', 'expand']
    }

  ]
}
