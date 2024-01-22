const express = require('express')
const mysql = require('mysql2')
const app = express()

var connection = mysql.createConnection({
  host     : process.env.DATABASE_HOST,
  user     : process.env.DATABASE_USER,
  password : process.env.DATABASE_USER_PASSWORD,
  database : process.env.DATABASE_NAME
});



function getPeople(){
  let people = [];
  connection.connect(function(err) {
    if (err) throw err;
    con.query("SELECT * FROM people", function (err, result, fields) {
      if (err) throw err;
      people = result;
    });
  });
  connection.end();

  return people;  

}

function generateHtml(){
  try{
    let people = getPeople();
    let html = '<H1>Full Cycle Rocks!</H1>'
    html += '<br/>'
    people.forEach(function (person) {
      html += '${person.id} - ${person.name}<br/>';
    });
  }catch(err){
    return err.toString();
  } 
}

app.get('/', function (req, res) {
  let html = generateHtml();
  res.send(html)
})

app.listen(process.env.NODE_PORT)