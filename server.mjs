import dotenv from "dotenv";
dotenv.config();

import express from "express";
import mysql from "mysql2";
import cors from "cors";

const port = process.env.PORT || 3001;

//Se inicializa express
const app = express();
app.use(cors());
app.use(express.json());
app.use(
  express.urlencoded({
    extended: true,
  })
);

app.get("/", (req, res) => {
  res.json({ message: "ok" });
});

// Se crea la conexion al a bdd
export const connection = mysql.createConnection({
  host: process.env.MYSQLHOST,
  user: process.env.MYSQLUSER,
  password: process.env.MYSQLPASSWORD,
  database: process.env.MYSQLDATABASE,
  port: process.env.MYSQLPORT,
});

app.get("/getData", (req, res) => {
  connection.query("SELECT * FROM `data`", function (err, results, fields) {
    res.json({ data: results });
  });
});

app.post("/setData", (req, res) => {
  if (req.body?.data) {
    connection.query(
      `INSERT INTO data (data) values (${JSON.stringify(req.body.data)})`,
      (err, results, fields) => {
        if (results?.affectedRows) {
          res.json({ message: "guardado correctamente" });
        } else {
          console.log({ err, results, fields });
          res.json({ message: "Algo paso, revisar el log", err, results });
        }
      }
    );
  } else {
    res.json({
      message: "debe enviar el paramtro data con la info que quiera guardar",
    });
  }
});

// comienza a escuchar
app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
