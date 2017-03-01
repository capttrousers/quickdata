var dataColumnObject:
{

  type: ["int", "date", "float", "string"],
  // partent/child
  trend: "positive", // or negative, or neither for randomness
  incrementValue : "1",
    // could be increment
    // positive increment of 1 is AUTO INCREMENT

  allowNulls: false,

  // interval before new random value
  interval : "1",
  /*
    minLength

    maxLength
    maxValue
    minValue

  */
  // file could be comma separated list or csv with max 50 records and two columns of 1 -> many
  file : null

}
