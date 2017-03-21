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

  type: ["integer", "date", "decimal", "text"],      // data type
  // parent/child
  hierarchy: ['parent','child','none'],           // parent child relationship
  // if hierarchy is parent, child prop will be the the child's dataColumnObject,
  // but I think the processColumns function pulls this out to an individual columnList item,
  // and adds a "parentIndex" field for all columns, which will be the array index of the parent dataColumnObject
  // so for schema creation function, just keep a child column in the child prop
  child: {},

  // these two, trend and increment could be collapsed into a single field, random will be null, then positive or negative trends can be inferred from the increment value
  // trend: ["positive","negative","none"],           // 'none' for randomness
  increment: "1",                           // when trend is positive or negative, this is the increment, Number
    // increment: "none" or null means random value, no trend
    // positive increment of 1 is AUTO INCREMENT

  allowNulls: false,

  // interval before new random value, this will be used in generateData() for the 'counter' values for each dataColumnObject to know when a new random value is needed
  interval : "1",

  // these are constraints on the random value ranges
  /*
    minLength
    maxLength
    maxValue
    minValue
    defaults?
        dates: min = 1/1/2000, max = today();
        integer & decimal min = 0, max = 1000 ;// expand will take each value from the file list, and create X number of random records per value
        text: min = max = 10;
  */
  max: "",
  min: "",

  // File overrides all the attrs above besides interval and maybe nulls?
  // with a list, it can either be randomly selecting one from the list every time, and getting the other random values
  // or for each on list, get interval number of random values, then get next value on list
  // file could be comma separated list or csv with max 50 records and two columns of 1 -> many
  // possibly process the csv on the client, and create the "List" of possible values.
  // Each value could be a parent child: ['child1:parent1','child2:parent1','child1:parent2','child2:parent2']  as the hierarchy flows upwards
  file : null,

  // randomly select from the list from the file or expand
  // expand will take each value from the file list, and create X number of random records per value
  // X could be the max interval from any other non-file columnObjects, or a separate input
  // default could be expand, to be X = numberOfRecords / count of list values
  behavior: "expand"      // ['random', 'expand']

}
