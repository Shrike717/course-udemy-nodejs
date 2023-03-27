const Sequelize = require("sequelize");

const sequelize = new Sequelize("node-complete", "root", "8m%V1h&o*vO5mabu", {
  dialect: "msql",
  host: "localhost"
});

module.exports = sequelize;
