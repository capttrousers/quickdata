var fs = require("fs")
var xmlParse = require("xml2js").parseString
var twb = {}

xmlParse(fs.readFileSync(".\\client\\textFiles\\test-multiple-connections-same-ds.twb", "utf-8"), (err, result) => {twb = result})


// columns located in result.workbook.datasources[]

// datasources[] is an array with a single element: datasource[]
// datasource is an array with objects for each data source connection from the twb
// each datasource array element, is a single datasource obj with  props:
// $ for all values on the datasource XML tag, and connection[], column[], layout[], semantic-values[]
// some data source objs also have an aliases[] prop

/*
  we can ignore semantic-values, aliases, layout
  
  connection has remote column info
  column[] array contains all calc fields > should we ignore these? and make users copy of calc fields? i think so
  
*/


// connection array has single obj with props $, relation[], metadata[]
// connection obj also has cols[] prop which has map[] array prop with mappings for all fields to remote field names
// relation has single obj with props $ and columns[]

// connection.relation.columns has props $ and column[]
// connection.relation.columns.column has elements for each column:
// column obj "$" with props datatype,name,ordinal
// result.workbook.datasources[0].datasource.forEach(DataSourceConnection)
/*
  DataSourceConnection.$.caption == Name_Of_Data_Source
  DataSourceConnection.connection[0] == connection info for this source, including
  


*/