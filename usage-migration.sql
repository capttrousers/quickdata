create table `log` as select * from `Usage`;
insert into Usage (User, TableName, SFCase, Created, DataSource, DeleteOn) select `User`, `TableName`, `SFCase`, `Created`, `DataSource`, `Delete`
   from log where `Created` >= datetime('2017-01-25 04:00:00.000');
drop table `log`;
