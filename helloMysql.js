var express = require('express');
var mysql = require('./dbcon.js');
var CORS = require('cors');

var app = express();
app.set('port', 8157);
app.use(express.json());
app.use(express.urlencoded({ extended: false}));
app.use(CORS());

const getAllQuery = 'SELECT * FROM workouts';
const insertQuery = "INSERT INTO workouts (`name`, `reps`, `weight`, `unit`, `date`) VALUES (?,?,?,?,?)";
const updateQuery = "UPDATE workouts SET name=?, reps=?, weight=?, unit=?, date=? WHERE id=? ";
const deleteQuery = "DELETE FROM workouts WHERE id=?";
const dropTableQuery = "DROP TABLE IF EXISTS workouts";
const makeTableQuery = `CREATE TABLE workouts(
                        id INT PRIMARY KEY AUTO_INCREMENT,
                        name VARCHAR(255) NOT NULL,
                        reps INT,
                        weight INT,
                        unit VARCHAR(255) NOT NULL,
                        date DATE);`;

// unit of 0 is lbs, unit of 1 is kg

const getAllData = () => {
  mysql.pool.query(getAllQuery, (err, rows, fields) => {
    if (err) {
      next(err);
      return;
    }
    res.json({rows: rows});
  });
};

app.get('/',function(req,res,next){
  var context = {};
  mysql.pool.query(getAllQuery, (err, rows, fields) => {
    if(err){
      next(err);
      return;
    }
    context.results = JSON.stringify(rows);
    res.send(context);
  });
});

app.post('/',function(req,res,next){
  var {name, reps, weight, unit, date} = req.body;
  mysql.pool.query(insertQuery, 
    [name, reps, weight, unit, date], 
    (err, result) =>{
    if(err){
      next(err);
      return;
    }
    getAllData();
  });
});

app.delete('/',function(req,res,next){
  var context = {};
  mysql.pool.query(deleteQuery, [req.query.id], (err, result) => {
    if(err){
      next(err);
      return;
    }
    context.results = "Deleted " + result.changedRows + " rows.";
    res.send(context);
  });
});


///simple-update?id=2&name=The+Task&done=false&due=2015-12-5
app.put('/',function(req,res,next){
  var context = {};
  mysql.pool.query(updateQuery,
    [req.query.name, req.query.reps, req.query.weight, req.query.units, req.query.date, req.query.id],
    (err, result) =>{
    if(err){
      next(err);
      return;
    }
    context.results = "Updated " + result.changedRows + " rows.";
    res.send(context);
  });
});

app.get('/reset-table',function(req,res,next){
  var context = {};
  mysql.pool.query(dropTableQuery, function(err){
    mysql.pool.query(makeTableQuery, function(err){
      context.results = "Table reset";
      res.send(context);
    })
  });
});

app.listen(app.get('port'), function(){
  console.log('Express started on http://localhost:' + app.get('port') + '; press Ctrl-C to terminate.');
});
