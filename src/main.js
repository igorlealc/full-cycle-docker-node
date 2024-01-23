const express = require('express')
const util = require('util');
const mysql = require('mysql')
const { faker } = require('@faker-js/faker');
const app = express()

function generateConnection() {
  return mysql.createConnection({
    host: process.env.DATABASE_HOST,
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_USER_PASSWORD,
    database: process.env.DATABASE_NAME
  });
}

async function generatePeople() {
  let connection = generateConnection();
  const query = util.promisify(connection.query).bind(connection);
  await query("insert into people set ?", { name: faker.person.fullName() });
  connection.end();
}


async function getPeople() {
  let connection = generateConnection();
  const query = util.promisify(connection.query).bind(connection);
  let people = await query("SELECT * FROM people");
  connection.end();
  return people;
}

function generateHtml(people) {
  let html = '<H1>Full Cycle Rocks!</H1>';
  html += '<br/>'
  people.forEach(function (person) {
    html += person.id + ' - ' + person.name + '<br/>';
  });
  return html;
}

app.get('/', async function (req, res) {
  await generatePeople();
  let people = await getPeople();
  let html = generateHtml(people);
  res.send(html);
})

app.listen(process.env.NODE_PORT)