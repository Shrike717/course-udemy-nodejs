const Sequelize = require("sequelize");

const sequelize = new Sequelize("node-complete", "root", "8m%V1h&o*vO5mabu", {
  dialect: "mysql",
  host: "localhost"
});

module.exports = sequelize;
