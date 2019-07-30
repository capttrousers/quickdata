
module.exports =
{
  numberOfRecords: "500",
  dataSource: "csv",
  user: "somebody@tableau.com",
  sfCase: "01234",
  tableName: "TesterTableName",
  columns: [
    {
      dataType: "date",             // data type ["integer", "date", "decimal", "text", "file"]
      allowNulls: false,
      count : "1",
      maxValue: "2017-03-18",
      minValue: "2010-01-01",
      file : null,
      behavior: "random",      // datatype file, randomly select or for each record ['random', 'expand']
      hierarchy: "parent",       // parent child relationship ['parent','child','none']
      child: {
        dataType: "date",             // data type ["integer", "date", "decimal", "text", "file"]
        allowNulls: false,
        count : "1",
        maxValue: "2017-03-18",
        minValue: "2010-01-01",
        file : null,
        behavior: "random",      // datatype file, randomly select or for each record ['random', 'expand']
        hierarchy: "child",       // parent child relationship ['parent','child','none']
        child: {}
      }
    }
  ]
}
