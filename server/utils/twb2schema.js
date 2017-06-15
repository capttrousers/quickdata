var _ = require('lodash')

module.exports = (twb) => {
  // columns located in twb.workbook.datasources[]
  // datasoure is array of ds connections from twb
  var datasource = twb.workbook.datasources[0].datasource
  // Array.isArray(datasource) == true


  // datasource is an array with objects for each data source connection from the twb
  // each datasource array element, is a single datasource obj with  props:
  // DataSourceConnection.$.caption == Name_Of_Data_Source
  // $ for all values on the datasource XML tag, and connection[], column[], layout[], semantic-values[]
  // some data source objs also have an aliases[] prop

  // we can ignore semantic-values, aliases, layout so pick just the connection and column props
  /*
    
    connection has remote column info
    column[] array contains all calc fields > should we ignore these? and make users copy of calc fields? i think so
  */
  // datasource = _.chain(datasource).map((ds)=> { return _.pick(ds, ["connection","column"]) } ).value();

  // array of connections contains connection objs
  // each connection obj is actually an array
  // connection array has single obj with props $, relation[], metadata[]
  // connection obj also has cols[] prop which has map[] array prop with mappings for all fields to remote field names
  // relation has single obj with props $ and columns[], but when there are multiple connections, relation.columns doesnt exist, cols exists instead with mappings
  // need to look at connection.metadata-records
  var connections = _.chain(datasource).map((ds) => { 
                      return { tablename :  ds["$"].caption.replace(/\s/g,"_"),
                               fields : ds.connection[0]["metadata-records"][0]["metadata-record"] 
                             } 
                    }).value();
  var connectionsParsed = _.chain(connections)
                          .map((ds) => { return 
                            { tablename : ds.tablename, 
                              fields: _.chain(ds.fields).filter((col) => { return col["$"].class == "column"; })
                                .map((col) => { 
                                  return _.mapValues(_.pick(col, ["contains-null", "precision", "width", "local-type", "local-name"]), 
                                    (prop) => {return prop[0]; }) ; 
                                }).value() 
                            } ;
                          }).value();

  // local-name and local-type will help create data model
  // local-names are wrapped in brackets: [field name]
  // contains null is always there
  // strings have width
  // ints have precision
  // datetimes / dates have nothing
                
                
  /*  
    connections will be an array of objs, each obj is a single connection
    each connection obj will have the tablename prop of connection and a fields prop which is an array of field objs.
    each field obj contains props for local-name and local-type, as well as optional props: width,contains-null,precision
    will need to loop through connections[] and create body request JSON for each, as each connection is a new data set to make
    
    meta data for body:
      table names will be data connection names, found in twb.workbook.datasources[0].datasource $ caption
      datasource type is CSV
      number of records is 500
      
    
  */


  
  return connectionsParsed;
}