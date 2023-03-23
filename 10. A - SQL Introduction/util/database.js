const mysql = require("mysql2");

// Pool for reusable connections to database
const pool = mysql.createPool({
  host: "localhost",
  user: "root",
  database: "node-complete",
  password: "8m%V1h&o*vO5mabu",
});

module.exports = pool.promise();
