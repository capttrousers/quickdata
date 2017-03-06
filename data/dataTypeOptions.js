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
  
  type: ["int", "date", "float", "string"],      // data type
  // parent/child
  hierarchy: ['parent','child','none'],           // parent child relationship
  child: {},                                      // if hierarchy is parent, child prop will be the the child's dataColumnObject, but I think the processColumns function pulls this out to an individual columnList item, and adds a "parentIndex" field for all columns, which will be the array index of the parent dataColumnObject

  // these two, trend and increment could be collapsed into a single field, random will be null, then positive or negative trends can be inferred from the increment value
  trend: ["positive","negative","none"],           // 'none' for randomness
  increment: "1",                           // when trend is positive or negative, this is the increment, Number
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
        ints & floats min = 0, max = 1000 ;
        strings: min = max = 10;
  */

  // File overrides all the attrs above besides interval and maybe nulls?
  // with a list, it can either be randomly selecting one from the list every time, and getting the other random values
  // or for each on list, get interval number of random values, then get next value on list
  // file could be comma separated list or csv with max 50 records and two columns of 1 -> many
  // possibly process the csv on the client, and create the "List" of possible values.
  // Each value could be a parent child: ['child1:parent1','child2:parent1','child1:parent2','child2:parent2']  as the hierarchy flows upwards
  file : null

}
