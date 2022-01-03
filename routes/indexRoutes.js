const adminRoutes = require("./adminRoutes");
const mysql = require("mysql2/promise");
const Joi = require("joi");

let connection;
const DB = async () => {
  connection = await mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "root",
    database: "portfolio",
  });
};

DB();

module.exports = [
  {
    method: "GET",
    path: "/",
    handler: async (request, h) => {
      const [rows, fields] = await connection.query("SELECT * FROM projects");
      return h.view("index", {
        projects: rows,
      });
    },
  },
  {
    method: "GET",
    path: "/details/{id}",
    handler: async (request, h) => {
      const [rows, fields] = await connection.query(
        "SELECT * FROM projects WHERE id = ?",
        request.params.id
      );
      return h.view("index", {
        projects: rows[0],
      });
    },
  },
  {
    method: "POST",
    path: "/test",
    handler: (request, h) => {
      const { payload } = request;
      return payload.image._data;
    },
    options: {
      payload: {
        maxBytes: 209715200,
        output: "stream",
        parse: true,
        multipart: true, // <-- this fixed the media type error
        allow: "multipart/form-data",
      },
    },
  },
].concat(adminRoutes);
