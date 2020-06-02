var mysql = require('mysql');
var pool = mysql.createPool({
  connectionLimit : 10,
  host            : 'classmysql.engr.oregonstate.edu',
  user            : 'cs290_bellsar',
  password        : '1529',
  database        : 'cs290_bellsar'
});

module.exports.pool = pool;
