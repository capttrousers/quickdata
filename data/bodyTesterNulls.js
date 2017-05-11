
module.exports =
{
  numberOfRecords: "1000",
  dataSource: "csv",
  user: "somebody@tableau.com",
  sfCase: "01234",
  tableName: "TesterTableName",
  columns: [
    {
      dataType: "integer",             // data type ["integer", "date", "decimal", "text", "file"],
      hierarchy: "none",       // parent child relationship ['parent','child','none']
      child: {},
      allowNulls: true,
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
      allowNulls: true,
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
      allowNulls: true,
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
      allowNulls: true,
      count : "1",
      maxValue: "10",
      minValue: "1",
      file : null,
      behavior: "random"      // datatype file, randomly select or for each record ['random', 'expand']
    }
  ]
}
