const mysql = require("mysql2/promise");

const pool = mysql.createPool({
  host: "miel.pe",
  user: "mielpe_userWeb",
  password: "carrito1357@",
  database: "mielpe_tienda"
});

module.exports = pool;