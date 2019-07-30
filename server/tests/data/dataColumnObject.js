

module.exports =
{

  dataType: 'text',       // ["integer", "date", "decimal", "text"],

  // randomly select from the list from the file or expand
  // expand will take each value from the file list, and create X number of random records per value
  // X could be the max interval from any other non-file columnObjects, or a separate input
  // default could be expand, to be X = numberOfRecords / count of list values
  // this could be collapsed into the interval attr
  // really 3 behaviors, randomly select from list (could be < or > list.length), each item in list, expand
  behavior: "random",      // ['random', 'expand']

  count: "1",

  allowNulls: false,

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
  maxValue: "",
  minValue: "",

  // File overrides all the attrs above besides interval and maybe nulls?
  // with a list, it can either be randomly selecting one from the list every time, and getting the other random values
  // or for each on list, get interval number of random values, then get next value on list
  // file could be comma separated list or csv with max 50 records and two columns of 1 -> many
  // possibly process the csv on the client, and create the "List" of possible values.
  // Each value could be a parent child: ['child1:parent1','child2:parent1','child1:parent2','child2:parent2']  as the hierarchy flows upwards
  file : null,

  // parent/child
  hierarchy: 'none',      // ['parent','child','none']
  // if hierarchy is parent, child prop will be the the child's dataColumnObject,
  // but I think the processColumns function pulls this out to an individual columnList item,
  // and adds a "parentIndex" field for all columns, which will be the array index of the parent dataColumnObject
  // so for schema creation function, just keep a child column in the child prop
  child: {},

}
