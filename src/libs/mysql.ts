import mysql from "serverless-mysql";

export const pool = mysql({
  config: {
    localAddress: "localhost",
    user: "root",
    password: "root",
    port: 3306,
    database: "webcursos",
  },
});
