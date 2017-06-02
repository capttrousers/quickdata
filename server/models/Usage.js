"use strict";


/*
app usage table to log all created tables:
~fields~
 - user // should be string of user email?
 - SF case # // string for the salesforce case number
 - table name  // custom name provided by user
 - create date // TODAY()
 - delete data  // should be a date calculated in the future, maybe default to 1 month in the future




*/

module.exports = function(sequelize, DataTypes) {
  var Usage = sequelize.define("Usage", {
    id: {
      type: DataTypes.INTEGER,
      field: 'rowid',
      primaryKey: true
    },
    User: DataTypes.STRING,
    TableName: DataTypes.STRING,
    SFCase: DataTypes.STRING,
    Created: DataTypes.DATE,
    DataSource: DataTypes.STRING,
    DeleteOn: DataTypes.DATE,
    Deleted: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    }
  }, {
    freezeTableName: true,
    timestamps: false
  });
  return Usage;
};
